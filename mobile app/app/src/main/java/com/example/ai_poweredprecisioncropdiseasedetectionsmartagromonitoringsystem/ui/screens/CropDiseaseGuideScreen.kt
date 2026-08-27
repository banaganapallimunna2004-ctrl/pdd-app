package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.CropDisease
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CropDiseaseGuideScreen(
    viewModel: AgroViewModel,
    onBack: () -> Unit
) {
    val allDiseases by viewModel.allDiseases.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var selectedCropFilter by remember { mutableStateOf("All") }
    var selectedDisease by remember { mutableStateOf<CropDisease?>(null) }

    val crops = listOf("All", "Tomato", "Corn", "Rice", "Potato", "Cotton", "Soybean", "Sugarcane", "Peanut", "Apple", "Grape", "Chilli", "Onion")

    val filteredDiseases = allDiseases.filter { disease ->
        (selectedCropFilter == "All" || disease.name.contains(selectedCropFilter, ignoreCase = true)) &&
        (searchQuery.isEmpty() || disease.name.contains(searchQuery, ignoreCase = true) || 
         disease.scientificName.contains(searchQuery, ignoreCase = true))
    }

    LuxuryBackground(imageUrl = "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=1280&auto=format&fit=crop") {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                CenterAlignedTopAppBar(
                    title = {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(stringResource(R.string.disease_guide), fontWeight = FontWeight.Black, color = Color.White)
                            Text(stringResource(R.string.disease_guide_subtitle), fontSize = 11.sp, color = Color.White.copy(alpha = 0.6f))
                        }
                    },
                    navigationIcon = {
                        IconButton(
                            onClick = onBack,
                            modifier = Modifier.padding(start = 8.dp).background(Color.White.copy(alpha = 0.1f), CircleShape)
                        ) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Color.White)
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = Color.Transparent
                    )
                )
            }
        ) { padding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    placeholder = { Text(stringResource(R.string.search_diseases), color = Color.White.copy(alpha = 0.5f)) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Color.White.copy(alpha = 0.6f)) },
                    shape = RoundedCornerShape(24.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color.White,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    )
                )

                LazyRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(crops) { crop ->
                        FilterChip(
                            selected = selectedCropFilter == crop,
                            onClick = { selectedCropFilter = crop },
                            label = { Text(if (crop == "All") stringResource(R.string.all_crops) else crop) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Color.White.copy(alpha = 0.3f),
                                selectedLabelColor = Color.White,
                                containerColor = Color.White.copy(alpha = 0.05f),
                                labelColor = Color.White.copy(alpha = 0.6f)
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                borderColor = Color.White.copy(alpha = 0.15f),
                                selectedBorderColor = Color.White.copy(alpha = 0.4f),
                                selected = selectedCropFilter == crop,
                                enabled = true
                            )
                        )
                    }
                }

                if (filteredDiseases.isEmpty()) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(stringResource(R.string.no_diseases_found), color = Color.White.copy(alpha = 0.5f))
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        items(filteredDiseases) { disease ->
                            DiseaseCard(disease = disease) {
                                selectedDisease = disease
                            }
                        }
                    }
                }
            }
        }
    }

    if (selectedDisease != null) {
        DetectionResultScreen(
            detectionResult = com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens.DetectionResult.Success(selectedDisease!!, 1.0f),
            onBack = { selectedDisease = null },
            onShare = { /* Logic handled in VM */ },
            onRetry = { selectedDisease = null }
        )
    }
}

@Composable
fun DiseaseCard(disease: CropDisease, onClick: () -> Unit) {
    val imageModel = remember(disease.imageUrl) {
        if (disease.imageUrl.startsWith("http")) {
            disease.imageUrl
        } else {
            java.io.File(disease.imageUrl)
        }
    }

    GlassCard(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            AsyncImage(
                model = imageModel,
                contentDescription = null,
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(16.dp)),
                contentScale = ContentScale.Crop
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = disease.name,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
                Text(
                    text = disease.scientificName,
                    color = Color.White.copy(alpha = 0.6f),
                    fontSize = 13.sp,
                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                )
                
                Spacer(modifier = Modifier.height(6.dp))
                
                Surface(
                    color = when(disease.severity.uppercase()) {
                        "HIGH", "CRITICAL" -> Color(0xFFEF9A9A).copy(alpha = 0.15f)
                        "MEDIUM" -> Color(0xFFFFCC80).copy(alpha = 0.15f)
                        else -> Color(0xFFA5D6A7).copy(alpha = 0.15f)
                    },
                    shape = CircleShape,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.1f))
                ) {
                    Text(
                        text = disease.severity,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 2.dp),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = when(disease.severity.uppercase()) {
                            "HIGH", "CRITICAL" -> Color(0xFFEF9A9A)
                            "MEDIUM" -> Color(0xFFFFCC80)
                            else -> Color(0xFFA5D6A7)
                        }
                    )
                }
            }
            
            Icon(
                Icons.AutoMirrored.Filled.ArrowForward, 
                contentDescription = null, 
                tint = Color.White.copy(alpha = 0.3f),
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
