package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import android.net.Uri
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.concurrent.futures.await
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.HelpOutline
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import java.io.FileOutputStream
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.ui.input.pointer.pointerInput
import coil.compose.AsyncImage
import coil.request.ImageRequest
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ScanScreen(
    viewModel: AgroViewModel,
    onNavigateToCropSelection: () -> Unit = {}
) {
    val context = LocalContext.current
    val isDetecting by viewModel.isDetecting.collectAsState()
    val isValidating by viewModel.isValidating.collectAsState()
    val isImageRejected by viewModel.isImageRejected.collectAsState()
    val rejectionReason by viewModel.rejectionReason.collectAsState()
    val result by viewModel.detectionResult.collectAsState()
    val selectedCropType by viewModel.selectedCropType.collectAsState()

    var pendingCropImagePath by remember { mutableStateOf<String?>(null) }

    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            val inputStream = context.contentResolver.openInputStream(it)
            val file = File(context.cacheDir, "gallery_upload_${System.currentTimeMillis()}.jpg")
            file.outputStream().use { output ->
                inputStream?.copyTo(output)
            }
            pendingCropImagePath = file.absolutePath
        }
    }

    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
        onResult = { granted ->
            hasCameraPermission = granted
        }
    )

    LaunchedEffect(key1 = true) {
        if (!hasCameraPermission) {
            launcher.launch(Manifest.permission.CAMERA)
        }
    }

    val detectionResult = remember(result, isImageRejected) {
        when {
            result != null -> DetectionResult.Success(result!!, 0.95f)
            isImageRejected -> DetectionResult.NonCropDetected
            else -> null
        }
    }

    if (pendingCropImagePath != null) {
        ImageCropSelectionOverlay(
            imagePath = pendingCropImagePath!!,
            onCropConfirmed = { croppedFilePath ->
                pendingCropImagePath = null
                viewModel.scanCrop(croppedFilePath)
            },
            onUseFullImage = {
                val fullPath = pendingCropImagePath!!
                pendingCropImagePath = null
                viewModel.scanCrop(fullPath)
            },
            onCancel = {
                pendingCropImagePath = null
            }
        )
    } else if (detectionResult != null) {
        DetectionResultScreen(
            detectionResult = detectionResult,
            onBack = { viewModel.clearDetection() },
            onShare = { 
                if (result != null) {
                    viewModel.shareDetectionResult(context, result!!)
                }
            },
            onRetry = { viewModel.clearDetection() }
        )
    } else {
        Box(modifier = Modifier.fillMaxSize().background(Color.Black)) {
            if (hasCameraPermission) {
                CameraWithOverlay(
                    viewModel = viewModel,
                    isDetecting = isDetecting,
                    isValidating = isValidating,
                    isImageRejected = isImageRejected,
                    rejectionReason = rejectionReason,
                    selectedCropType = selectedCropType,
                    onOpenGallery = { galleryLauncher.launch("image/*") },
                    onNavigateToCropSelection = onNavigateToCropSelection,
                    onPhotoCaptured = { capturedPath ->
                        pendingCropImagePath = capturedPath
                    }
                )
            } else {
                PermissionDeniedContent(onRequestPermission = {
                    launcher.launch(Manifest.permission.CAMERA)
                })
            }
        }
    }
}

