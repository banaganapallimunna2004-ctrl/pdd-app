package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components

import android.annotation.SuppressLint
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.AgroSupplier
import com.google.android.gms.maps.model.LatLng
import com.google.gson.Gson

class MapBridge(
    private val onLocationSelected: (LatLng) -> Unit,
    private val onSupplierSelected: (Int) -> Unit
) {
    private val mainHandler = Handler(Looper.getMainLooper())

    @JavascriptInterface
    fun onLocationSelected(lat: Double, lng: Double) {
        mainHandler.post {
            onLocationSelected(LatLng(lat, lng))
        }
    }

    @JavascriptInterface
    fun onSupplierSelected(supplierId: Int) {
        mainHandler.post {
            onSupplierSelected(supplierId)
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun InteractiveFarmMapView(
    center: LatLng,
    pickedLocation: LatLng?,
    currentLocation: LatLng?,
    suppliers: List<AgroSupplier>,
    mapLayer: String, // "satellite", "streets", "terrain", "hybrid"
    onLocationSelected: (LatLng) -> Unit,
    onSupplierSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var webViewRef by remember { mutableStateOf<WebView?>(null) }
    var isMapLoaded by remember { mutableStateOf(false) }

    val gson = remember { Gson() }
    val suppliersJson = remember(suppliers) { gson.toJson(suppliers) }

    val htmlContent = remember {
        """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                html, body, #map {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    background: #091a10;
                    overflow: hidden;
                }
                .leaflet-control-attribution {
                    display: none !important;
                }
                .custom-map-pin {
                    width: 36px;
                    height: 36px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.5);
                    border: 2px solid #ffffff;
                }
                .custom-map-pin span {
                    transform: rotate(45deg);
                    font-size: 16px;
                    line-height: 1;
                }
                .gps-pulse-outer {
                    width: 26px;
                    height: 26px;
                    background: rgba(0, 230, 118, 0.35);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulseGps 2s infinite;
                }
                .gps-pulse-inner {
                    width: 13px;
                    height: 13px;
                    background: #00E676;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #00E676;
                }
                @keyframes pulseGps {
                    0% { transform: scale(0.9); opacity: 0.9; }
                    70% { transform: scale(1.5); opacity: 0; }
                    100% { transform: scale(0.9); opacity: 0; }
                }
                .leaflet-popup-content-wrapper {
                    background: rgba(10, 31, 19, 0.96) !important;
                    color: #ffffff !important;
                    border: 1.5px solid rgba(0, 230, 118, 0.5) !important;
                    border-radius: 16px !important;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.6) !important;
                    padding: 4px;
                }
                .leaflet-popup-tip {
                    background: rgba(10, 31, 19, 0.96) !important;
                }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                var map = L.map('map', {
                    zoomControl: false,
                    attributionControl: false,
                    fadeAnimation: true,
                    zoomAnimation: true
                }).setView([${center.latitude}, ${center.longitude}], 15);

                var tileLayers = {
                    'satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }),
                    'hybrid': L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 20 }),
                    'streets': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }),
                    'terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 })
                };

                var currentLayerKey = '${mapLayer}';
                var currentLayer = tileLayers[currentLayerKey] || tileLayers['satellite'];
                currentLayer.addTo(map);

                var pickedMarker = null;
                var gpsMarker = null;
                var supplierMarkers = [];

                function createPinIcon(color, emoji) {
                    return L.divIcon({
                        className: 'pin-wrap',
                        html: '<div class="custom-map-pin" style="background:' + color + ';"><span>' + emoji + '</span></div>',
                        iconSize: [36, 36],
                        iconAnchor: [18, 36],
                        popupAnchor: [0, -36]
                    });
                }

                var farmIcon = createPinIcon('#2563eb', '🚜');
                var fertilizerIcon = createPinIcon('#10b981', '🌱');
                var protectionIcon = createPinIcon('#eab308', '🛡️');
                var labIcon = createPinIcon('#8b5cf6', '🔬');
                var equipmentIcon = createPinIcon('#f97316', '⚙️');

                function changeLayer(layerKey) {
                    if (tileLayers[layerKey] && currentLayerKey !== layerKey) {
                        map.removeLayer(currentLayer);
                        currentLayer = tileLayers[layerKey];
                        currentLayer.addTo(map);
                        currentLayerKey = layerKey;
                    }
                }

                function flyToPosition(lat, lng, zoom) {
                    map.flyTo([lat, lng], zoom || 16, { animate: true, duration: 1.2 });
                }

                function updateGpsMarker(lat, lng) {
                    if (gpsMarker) {
                        gpsMarker.setLatLng([lat, lng]);
                    } else {
                        var gpsIcon = L.divIcon({
                            className: 'gps-wrap',
                            html: '<div class="gps-pulse-outer"><div class="gps-pulse-inner"></div></div>',
                            iconSize: [26, 26],
                            iconAnchor: [13, 13]
                        });
                        gpsMarker = L.marker([lat, lng], { icon: gpsIcon }).addTo(map);
                    }
                }

                function updatePickedMarker(lat, lng) {
                    if (pickedMarker) {
                        pickedMarker.setLatLng([lat, lng]);
                    } else {
                        pickedMarker = L.marker([lat, lng], { icon: farmIcon })
                            .addTo(map)
                            .bindPopup('<b style="color:#00E676; font-size:13px;">Selected Farm Plot 🚜</b><br><span style="font-size:11px; color:#c8e6c9;">Plot Verified for Precision AI Telemetry</span>')
                            .openPopup();
                    }
                }

                function clearSuppliers() {
                    supplierMarkers.forEach(function(m) { map.removeLayer(m); });
                    supplierMarkers = [];
                }

                function updateSuppliers(suppliersList) {
                    clearSuppliers();
                    if (!suppliersList || !suppliersList.length) return;

                    suppliersList.forEach(function(s) {
                        var icon = fertilizerIcon;
                        if (s.category === 'protection') icon = protectionIcon;
                        else if (s.category === 'lab') icon = labIcon;
                        else if (s.category === 'equipment') icon = equipmentIcon;

                        var popupHtml = '<div style="font-family:sans-serif; min-width:160px;">' +
                            '<b style="color:#81C784; font-size:13px;">' + s.name + '</b><br/>' +
                            '<span style="color:#e0e0e0; font-size:11px;">' + s.type + '</span><br/>' +
                            '<span style="color:#FFD54F; font-size:11px;">⭐ ' + s.rating + ' • ' + s.status + '</span>' +
                            '</div>';

                        var marker = L.marker([s.latitude, s.longitude], { icon: icon })
                            .addTo(map)
                            .bindPopup(popupHtml);

                        marker.on('click', function() {
                            if (window.AndroidBridge && window.AndroidBridge.onSupplierSelected) {
                                window.AndroidBridge.onSupplierSelected(s.id);
                            }
                        });

                        supplierMarkers.push(marker);
                    });
                }

                map.on('click', function(e) {
                    var lat = Number(e.latlng.lat.toFixed(6));
                    var lng = Number(e.latlng.lng.toFixed(6));
                    updatePickedMarker(lat, lng);
                    if (window.AndroidBridge && window.AndroidBridge.onLocationSelected) {
                        window.AndroidBridge.onLocationSelected(lat, lng);
                    }
                });
            </script>
        </body>
        </html>
        """.trimIndent()
    }

    AndroidView(
        factory = { ctx ->
            WebView(ctx).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    loadWithOverviewMode = true
                    useWideViewPort = true
                    databaseEnabled = true
                    cacheMode = WebSettings.LOAD_DEFAULT
                    mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                }
                addJavascriptInterface(MapBridge(onLocationSelected, onSupplierSelected), "AndroidBridge")
                webViewClient = object : WebViewClient() {
                    override fun onPageFinished(view: WebView?, url: String?) {
                        super.onPageFinished(view, url)
                        isMapLoaded = true
                        webViewRef = view
                        pickedLocation?.let {
                            view?.evaluateJavascript("updatePickedMarker(${it.latitude}, ${it.longitude});", null)
                        }
                        currentLocation?.let {
                            view?.evaluateJavascript("updateGpsMarker(${it.latitude}, ${it.longitude});", null)
                        }
                        view?.evaluateJavascript("updateSuppliers($suppliersJson);", null)
                    }
                }
                loadDataWithBaseURL("https://agroai.app", htmlContent, "text/html", "UTF-8", null)
                webViewRef = this
            }
        },
        update = { webView ->
            webViewRef = webView
            if (isMapLoaded) {
                webView.evaluateJavascript("changeLayer('$mapLayer');", null)
                pickedLocation?.let {
                    webView.evaluateJavascript("updatePickedMarker(${it.latitude}, ${it.longitude});", null)
                }
                currentLocation?.let {
                    webView.evaluateJavascript("updateGpsMarker(${it.latitude}, ${it.longitude});", null)
                }
                webView.evaluateJavascript("updateSuppliers($suppliersJson);", null)
            }
        },
        modifier = modifier.fillMaxSize()
    )

    LaunchedEffect(center, isMapLoaded) {
        if (isMapLoaded) {
            webViewRef?.evaluateJavascript("flyToPosition(${center.latitude}, ${center.longitude}, 15);", null)
        }
    }

    LaunchedEffect(pickedLocation, isMapLoaded) {
        if (isMapLoaded && pickedLocation != null) {
            webViewRef?.evaluateJavascript("updatePickedMarker(${pickedLocation.latitude}, ${pickedLocation.longitude});", null)
        }
    }

    LaunchedEffect(currentLocation, isMapLoaded) {
        if (isMapLoaded && currentLocation != null) {
            webViewRef?.evaluateJavascript("updateGpsMarker(${currentLocation.latitude}, ${currentLocation.longitude});", null)
        }
    }

    LaunchedEffect(suppliersJson, isMapLoaded) {
        if (isMapLoaded) {
            webViewRef?.evaluateJavascript("updateSuppliers($suppliersJson);", null)
        }
    }

    LaunchedEffect(mapLayer, isMapLoaded) {
        if (isMapLoaded) {
            webViewRef?.evaluateJavascript("changeLayer('$mapLayer');", null)
        }
    }
}
