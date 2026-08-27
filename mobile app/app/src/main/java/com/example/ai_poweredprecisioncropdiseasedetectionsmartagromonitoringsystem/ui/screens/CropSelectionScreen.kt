package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroBadge
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel

data class CropCategory(val name: String, val imageUrl: String, val description: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CropSelectionScreen(
    viewModel: AgroViewModel,
    onCropSelected: () -> Unit,
    onBack: () -> Unit
) {
    val allText = stringResource(R.string.all)
    val vegText = stringResource(R.string.vegetables)
    val fruitText = stringResource(R.string.fruits)
    val cropText = stringResource(R.string.field_crops)

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(allText) }
    
    val allCrops = remember(allText, vegText, fruitText, cropText) {
        listOf(
            CropCategory("Auto-Detect", "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80", allText),
            CropCategory("Tomato", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80", vegText),
            CropCategory("Potato", "https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80", vegText),
            CropCategory("Corn", "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80", cropText),
            CropCategory("Paddy", "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", cropText),
            CropCategory("Wheat", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80", cropText),
            CropCategory("Cotton", "file:///android_asset/crops/cotton.jpg", cropText),
            CropCategory("Chilli", "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80", vegText),
            CropCategory("Onion", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80", vegText),
            CropCategory("Garlic", "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80", vegText),
            CropCategory("Spinach", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80", vegText),
            CropCategory("Cucumber", "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80", vegText),
            CropCategory("Apple", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80", fruitText),
            CropCategory("Banana", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80", fruitText),
            CropCategory("Grapes", "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80", fruitText),
            CropCategory("Mango", "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80", fruitText),
            CropCategory("Orange", "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80", fruitText),
            CropCategory("Strawberry", "https://images.unsplash.com/photo-1543528176-61b239494933?auto=format&fit=crop&w=800&q=80", fruitText),
            CropCategory("Watermelon", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80", fruitText),
            CropCategory("Papaya", "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80", fruitText),
            CropCategory("Soybean", "file:///android_asset/crops/soybean.jpg", cropText),
            CropCategory("Sugarcane", "file:///android_asset/crops/sugarcane.jpg", cropText),
            CropCategory("Sunflower", "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80", cropText),
            CropCategory("Peanut", "file:///android_asset/crops/peanut.jpg", cropText)
        )
    }

    val categories = listOf(allText, vegText, fruitText, cropText)
    
    val filteredCrops = remember(selectedCategory, searchQuery) {
        allCrops.filter { 
            (selectedCategory == allText || it.description == selectedCategory) &&
            (searchQuery.isEmpty() || it.name.contains(searchQuery, ignoreCase = true))
        }
    }

    // PREMIUM BACKGROUND: Vibrant Crop Harvest & Fields
    LuxuryBackground(
        imageUrl = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&auto=format&fit=crop",
        alpha = 0.92f
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .size(44.dp)
                        .background(Color.White.copy(alpha = 0.15f), CircleShape)
                ) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Color.White)
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(
                        text = "AgroAI Disease Diagnosis",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AgroColors.AccentGreen,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "Select Crop to Scan 🌾",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))

            GlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                cornerRadius = 20.dp,
                contentPadding = 12.dp
            ) {
                Column {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Search crops (e.g. Tomato, Corn, Wheat)", color = Color.White.copy(alpha = 0.5f), fontSize = 13.sp) },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = AgroColors.AccentGreen) },
                        shape = RoundedCornerShape(14.dp),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AgroColors.AccentGreen,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedContainerColor = Color.Black.copy(alpha = 0.2f),
                            unfocusedContainerColor = Color.Black.copy(alpha = 0.2f)
                        )
                    )
                    
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    ScrollableTabRow(
                        selectedTabIndex = categories.indexOf(selectedCategory).coerceAtLeast(0),
                        containerColor = Color.Transparent,
                        edgePadding = 0.dp,
                        divider = {},
                        indicator = { tabPositions ->
                            val index = categories.indexOf(selectedCategory)
                            if (index != -1) {
                                TabRowDefaults.SecondaryIndicator(
                                    modifier = Modifier.tabIndicatorOffset(tabPositions[index]),
                                    color = AgroColors.AccentGreen
                                )
                            }
                        }
                    ) {
                        categories.forEach { category ->
                            Tab(
                                selected = selectedCategory == category,
                                onClick = { selectedCategory = category },
                                text = {
                                    Text(
                                        text = category.uppercase(),
                                        fontWeight = if (selectedCategory == category) FontWeight.Black else FontWeight.Medium,
                                        fontSize = 11.sp,
                                        letterSpacing = 1.sp,
                                        color = if (selectedCategory == category) Color.White else Color.White.copy(alpha = 0.5f)
                                    )
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 120.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(filteredCrops, key = { it.name }) { category ->
                    CropCard(
                        category = category,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        viewModel.setSelectedCropType(category.name)
                        onCropSelected()
                    }
                }
            }
        }
    }
}

@Composable
fun CropCard(
    category: CropCategory,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(0.85f)
            .clickable { onClick() }
            .shadow(12.dp, RoundedCornerShape(20.dp)),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F2615))
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data(category.imageUrl)
                    .crossfade(true)
                    .build(),
                contentDescription = category.name,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.Transparent, 
                                Color(0xFF05170B).copy(alpha = 0.50f), 
                                Color.Black.copy(alpha = 0.95f)
                            )
                        )
                    )
            )
            
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(14.dp)
            ) {
                AgroBadge(
                    text = category.description, 
                    containerColor = AgroColors.PrimaryGreen.copy(alpha = 0.85f), 
                    contentColor = Color.White
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = category.name,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}