@Composable
private fun CameraWithOverlay(
    viewModel: AgroViewModel,
    isDetecting: Boolean,
    isValidating: Boolean,
    isImageRejected: Boolean,
    rejectionReason: String?,
    selectedCropType: String?,
    onOpenGallery: () -> Unit,
    onNavigateToCropSelection: () -> Unit,
    onPhotoCaptured: (String) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    
    var imageCapture: ImageCapture? by remember { mutableStateOf(null) }
    var lensFacing by remember { mutableIntStateOf(CameraSelector.LENS_FACING_BACK) }
    var flashEnabled by remember { mutableStateOf(false) }
    var camera: Camera? by remember { mutableStateOf(null) }

    val previewView = remember { PreviewView(context) }

    LaunchedEffect(lensFacing) {
        val cameraProvider = ProcessCameraProvider.getInstance(context).await()
        
        val preview = Preview.Builder().build().also {
            it.setSurfaceProvider(previewView.surfaceProvider)
        }

        imageCapture = ImageCapture.Builder()
            .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
            .build()

        val cameraSelector = CameraSelector.Builder()
            .requireLensFacing(lensFacing)
            .build()

        try {
            cameraProvider.unbindAll()
            camera = cameraProvider.bindToLifecycle(
                lifecycleOwner,
                cameraSelector,
                preview,
                imageCapture
            )
        } catch (exc: Exception) {
            Log.e("ScanScreen", "Use case binding failed", exc)
        }
    }

    LaunchedEffect(flashEnabled, camera) {
        camera?.cameraControl?.enableTorch(flashEnabled)
    }

    Box(modifier = Modifier.fillMaxSize()) {
        AndroidView(
            factory = { previewView },
            modifier = Modifier.fillMaxSize()
        )

        ScanningOverlay(isDetecting || isValidating)

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Black.copy(alpha = 0.5f), Color.Transparent, Color.Black.copy(alpha = 0.7f)),
                        startY = 0f,
                        endY = Float.POSITIVE_INFINITY
                    )
                )
        )

        AnimatedVisibility(
            visible = isImageRejected,
            enter = fadeIn() + expandVertically(),
            exit = fadeOut() + shrinkVertically()
        ) {
            RejectionFeedback(
                reason = rejectionReason,
                onDismiss = { viewModel.clearDetection() }
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = { flashEnabled = !flashEnabled },
                    modifier = Modifier.background(Color.Black.copy(alpha = 0.4f), CircleShape)
                ) {
                    Icon(
                        Icons.Default.FlashOn,
                        contentDescription = "Flash",
                        tint = if (flashEnabled) Color.Yellow else Color.White
                    )
                }

                Surface(
                    onClick = onNavigateToCropSelection,
                    color = Color.Black.copy(alpha = 0.6f),
                    shape = RoundedCornerShape(20.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.2f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(if (isDetecting || isValidating) Color.Red else Color(0xFF81C784))
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "AGROAI SCAN TARGET",
                                color = Color(0xFF81C784),
                                fontWeight = FontWeight.Bold,
                                fontSize = 9.sp,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = selectedCropType ?: "Auto-Detect ✨",
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 14.sp
                            )
                        }
                    }
                }

                IconButton(
                    onClick = { 
                        lensFacing = if (lensFacing == CameraSelector.LENS_FACING_BACK) 
                            CameraSelector.LENS_FACING_FRONT else CameraSelector.LENS_FACING_BACK 
                    },
                    modifier = Modifier.background(Color.Black.copy(alpha = 0.4f), CircleShape)
                ) {
                    Icon(Icons.Default.FlipCameraAndroid, contentDescription = "Switch Camera", tint = Color.White)
                }
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                if (isDetecting || isValidating) {
                    AiAgentLoadingCard(isValidating)
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = onOpenGallery,
                            modifier = Modifier
                                .size(56.dp)
                                .background(Color.Black.copy(alpha = 0.4f), CircleShape)
                        ) {
                            Icon(Icons.Default.PhotoLibrary, contentDescription = "Gallery", tint = Color.White)
                        }

                        Box(
                            modifier = Modifier
                                .size(90.dp)
                                .border(4.dp, Color.White, CircleShape)
                                .padding(6.dp)
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.2f))
                                .clickable {
                                    val capture = imageCapture ?: return@clickable
                                    val photoFile = File(
                                        context.cacheDir,
                                        SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US).format(System.currentTimeMillis()) + ".jpg"
                                    )
                                    val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()

                                    capture.takePicture(
                                        outputOptions,
                                        ContextCompat.getMainExecutor(context),
                                        object : ImageCapture.OnImageSavedCallback {
                                            override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                                                onPhotoCaptured(photoFile.absolutePath)
                                            }
                                            override fun onError(exc: ImageCaptureException) {
                                                Log.e("ScanScreen", "Photo capture failed", exc)
                                            }
                                        }
                                    )
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(60.dp)
                                    .background(Color.White, CircleShape)
                            )
                        }

                        IconButton(
                            onClick = { /* Help */ },
                            modifier = Modifier
                                .size(56.dp)
                                .background(Color.Black.copy(alpha = 0.4f), CircleShape)
                        ) {
                            Icon(Icons.AutoMirrored.Filled.HelpOutline, contentDescription = "Help", tint = Color.White)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}

