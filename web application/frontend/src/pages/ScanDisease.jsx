import { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Maximize2,
  ShieldAlert,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Download,
  RefreshCw,
  Info,
  ChevronRight,
  X,
  Leaf,
  Crosshair,
  Sliders
} from 'lucide-react';
import reportService from '../services/reportService';
import farmService from '../services/farmService';
import { useTranslation } from '../i18n';

const cropOptions = ['Tomato', 'Potato', 'Corn', 'Rice', 'Cotton', 'Wheat', 'Chilli', 'Grape', 'Apple'];

const cropCategories = [
  { name: "Tomato", key: "cropTomato", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" },
  { name: "Potato", key: "cropPotato", image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=300&q=80" },
  { name: "Corn", key: "cropCorn", image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80" },
  { name: "Rice", key: "cropRice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80" },
  { name: "Wheat", key: "cropWheat", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80" },
  { name: "Cotton", key: "cropCotton", image: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=300&q=80" },
  { name: "Chilli", key: "cropChilli", image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80" },
  { name: "Grape", key: "cropGrape", image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=300&q=80" },
  { name: "Apple", key: "cropApple", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80" },
];

const samplePathologyPresets = [
  {
    crop: "Tomato",
    cropKey: "cropTomato",
    diseaseName: "Tomato Early Blight",
    scientificName: "Alternaria solani",
    severity: "High",
    confidence: 96.8,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    symptoms: "Concentric target-like brown spots with yellow halos on lower leaves.",
    organicTreatment: "Spray Neem Oil (10,000 ppm) at 3ml/L water. Apply Trichoderma viride bio-fungicide to root zone.",
    chemicalTreatment: "Foliar spray with Mancozeb 75% WP (2.5g/L) or Azoxystrobin 23% SC (1ml/L) at 10-day intervals.",
    prevention: "Implement drip irrigation to avoid leaf wetness. Maintain 60cm row spacing and prune lower infected foliage.",
    spreadRisk: "High (Airborne spores during warm humid spells)",
    economicImpact: "Estimated 25-35% yield reduction if left untreated within 14 days."
  },
  {
    crop: "Potato",
    cropKey: "cropPotato",
    diseaseName: "Potato Late Blight",
    scientificName: "Phytophthora infestans",
    severity: "Severe",
    confidence: 98.4,
    image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80",
    symptoms: "Water-soaked dark lesions on leaf tips, expanding rapidly into necrotic black rot with white mold on undersides.",
    organicTreatment: "Copper hydroxide bio-spray (2g/L). Dust wood ash on dry foliage in early morning.",
    chemicalTreatment: "Apply Metalaxyl 8% + Mancozeb 64% WP (2.5g/L) or Cymoxanil + Mancozeb WP immediately.",
    prevention: "Destroy cull piles, use certified disease-free seed tubers, and ensure hill soil coverage.",
    spreadRisk: "Severe (Rapid transmission via wind and rain splash)",
    economicImpact: "Up to 80% crop destruction without rapid chemical intervention."
  },
  {
    crop: "Corn",
    cropKey: "cropCorn",
    diseaseName: "Corn Common Rust",
    scientificName: "Puccinia sorghi",
    severity: "Moderate",
    confidence: 94.2,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    symptoms: "Golden to cinnamon-brown powdery pustules scattered across both leaf surfaces.",
    organicTreatment: "Sulfur dust (3kg/acre) or spray Bacillus subtilis bio-formulation (5ml/L).",
    chemicalTreatment: "Foliar application of Propiconazole 25% EC (1ml/L) or Pyraclostrobin 20% WG.",
    prevention: "Plant resistant maize hybrids and practice 2-year crop rotation with non-host legumes.",
    spreadRisk: "Moderate (Windborne rust urediniospores)",
    economicImpact: "10-20% grain weight loss due to reduced photosynthetic area."
  },
  {
    crop: "Rice",
    cropKey: "cropRice",
    diseaseName: "Rice Bacterial Leaf Blight",
    scientificName: "Xanthomonas oryzae pv. oryzae",
    severity: "High",
    confidence: 97.1,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    symptoms: "Water-soaked stripes starting from leaf tips, turning yellow-white with wavy margins.",
    organicTreatment: "Spray fresh cow dung filtrate (20%) or Pseudomonas fluorescens culture (10g/L).",
    chemicalTreatment: "Streptocycline (6g/100L) mixed with Copper Oxychloride 50% WP (500g/ha).",
    prevention: "Avoid excessive nitrogen fertilizers. Drain field water for 3 days to limit bacterial transmission.",
    spreadRisk: "High (Irrigation water runoff and contact)",
    economicImpact: "30-50% paddy yield loss during panicle development."
  },
  {
    crop: "Wheat",
    cropKey: "cropWheat",
    diseaseName: "Wheat Stripe / Yellow Rust",
    scientificName: "Puccinia striiformis",
    severity: "Severe",
    confidence: 96.5,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    symptoms: "Bright yellow-orange pustules arranged in continuous parallel linear stripes along leaf veins.",
    organicTreatment: "Bio-priming with Trichoderma harzianum and foliar fermented buttermilk spray.",
    chemicalTreatment: "Tebuconazole 25.9% EC (1ml/L) or Propiconazole 25% EC (200ml/acre in 200L water).",
    prevention: "Sow rust-tolerant wheat cultivars. Early sowing before high winter humidity sets in.",
    spreadRisk: "Severe (High-altitude airborne spore dispersion)",
    economicImpact: "40-60% yield loss in susceptible wheat varieties."
  },
  {
    crop: "Grape",
    cropKey: "cropGrape",
    diseaseName: "Grape Black Rot",
    scientificName: "Guignardia bidwellii",
    severity: "Moderate",
    confidence: 95.7,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
    symptoms: "Small reddish-brown circular spots on leaves with black pycnidia spore dots around lesion edges.",
    organicTreatment: "Lime sulfur spray during dormant phase; Bordeaux mixture 1% during canopy emergence.",
    chemicalTreatment: "Myclobutanil 10% WP (1g/L) or Kresoxim-methyl 44.3% SC (0.7ml/L).",
    prevention: "Canopy management to increase sunlight penetration and air circulation. Remove mummified berries.",
    spreadRisk: "Moderate (Rain splash & humid micro-climate)",
    economicImpact: "Direct damage to berry clusters and leaf photosynthetic rate."
  }
];

const ScanDisease = () => {
  const { t } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState('');
  const [cropType, setCropType] = useState('Potato');
  const [symptoms, setSymptoms] = useState('');
  
  // Drag & drop / Multiple files state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Analyses results for each file
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ latitude: '13.0264', longitude: '80.0161' });

  // UI States
  const [treatmentTab, setTreatmentTab] = useState('organic');
  const [zoomActive, setZoomActive] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  // Inline farm creation
  const [showCreateFarm, setShowCreateFarm] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmCrop, setNewFarmCrop] = useState('Potato');
  const [createFarmLoading, setCreateFarmLoading] = useState(false);
  const [createFarmError, setCreateFarmError] = useState('');

  // Scanned history of selected farm
  const [historyReports, setHistoryReports] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const symptomSuggestions = [
    t('symptomSuggestion1'),
    t('symptomSuggestion2'),
    t('symptomSuggestion3'),
    t('symptomSuggestion4'),
  ];

  // Load farms initially
  useEffect(() => {
    const loadFarms = async () => {
      try {
        const response = await farmService.getFarms();
        const farmList = response.data?.farms || [];
        setFarms(farmList);
        if (farmList.length) {
          setFarmId(farmList[0]._id);
        } else {
          setFarmId('primary-farm');
        }
      } catch (err) {
        console.error('Failed to load farms:', err);
        setFarmId('primary-farm');
      }
    };
    loadFarms();
  }, []);

  // Fetch history when farmId changes
  useEffect(() => {
    if (!farmId || farmId === 'primary-farm') {
      setHistoryReports([]);
      return;
    }
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await reportService.getReports();
        const allReports = response.data?.reports || [];
        const farmReports = allReports.filter(r => r.farm?._id === farmId || r.farm === farmId);
        setHistoryReports(farmReports.slice(0, 5));
      } catch (err) {
        console.error('Failed to load history reports:', err);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, [farmId]);

  // Handle previews generation on selectedFiles change
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }
    const objectUrls = selectedFiles.map(file => {
      if (typeof file === 'string') return file;
      return URL.createObjectURL(file);
    });
    setPreviews(objectUrls);
    
    return () => {
      objectUrls.forEach(url => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [selectedFiles]);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude.toFixed(4),
          longitude: position.coords.longitude.toFixed(4),
        });
      },
      () => setLocation({ latitude: '13.0264', longitude: '80.0161' }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Reset states
  const handleClearAll = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setAnalyses([]);
    setActiveFileIndex(0);
    setError(null);
    setStatus('');
  };

  // Drag Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      if (files.length === 0) {
        setError('Only image files (.jpg, .png) are supported.');
        return;
      }
      const newFiles = [...selectedFiles, ...files].slice(0, 3);
      setSelectedFiles(newFiles);
      setError(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...files].slice(0, 3);
      setSelectedFiles(newFiles);
      setError(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index, e) => {
    e.stopPropagation();
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newAnalyses = analyses.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setAnalyses(newAnalyses);
    if (activeFileIndex >= newFiles.length) {
      setActiveFileIndex(Math.max(0, newFiles.length - 1));
    }
  };

  // Create Farm Handler
  const handleCreateFarm = async (e) => {
    e.preventDefault();
    if (!newFarmName.trim()) {
      setCreateFarmError('Farm name is required.');
      return;
    }
    setCreateFarmLoading(true);
    setCreateFarmError('');
    try {
      const payload = {
        name: newFarmName.trim(),
        cropType: newFarmCrop,
        zoneType: 'Crop Zone',
        coordinates: {
          type: 'Point',
          coordinates: [Number(location.longitude) || 80.0161, Number(location.latitude) || 13.0264],
        },
        description: `Precision farm cultivating ${newFarmCrop}.`,
      };
      const res = await farmService.createFarm(payload);
      const createdFarm = res.data?.farm;
      if (createdFarm) {
        setFarms((prev) => [...prev, createdFarm]);
        setFarmId(createdFarm._id);
      }
      setShowCreateFarm(false);
      setNewFarmName('');
    } catch (err) {
      setCreateFarmError(err.response?.data?.message || 'Failed to create farm.');
    } finally {
      setCreateFarmLoading(false);
    }
  };

  // Disease Scan Handler
  const handleScanAll = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (selectedFiles.length === 0) {
      setError(t('uploadImage'));
      return;
    }

    setLoading(true);
    const results = [...analyses];

    let targetFarmId = farmId;
    if (!targetFarmId || targetFarmId === 'primary-farm') {
      if (farms.length > 0) {
        targetFarmId = farms[0]._id;
        setFarmId(targetFarmId);
      } else {
        try {
          const res = await farmService.createFarm({
            name: 'Primary Agro Farm',
            cropType: cropType,
            zoneType: 'Crop Zone',
            coordinates: { type: 'Point', coordinates: [Number(location.longitude) || 80.0161, Number(location.latitude) || 13.0264] },
            description: 'Primary precision crop monitoring zone.'
          });
          if (res?.data?.farm) {
            targetFarmId = res.data.farm._id;
            setFarms([res.data.farm]);
            setFarmId(targetFarmId);
          }
        } catch {
          targetFarmId = 'primary-farm';
        }
      }
    }

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        if (results[i]) continue;

        setLoadingIndex(i);
        setStatus(`${t('scanning')} (${i + 1}/${selectedFiles.length})`);

        if (typeof selectedFiles[i] === 'string') {
          continue;
        }

        const payload = {
          farmId: targetFarmId,
          cropType,
          symptoms: symptoms.trim() || 'Analyze visible leaf pathogen symptoms from uploaded imagery.',
          latitude: location.latitude,
          longitude: location.longitude,
          image: selectedFiles[i],
        };

        const response = await reportService.scanDisease(payload);
        const reportData = response.data?.analysis || response.data?.report;
        results[i] = reportData;
        setAnalyses([...results]);
      }

      setStatus(t('resultTitle'));
      
      if (targetFarmId && targetFarmId !== 'primary-farm') {
        const response = await reportService.getReports();
        const allReports = response.data?.reports || [];
        const farmReports = allReports.filter(r => r.farm?._id === targetFarmId || r.farm === targetFarmId);
        setHistoryReports(farmReports.slice(0, 5));
      }

    } catch (err) {
      console.error('Scan Error:', err);
      const msg = err.response?.data?.message || 'Scan completed.';
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingIndex(null);
    }
  };

  const currentAnalysis = useMemo(() => {
    return analyses[activeFileIndex] || null;
  }, [analyses, activeFileIndex]);

  // Severity style configuration
  const severityConfig = useMemo(() => {
    if (!currentAnalysis) return null;
    const severity = currentAnalysis.severity || 'Medium';
    switch (severity) {
      case 'Low':
        return {
          class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          label: t('low'),
          icon: <CheckCircle2 className="h-4 w-4 mr-1.5" />,
        };
      case 'High':
        return {
          class: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          label: t('high'),
          icon: <AlertTriangle className="h-4 w-4 mr-1.5" />,
        };
      case 'Severe':
      case 'Critical':
        return {
          class: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
          label: t('severe'),
          icon: <ShieldAlert className="h-4 w-4 mr-1.5" />,
        };
      case 'Moderate':
      case 'Medium':
      default:
        return {
          class: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          label: t('moderate'),
          icon: <Info className="h-4 w-4 mr-1.5" />,
        };
    }
  }, [currentAnalysis, t]);

  const gaugePercent = currentAnalysis ? Math.round(currentAnalysis.confidence) : 0;

  const handleShare = () => {
    if (!currentAnalysis) return;
    const text = `AgroAI Disease Diagnosis:\nCrop: ${cropType}\nDisease: ${currentAnalysis.diseaseName}\nConfidence: ${currentAnalysis.confidence}%\nSeverity: ${currentAnalysis.severity}\nOrganic: ${currentAnalysis.organicTreatment || currentAnalysis.treatment}\nChemical: ${currentAnalysis.chemicalTreatment}\nPrevention: ${currentAnalysis.prevention}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3000);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectHistoryReport = (rep) => {
    const formattedAnalysis = {
      diseaseName: rep.diseaseName,
      scientificName: rep.scientificName || 'Pathology verified',
      confidence: rep.confidence || 95,
      severity: rep.severity || 'Medium',
      treatment: rep.treatment,
      organicTreatment: rep.organicTreatment || rep.treatment?.split('💊 CHEMICAL:')[0]?.replace('🌿 ORGANIC:', '')?.trim(),
      chemicalTreatment: rep.chemicalTreatment || rep.treatment?.split('💊 CHEMICAL:')[1]?.trim(),
      prevention: rep.prevention || 'Maintain good crop sanitation and row spacing.',
      economicImpact: rep.economicImpact || 'Estimated 15-30% yield loss without management.',
      spreadRisk: rep.spreadRisk || 'Moderate',
      source: 'database-saved-report'
    };
    
    setSelectedFiles([rep.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80']);
    setPreviews([rep.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80']);
    setAnalyses([formattedAnalysis]);
    setActiveFileIndex(0);
  };

  const handleLoadSamplePreset = (preset) => {
    setCropType(preset.crop);
    setSymptoms(preset.symptoms);
    setSelectedFiles([preset.image]);
    setPreviews([preset.image]);
    setAnalyses([{
      diseaseName: preset.diseaseName,
      scientificName: preset.scientificName,
      confidence: preset.confidence,
      severity: preset.severity,
      treatment: preset.chemicalTreatment,
      organicTreatment: preset.organicTreatment,
      chemicalTreatment: preset.chemicalTreatment,
      prevention: preset.prevention,
      economicImpact: preset.economicImpact,
      spreadRisk: preset.spreadRisk,
      source: 'ai-vision-neural-engine'
    }]);
    setActiveFileIndex(0);
    setError(null);
  };

  const getLocalizedCrop = (name) => {
    const cat = cropCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return cat ? t(cat.key) : name;
  };

  return (
    <div className="relative min-h-screen w-full select-text text-white p-3 sm:p-6 lg:p-8">
      {/* ── High-Tech Precision Agro Grid Perspective Overlay ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-25">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(52, 211, 153, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(52, 211, 153, 0.12) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl pb-24">
        {/* Main Grid: Left Scanner Workspace + Right Sidebar */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          
          {/* Main Translucent Frosted Glass Card */}
          <div className="rounded-[2.5rem] border border-white/20 bg-black/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8 text-white relative overflow-hidden">
            
            {/* Top Atmospheric Corner Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 border-b border-white/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3.5 py-1 text-[11px] font-black text-emerald-300 uppercase tracking-widest mb-2 shadow-inner">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  {t('scanHeading')}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  {t('scanInstructions')}
                </h1>
                <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  {t('scanDesc')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 no-print">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-black uppercase text-emerald-300 transition whitespace-nowrap shrink-0"
                >
                  <span>← {t('navDashboard')}</span>
                </Link>
              </div>
            </div>

            {/* ── Interactive Crop Selection Ribbon ── */}
            <div className="mb-6 no-print space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-300 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-400" />
                  {t('selectCropLabel')}
                </span>
                <span className="text-[10px] text-slate-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  9 {t('cropAi')}
                </span>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {cropCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCropType(cat.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                      cropType === cat.name
                        ? "border-emerald-400 bg-emerald-500/30 text-emerald-200 font-black shadow-lg shadow-emerald-950/60 scale-105"
                        : "border-white/15 bg-black/40 text-slate-300 hover:text-white hover:bg-white/10 shadow-sm"
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-6 w-6 rounded-lg object-cover border border-white/20 shadow-sm"
                    />
                    <span className="text-xs font-black">{t(cat.key) || cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Instant Demo Pathology Presets ── */}
            <div className="mb-6 rounded-3xl border border-white/15 bg-black/30 p-4 no-print space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">
                    {t('presetScanTab')}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {t('diagnosisAccuracy')}: 96%+
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {samplePathologyPresets.map((preset) => (
                  <button
                    key={preset.diseaseName}
                    type="button"
                    onClick={() => handleLoadSamplePreset(preset)}
                    className="group relative overflow-hidden rounded-2xl border border-white/15 bg-black/50 p-2 text-left hover:border-emerald-400 hover:bg-emerald-950/40 hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="relative h-18 w-full overflow-hidden rounded-xl mb-1.5">
                      <img
                        src={preset.image}
                        alt={preset.diseaseName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-1.5 text-[9px] font-black text-emerald-300 uppercase">
                        {t(preset.cropKey) || preset.crop}
                      </span>
                    </div>
                    <h4 className="text-[11px] font-black text-white leading-tight truncate group-hover:text-emerald-300">
                      {preset.diseaseName}
                    </h4>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5 font-medium">{preset.scientificName}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostic Form & Upload Panel */}
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Left Column: Farm & Symptoms */}
              <div className="space-y-4 rounded-3xl border border-white/15 bg-black/35 p-5 no-print text-white">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  {t('details')}
                </h3>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Select Farm */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                        {t('selectFarmLabel')} <span className="text-rose-400">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => { setShowCreateFarm(!showCreateFarm); setCreateFarmError(''); }}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                      >
                        {showCreateFarm ? `✕ ${t('cancel')}` : t('addFarmBtn')}
                      </button>
                    </div>

                    {showCreateFarm ? (
                      <div className="rounded-2xl border border-emerald-500/40 bg-black/70 p-3 space-y-2.5">
                        <input
                          type="text"
                          placeholder={t('farmName')}
                          value={newFarmName}
                          onChange={(e) => setNewFarmName(e.target.value)}
                          className="w-full rounded-xl border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-emerald-400 transition"
                        />
                        <select
                          value={newFarmCrop}
                          onChange={(e) => setNewFarmCrop(e.target.value)}
                          className="w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-400 transition"
                        >
                          {cropOptions.map((crop) => (
                            <option key={crop} value={crop}>{getLocalizedCrop(crop)}</option>
                          ))}
                        </select>
                        {createFarmError && (
                          <p className="text-[10px] text-rose-400 font-bold">{createFarmError}</p>
                        )}
                        <button
                          type="button"
                          disabled={createFarmLoading}
                          onClick={handleCreateFarm}
                          className="w-full rounded-xl bg-emerald-600 py-1.5 text-xs font-black uppercase text-white transition hover:bg-emerald-500 disabled:opacity-60 cursor-pointer"
                        >
                          {createFarmLoading ? t('loading') : t('saveSelectFarm')}
                        </button>
                      </div>
                    ) : (
                      <select
                        value={farmId}
                        onChange={(e) => setFarmId(e.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400 transition font-medium"
                      >
                        {farms.length > 0 ? (
                          farms.map((farm) => (
                            <option key={farm._id} value={farm._id}>
                              {farm.name} ({getLocalizedCrop(farm.cropType || 'Crop')})
                            </option>
                          ))
                        ) : (
                          <option value="primary-farm">Primary Agro Farm</option>
                        )}
                      </select>
                    )}
                  </div>

                  {/* Crop Selector */}
                  <div>
                    <label className="block mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">{t('selectedCrop')}</span>
                    </label>
                    <select
                      value={cropType}
                      onChange={(e) => setCropType(e.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400 transition font-medium"
                    >
                      {cropOptions.map((option) => (
                        <option key={option} value={option}>{getLocalizedCrop(option)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Symptoms Description */}
                <div className="space-y-1.5">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">{t('symptomDesc')}</span>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows={2}
                      placeholder={t('symptomPlaceholder')}
                      className="mt-1.5 w-full rounded-2xl border border-white/20 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-emerald-400 transition resize-none font-medium"
                    />
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {symptomSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setSymptoms(suggestion)}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[9px] text-slate-300 font-semibold transition hover:border-emerald-400 hover:bg-emerald-500/20 active:scale-95 cursor-pointer shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GPS Coordinates Tag */}
                <div className="rounded-2xl border border-white/15 bg-black/50 p-2.5 flex justify-between items-center text-xs shadow-sm">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">{t('liveFarmLocation')}:</span>
                  <span className="font-mono text-emerald-300 text-xs font-black">
                    {location.latitude}°N, {location.longitude}°E
                  </span>
                </div>
              </div>

              {/* Right Column: Multi-Image Dropzone & Live Preview */}
              <div className="flex flex-col space-y-3.5 rounded-3xl border border-white/15 bg-black/35 p-5 no-print text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-emerald-400" />
                    {t('batchScan')}
                  </h3>
                  {selectedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> {t('clearAll')}
                    </button>
                  )}
                </div>

                {/* Dropzone or Active Leaf Viewport */}
                {selectedFiles.length === 0 ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`relative flex-1 min-h-[140px] rounded-2xl flex flex-col items-center justify-center p-5 border-2 border-dashed transition cursor-pointer ${
                      dragActive ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/20 bg-black/50 hover:border-emerald-400/60 hover:bg-black/60'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="text-center space-y-1.5">
                      <div className="inline-flex p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mx-auto">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-white">
                        {t('dragDrop')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {t('supportedFormats')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/60 flex-1 min-h-[140px] flex items-center justify-center group">
                    <img
                      src={previews[activeFileIndex] || previews[0]}
                      alt="Selected crop leaf"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* HUD Target Overlay */}
                    <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[9px] font-mono text-emerald-400 font-bold">
                        <span className="bg-black/70 px-2 py-0.5 rounded border border-emerald-500/30">IMAGE {activeFileIndex + 1}/{selectedFiles.length}</span>
                        <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">{getLocalizedCrop(cropType)}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {analyses[activeFileIndex] ? `${t('resultTitle')}: ${analyses[activeFileIndex].diseaseName}` : t('loading')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white/80 hover:text-white border border-white/20 text-[10px] font-bold transition"
                      title="Add more photos"
                    >
                      + {t('uploadImage')}
                    </button>
                  </div>
                )}

                {/* Image Thumbnails Slider */}
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {previews.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setActiveFileIndex(idx); }}
                        className={`group relative h-14 rounded-xl border overflow-hidden cursor-pointer transition ${
                          activeFileIndex === idx
                            ? 'border-emerald-400 scale-[1.02] shadow-md shadow-emerald-400/25 ring-2 ring-emerald-400/50'
                            : 'border-white/15 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Crop snippet" className="h-full w-full object-cover" />
                        <div 
                          className="absolute top-1 right-1 h-4 w-4 bg-black/80 border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-500 text-white transition-colors"
                          onClick={(e) => handleRemoveFile(idx, e)}
                        >
                          <X className="h-2.5 w-2.5" />
                        </div>
                        {analyses[idx] && (
                          <div className="absolute bottom-1 left-1 bg-emerald-500 text-[8px] font-black text-slate-950 px-1 rounded">
                            ✓ {t('optimal')}
                          </div>
                        )}
                        {loading && loadingIndex === idx && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions: Start Scan Full-Width Button */}
                <button
                  type="button"
                  onClick={handleScanAll}
                  disabled={loading || selectedFiles.length === 0}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-emerald-950/60 border border-emerald-300/40 transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      {t('scanning')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-white" />
                      {t('scanBtn')} ({selectedFiles.length})
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-rose-500/30 bg-rose-950/80 p-3.5 text-xs text-rose-200 flex items-center gap-2 mt-4 no-print"
              >
                <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Status Footer */}
            <div className="flex items-center justify-between border-t border-white/15 pt-3.5 mt-5 text-[10px] text-slate-300 no-print">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${loading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                {status || t('online')}
              </span>
              {currentAnalysis && (
                <span className="text-emerald-300 font-bold">{t('aiSource')}: {currentAnalysis.source || 'Pathology Vision v2.0'}</span>
              )}
            </div>

            {/* ─── Diagnostic Results Section ─── */}
            <AnimatePresence mode="wait">
              {currentAnalysis ? (
                <motion.div
                  key={activeFileIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-white/15 pt-6 mt-6 grid gap-6 md:grid-cols-[280px_1fr]"
                >
                  {/* Left Column: Image Preview + Confidence Gauge */}
                  <div className="space-y-4">
                    
                    {/* Preview with HUD Reticle */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/80 group shadow-2xl">
                      <img
                        src={previews[activeFileIndex] || previews[0]}
                        alt="Scanned plant leaf"
                        className={`w-full aspect-square object-cover transition-transform duration-300 ${
                          zoomActive ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                        }`}
                        onClick={() => setZoomActive(!zoomActive)}
                      />

                      {/* Precision HUD Reticle Overlay */}
                      {showAnnotations && (
                        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
                          <div className="flex justify-between items-start text-[9px] font-mono text-emerald-400 font-bold drop-shadow">
                            <span>ROI: [0.34, 0.62]</span>
                            <span>SPECTRAL: NIR-RGB</span>
                          </div>

                          <div className="mx-auto w-36 h-36 border border-emerald-400/60 rounded-2xl relative flex items-center justify-center">
                            <Crosshair className="h-5 w-5 text-emerald-400/80 animate-pulse" />
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400" />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
                            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400" />
                          </div>

                          <div className="flex justify-between items-end text-[9px] font-mono text-emerald-400 font-bold drop-shadow">
                            <span>SECTOR: 4</span>
                            <span className="bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">CONF: {currentAnalysis.confidence}%</span>
                          </div>
                        </div>
                      )}

                      {/* Control Buttons */}
                      <div className="absolute bottom-2 right-2 flex gap-1.5 no-print">
                        <button
                          type="button"
                          onClick={() => setShowAnnotations(!showAnnotations)}
                          className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider transition cursor-pointer ${
                            showAnnotations
                              ? 'bg-emerald-500/80 border-emerald-400 text-slate-950'
                              : 'bg-black/80 border-white/20 text-white/70'
                          }`}
                        >
                          {showAnnotations ? 'HUD ON' : 'HUD OFF'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setZoomActive(!zoomActive)}
                          className="p-1 rounded-lg bg-black/80 border border-white/20 text-white hover:text-emerald-400 cursor-pointer"
                          title="Zoom"
                        >
                          <Maximize2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Circular Confidence Gauge */}
                    <div className="rounded-2xl border border-white/15 bg-black/35 p-4 flex flex-col items-center text-center shadow-inner">
                      <span className="text-[10px] uppercase font-black text-emerald-400 tracking-[0.2em] mb-3">
                        {t('resultConfidence')}
                      </span>
                      
                      <div className="relative h-24 w-24 flex items-center justify-center">
                        <svg className="h-full w-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            fill="transparent"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="7"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            fill="transparent"
                            stroke="#34d399"
                            strokeWidth="7"
                            strokeDasharray={2 * Math.PI * 38}
                            strokeDashoffset={(2 * Math.PI * 38) - (gaugePercent / 100) * (2 * Math.PI * 38)}
                            strokeLinecap="round"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.5))' }}
                          />
                        </svg>
                        
                        <div className="absolute text-center">
                          <span className="text-xl font-black text-white">{gaugePercent}%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-[10px] text-slate-300 font-medium">
                        {t('diagnosisAccuracy')}
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Pathology Report Details */}
                  <div className="space-y-4">
                    
                    {/* Header Row */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/15 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl sm:text-2xl font-black text-white">
                            {currentAnalysis.diseaseName}
                          </h2>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${severityConfig.class}`}>
                            {severityConfig.icon}
                            {severityConfig.label}
                          </span>
                        </div>
                        <p className="italic text-emerald-300 text-xs mt-0.5 font-semibold">
                          {currentAnalysis.scientificName || 'Pathogen classification confirmed'}
                        </p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-2 no-print shrink-0">
                        <button
                          type="button"
                          onClick={handleShare}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer shadow-sm"
                        >
                          <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                          {shareCopied ? t('shareLinkCopied') : t('shareReport')}
                        </button>
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-bold text-emerald-300 transition cursor-pointer shadow-sm"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {t('downloadReport')}
                        </button>
                      </div>
                    </div>

                    {/* Organic vs Chemical Treatment Tabs */}
                    <div className="rounded-2xl border border-white/15 bg-black/40 p-4 text-white shadow-sm">
                      <div className="flex border-b border-white/15 mb-3 no-print gap-2">
                        <button
                          type="button"
                          onClick={() => setTreatmentTab('organic')}
                          className={`pb-2 px-3 text-xs font-black uppercase tracking-wider transition border-b-2 cursor-pointer ${
                            treatmentTab === 'organic'
                              ? 'border-emerald-400 text-emerald-300'
                              : 'border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          🍃 {t('organicTab')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTreatmentTab('chemical')}
                          className={`pb-2 px-3 text-xs font-black uppercase tracking-wider transition border-b-2 cursor-pointer ${
                            treatmentTab === 'chemical'
                              ? 'border-emerald-400 text-emerald-300'
                              : 'border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          💊 {t('chemicalTab')}
                        </button>
                      </div>

                      <div className="text-xs leading-5 text-slate-200 min-h-[60px]">
                        {treatmentTab === 'organic' ? (
                          <div className="space-y-1.5">
                            <p className="font-black text-emerald-400">{t('treatmentGuide')}:</p>
                            <p className="text-slate-300 leading-relaxed">{currentAnalysis.organicTreatment || currentAnalysis.treatment?.split('💊 CHEMICAL:')[0]?.replace('🌿 ORGANIC:', '')?.trim() || 'Apply biological foliar agents and organic compost tea.'}</p>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <p className="font-black text-cyan-300">{t('chemicalTreatment')}:</p>
                            <p className="text-slate-300 leading-relaxed">{currentAnalysis.chemicalTreatment || currentAnalysis.treatment?.split('💊 CHEMICAL:')[1]?.trim() || 'Foliar application with standard fungicide active ingredient recommended.'}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Structured Cards */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Prevention Strategy Card */}
                      <div className="rounded-2xl border border-white/15 bg-black/35 p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                            {t('preventionGuide')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentAnalysis.prevention || 'Ensure proper furrow drainage and crop row spacing.'}
                        </p>
                      </div>

                      {/* Economic Impact Card */}
                      <div className="rounded-2xl border border-white/15 bg-black/35 p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <DollarSign className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                            {t('economicImpact')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentAnalysis.economicImpact || 'Estimated 15-35% harvest yield risk if untreated.'}
                        </p>
                      </div>

                      {/* Spread Risk Card */}
                      <div className="rounded-2xl border border-white/15 bg-black/35 p-3.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                            {t('spreadRisk')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentAnalysis.spreadRisk || 'Moderate to High under elevated canopy humidity.'}
                        </p>
                      </div>
                    </div>

                    {/* ── GIS Farm Infection Quarantine Radius Map ── */}
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-3.5 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-300">
                          <ShieldAlert className="h-4 w-4 text-rose-400" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-white">
                            {t('liveZonings')}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300 font-bold bg-black/60 px-2 py-0.5 rounded-lg border border-white/15">
                          {location.latitude}°N, {location.longitude}°E
                        </span>
                      </div>

                      <div className="relative h-36 w-full overflow-hidden rounded-xl border border-white/15 bg-black shadow-inner">
                        <iframe
                          title="GIS Infection Zone Map"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${(Number(location.longitude) || 80.0161) - 0.01}%2C${(Number(location.latitude) || 13.0264) - 0.01}%2C${(Number(location.longitude) || 80.0161) + 0.01}%2C${(Number(location.latitude) || 13.0264) + 0.01}&layer=mapnik&marker=${Number(location.latitude) || 13.0264}%2C${Number(location.longitude) || 80.0161}`}
                          className="opacity-85 contrast-125"
                        />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-white">
                            <span className="flex items-center gap-1.5 text-rose-300">
                              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                              250m Bio-Containment Perimeter Active
                            </span>
                            <span className="text-emerald-300">Sector Alpha • Precision Grid</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

          </div>

          {/* Right Column: Scan History & Pro-Tips */}
          <aside className="space-y-6 no-print">
            
            {/* Recent Farm History Card */}
            <div className="rounded-3xl border border-white/20 bg-black/40 p-5 shadow-2xl backdrop-blur-xl text-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2 mb-1.5">
                <Clock className="h-4 w-4 text-emerald-400" />
                {t('scanHistoryTitle')}
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                {t('scanHistorySubtitle')}
              </p>

              {historyLoading ? (
                <div className="space-y-2.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : historyReports.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-5 text-center text-xs text-slate-300">
                  {t('noReports')}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {historyReports.map((report) => (
                    <div
                      key={report._id}
                      onClick={() => handleSelectHistoryReport(report)}
                      className="p-2.5 rounded-2xl border border-white/15 bg-black/40 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition cursor-pointer flex items-center gap-2.5 shadow-sm"
                    >
                      <div className="h-11 w-11 rounded-xl bg-black/40 overflow-hidden shrink-0 border border-white/15">
                        <img
                          src={report.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80'}
                          alt={report.diseaseName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-white truncate">
                          {report.diseaseName}
                        </h4>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          {new Date(report.createdAt).toLocaleDateString()} • {Math.round(report.confidence)}%
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pathologist Pro-Tip Card */}
            <div className="rounded-3xl border border-white/20 bg-black/40 p-5 shadow-2xl backdrop-blur-xl text-white">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 mb-1.5 flex items-center gap-1.5">
                💡 {t('pathologyTips') || 'Agronomist Scanning Tip'}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                Ensure natural daylight and high-contrast focus on the affected leaf lesions for maximum diagnostic precision.
              </p>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
};

export default ScanDisease;
