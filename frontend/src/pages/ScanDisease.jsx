import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import reportService from '../services/reportService';
import farmService from '../services/farmService';

const cropOptions = ['Tomato', 'Potato', 'Corn', 'Rice', 'Cotton', 'Wheat'];
const symptomSuggestions = [
  'Yellowing leaves with dark spots.',
  'White powdery coating on leaf surface.',
  'Orange pustules on corn leaves.',
  'Dark lesions and leaf blight.',
];

const ScanDisease = () => {
  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState('');
  const [cropType, setCropType] = useState('Tomato');
  const [symptoms, setSymptoms] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Upload a plant image, add symptoms, and scan for a disease match.');
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const response = await farmService.getFarms();
        const farmList = response.data.farms || [];
        setFarms(farmList);
        if (farmList.length) {
          setFarmId(farmList[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadFarms();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setLocation({ latitude: '', longitude: '' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleSuggestedSymptom = (text) => {
    setSymptoms(text);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleScan = async (event) => {
    event.preventDefault();
    setError(null);
    setAnalysis(null);

    if (!imageFile) {
      setError('Please upload a leaf or plant image to scan.');
      return;
    }

    setLoading(true);
    setStatus('Scanning image and matching disease profile...');

    try {
      const payload = {
        farmId,
        cropType,
        symptoms: symptoms.trim() || 'Analyze visible crop disease symptoms from the uploaded image.',
        latitude: location.latitude,
        longitude: location.longitude,
        image: imageFile,
      };
      const response = await reportService.scanDisease(payload);
      setAnalysis(response.data.analysis || response.data.report);
      setStatus(response.data.message || 'Scan completed. Review the predicted disease and recommended treatment below.');
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to complete the scan. Please try again.';
      setError(message);
      setStatus('Scan failed.');
    } finally {
      setLoading(false);
    }
  };

  const recommendationCards = useMemo(() => {
    if (!analysis) return [];
    return [
      { title: 'Disease', value: analysis.diseaseName },
      { title: 'Confidence', value: `${analysis.confidence}%` },
      { title: 'Severity', value: analysis.severity },
    ];
  }, [analysis]);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <div className="mb-10 rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-10 shadow-glass">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/90">Disease scanner</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Upload plant imagery and get an accurate crop disease diagnosis.</h1>
            <p className="mt-4 max-w-2xl text-slate-400">Scan leaf photos, detect disease names, confidence, severity, and receive treatment plus prevention guidance.</p>
          </div>
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">Back to home</Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_0.75fr]">
          <form onSubmit={handleScan} className="space-y-6 rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-8 shadow-glass">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Select farm</span>
                <select
                  value={farmId}
                  onChange={(event) => setFarmId(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                >
                  {farms.length ? (
                    farms.map((farm) => (
                      <option key={farm._id} value={farm._id}>{farm.name}</option>
                    ))
                  ) : (
                    <option value="">No farms available</option>
                  )}
                </select>
                <p className="mt-2 text-xs text-slate-500">{farms.length ? 'Optional, used to save the report to your dashboard.' : 'Optional. Add a farm later to save scan history.'}</p>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Crop type</span>
                <select
                  value={cropType}
                  onChange={(event) => setCropType(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                >
                  {cropOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Symptom description</span>
                <textarea
                  value={symptoms}
                  onChange={(event) => setSymptoms(event.target.value)}
                  rows={5}
                  placeholder="Optional: describe leaf spots, discoloration, powdery coatings, or other symptoms seen on the plant."
                  className="mt-2 w-full rounded-[1.75rem] border border-white/10 bg-slate-950/80 px-4 py-4 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {symptomSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestedSymptom(suggestion)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:bg-white/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
                />
              </label>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm font-semibold text-slate-300">Live location</p>
                <p className="mt-2 text-sm text-slate-400">{location.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Location not available'}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Your uploaded image is analyzed for disease, confidence, severity, treatment, and prevention guidance.</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Scanning...' : 'Scan disease'}
              </button>
            </div>

            {error && <p className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p>}
            <p className="text-sm text-slate-400">{status}</p>
          </form>

          <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-8 shadow-glass">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
              <h2 className="text-xl font-semibold text-white">Scan result</h2>
              {!analysis && <p className="mt-3 text-slate-400">Results appear here after scanning your plant image.</p>}
              {analysis && (
                <div className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {recommendationCards.map((card) => (
                      <div key={card.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{card.title}</p>
                        <p className="mt-3 text-xl font-semibold text-white">{card.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                    <h3 className="text-lg font-semibold text-white">Treatment</h3>
                    <p className="text-sm leading-6 text-slate-300">{analysis.treatment}</p>
                  </div>
                  <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                    <h3 className="text-lg font-semibold text-white">Prevention</h3>
                    <p className="text-sm leading-6 text-slate-300">{analysis.prevention}</p>
                  </div>
                  {previewUrl && (
                    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                      <h3 className="text-lg font-semibold text-white">Uploaded image</h3>
                      <img src={previewUrl} alt="Uploaded plant" className="mt-4 h-60 w-full rounded-3xl object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ScanDisease;