@Composable
private fun AiAgentLoadingCard(isValidating: Boolean) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.Black.copy(alpha = 0.85f)),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.padding(bottom = 32.dp).border(1.dp, Color(0xFF81C784).copy(alpha = 0.4f), RoundedCornerShape(24.dp))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 18.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            CircularProgressIndicator(
                modifier = Modifier.size(24.dp),
                color = Color(0xFF81C784),
                strokeWidth = 2.5.dp
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = if (isValidating) "Validating Plant Image..." else "Analyzing Crop Health...",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                Text(
                    text = "AgroAI Gemini 1.5 Diagnostic Engine",
                    color = Color(0xFFA5D6A7),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
private fun RejectionFeedback(reason: String?, onDismiss: () -> Unit) {
    val isMismatch = reason?.contains("mismatch", ignoreCase = true) == true
    val lines = reason?.split("\n")?.map { it.trim() }?.filter { it.isNotBlank() } ?: emptyList()
    
    val detectedLine = lines.firstOrNull { it.startsWith("Detected", ignoreCase = true) }
    val selectedLine = lines.firstOrNull { it.startsWith("Selected", ignoreCase = true) }
    val messageLines = lines.filter { it != detectedLine && it != selectedLine }
    val mainMessage = if (messageLines.isNotEmpty()) {
        messageLines.joinToString("\n\n")
    } else {
        "The scanned image does not match your selected crop. Please scan genuine crop leaves matching your selection."
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.85f))
            .clickable { onDismiss() },
        contentAlignment = Alignment.Center
    ) {
        GlassCard(
            modifier = Modifier.padding(24.dp),
            cornerRadius = 24.dp
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    Icons.Default.Warning, 
                    contentDescription = null, 
                    tint = if (isMismatch) Color(0xFFFFB74D) else Color(0xFFE57373), 
                    modifier = Modifier.size(52.dp)
                )
                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = if (isMismatch) "Plant Species Mismatch" else "Invalid Image Detected",
                    fontWeight = FontWeight.Black,
                    fontSize = 20.sp,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(12.dp))

                // Badges for detected vs selected
                if (detectedLine != null || selectedLine != null) {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        if (selectedLine != null) {
                            Surface(
                                color = Color(0xFF2E7D32).copy(alpha = 0.35f),
                                shape = RoundedCornerShape(10.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF81C784).copy(alpha = 0.6f)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "🎯 $selectedLine",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFA5D6A7),
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                                )
                            }
                        }
                        if (detectedLine != null) {
                            Surface(
                                color = Color(0xFFD32F2F).copy(alpha = 0.25f),
                                shape = RoundedCornerShape(10.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF9A9A).copy(alpha = 0.5f)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "🔍 $detectedLine",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFFFCDD2),
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                }

                Text(
                    text = mainMessage,
                    fontSize = 13.sp,
                    textAlign = TextAlign.Center,
                    color = Color.White.copy(alpha = 0.9f),
                    lineHeight = 19.sp
                )
                
                Spacer(modifier = Modifier.height(22.dp))
                Button(
                    onClick = onDismiss,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32), contentColor = Color.White),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth().height(50.dp)
                ) {
                    Text("Scan Again / Recheck", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}

@Composable
private fun ScanningOverlay(isActive: Boolean) {
    val infiniteTransition = rememberInfiniteTransition(label = "scanning")
    val scanPosition by infiniteTransition.animateFloat(
        initialValue = 0.1f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(
            animation = tween(2500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scanLine"
    )

    Box(modifier = Modifier.fillMaxSize()) {
        Canvas(modifier = Modifier.fillMaxSize().padding(48.dp)) {
            val strokeWidth = 3.dp.toPx()
            val cornerLength = 40.dp.toPx()
            val color = Color.White.copy(alpha = 0.5f)

            // Corners
            drawLine(color, Offset(0f, 0f), Offset(cornerLength, 0f), strokeWidth)
            drawLine(color, Offset(0f, 0f), Offset(0f, cornerLength), strokeWidth)
            drawLine(color, Offset(size.width, 0f), Offset(size.width - cornerLength, 0f), strokeWidth)
            drawLine(color, Offset(size.width, 0f), Offset(size.width, cornerLength), strokeWidth)
            drawLine(color, Offset(0f, size.height), Offset(cornerLength, size.height), strokeWidth)
            drawLine(color, Offset(0f, size.height), Offset(0f, size.height - cornerLength), strokeWidth)
            drawLine(color, Offset(size.width, size.height), Offset(size.width - cornerLength, size.height), strokeWidth)
            drawLine(color, Offset(size.width, size.height), Offset(size.width, size.height - cornerLength), strokeWidth)

            if (isActive) {
                val y = size.height * scanPosition
                drawLine(
                    color = Color.White.copy(alpha = 0.8f),
                    start = Offset(0f, y),
                    end = Offset(size.width, y),
                    strokeWidth = 2.5.dp.toPx()
                )
            }
        }
    }
}

@Composable
private fun PermissionDeniedContent(onRequestPermission: () -> Unit) {
    com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground(
        imageUrl = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=80"
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
        Icon(
            Icons.Default.CameraAlt,
            contentDescription = null,
            modifier = Modifier.size(80.dp),
            tint = Color.White.copy(alpha = 0.3f)
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            stringResource(R.string.camera_access_needed).uppercase(),
            fontSize = 18.sp,
            fontWeight = FontWeight.Black,
            color = Color.White,
            letterSpacing = 2.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            stringResource(R.string.camera_access_desc),
            textAlign = TextAlign.Center,
            color = Color.White.copy(alpha = 0.6f),
            fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(40.dp))
        Button(
            onClick = onRequestPermission,
            colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color.Black),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth().height(56.dp)
        ) {
            Text("GRANT PERMISSION", fontWeight = FontWeight.Black)
        }
    }
}
}

@Composable
private fun ImageCropSelectionOverlay(
    imagePath: String,
    onCropConfirmed: (String) -> Unit,
    onUseFullImage: () -> Unit,
    onCancel: () -> Unit
) {
    val context = LocalContext.current
    var cropScale by remember { mutableStateOf(1.0f) }
    var cropOffsetX by remember { mutableStateOf(0f) }
    var cropOffsetY by remember { mutableStateOf(0f) }
    var isProcessing by remember { mutableStateOf(false) }

    val originalBitmap = remember(imagePath) {
        try {
            BitmapFactory.decodeFile(imagePath)
        } catch (e: Exception) {
            null
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F140F))
            .systemBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onCancel) {
                    Icon(Icons.Default.Close, contentDescription = "Cancel", tint = Color.White)
                }
                Text(
                    text = "SELECT CROP AREA",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 16.sp,
                    letterSpacing = 1.5.sp
                )
                TextButton(onClick = onUseFullImage) {
                    Text("USE FULL", color = Color(0xFF81C784), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }

            Text(
                text = "Pinch or drag to align infected plant leaf inside the frame",
                color = Color.White.copy(alpha = 0.6f),
                fontSize = 12.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Interactive Crop Box Viewport
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .border(2.dp, Color(0xFF81C784), RoundedCornerShape(24.dp))
                    .background(Color.Black),
                contentAlignment = Alignment.Center
            ) {
                if (originalBitmap != null) {
                    AsyncImage(
                        model = ImageRequest.Builder(context)
                            .data(imagePath)
                            .crossfade(true)
                            .build(),
                        contentDescription = "Crop Frame Target",
                        modifier = Modifier
                            .fillMaxSize()
                            .pointerInput(Unit) {
                                detectTransformGestures { _, pan, zoom, _ ->
                                    cropScale = (cropScale * zoom).coerceIn(0.8f, 3.5f)
                                    cropOffsetX += pan.x
                                    cropOffsetY += pan.y
                                }
                            },
                        contentScale = ContentScale.Fit
                    )
                    
                    // Grid Crop Frame Lines Overlay
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val width = size.width
                        val height = size.height
                        
                        val gridColor = Color.White.copy(alpha = 0.6f)
                        val stroke = 1.5.dp.toPx()
                        
                        // Vertical guidelines
                        drawLine(gridColor, Offset(width / 3f, 0f), Offset(width / 3f, height), stroke)
                        drawLine(gridColor, Offset(2 * width / 3f, 0f), Offset(2 * width / 3f, height), stroke)
                        
                        // Horizontal guidelines
                        drawLine(gridColor, Offset(0f, height / 3f), Offset(width, height / 3f), stroke)
                        drawLine(gridColor, Offset(0f, 2 * height / 3f), Offset(width, 2 * height / 3f), stroke)
                    }
                } else {
                    CircularProgressIndicator(color = Color.White)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Action Buttons
            Button(
                onClick = {
                    if (originalBitmap == null || isProcessing) return@Button
                    isProcessing = true
                    try {
                        val croppedFile = File(context.cacheDir, "cropped_leaf_${System.currentTimeMillis()}.jpg")
                        val out = FileOutputStream(croppedFile)
                        originalBitmap.compress(Bitmap.CompressFormat.JPEG, 92, out)
                        out.flush()
                        out.close()
                        onCropConfirmed(croppedFile.absolutePath)
                    } catch (e: Exception) {
                        Log.e("CropSelection", "Cropping error", e)
                        onUseFullImage()
                    } finally {
                        isProcessing = false
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color.Black),
                enabled = !isProcessing
            ) {
                if (isProcessing) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.Black, strokeWidth = 2.dp)
                } else {
                    Icon(Icons.Default.Crop, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("CONFIRM CROP & DIAGNOSE AI", fontWeight = FontWeight.Black, letterSpacing = 1.sp)
                }
            }
        }
    }
}
