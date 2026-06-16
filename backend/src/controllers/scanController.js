const { Configuration, OpenAIApi } = require('openai');
const cloudinary = require('../config/cloudinary');
const DiseaseReport = require('../models/DiseaseReport');
const FarmLocation = require('../models/FarmLocation');

const diseaseCatalog = {
  Tomato: [
    {
      diseaseName: 'Early Blight',
      keywords: ['brown spot', 'dark lesion', 'concentric ring', 'spot', 'yellowing'],
      severity: 'Medium',
      treatment: 'Apply a copper-based fungicide, remove infected leaves, and rotate crops next season.',
      prevention: 'Improve airflow between plants, avoid overhead watering, and keep foliage dry.',
    },
    {
      diseaseName: 'Late Blight',
      keywords: ['water soaked', 'gray mold', 'blight', 'rotting', 'dark patches'],
      severity: 'High',
      treatment: 'Use fungicides containing chlorothalonil or mancozeb and remove affected tissue immediately.',
      prevention: 'Maintain good field drainage, trim dense foliage, and avoid wet foliage at night.',
    },
    {
      diseaseName: 'Powdery Mildew',
      keywords: ['white powder', 'powdery', 'white coating', 'leaf surface'],
      severity: 'Low',
      treatment: 'Spray with sulfur or potassium bicarbonate solution and remove badly affected leaves.',
      prevention: 'Keep plants spaced for airflow and avoid humid conditions on leaf surfaces.',
    },
  ],
  Potato: [
    {
      diseaseName: 'Late Blight',
      keywords: ['dark spot', 'blight', 'rot', 'lesion'],
      severity: 'High',
      treatment: 'Treat with a copper fungicide and remove infected stems and tubers.',
      prevention: 'Water at the base, space plants apart, and rotate potatoes every season.',
    },
    {
      diseaseName: 'Common Scab',
      keywords: ['scab', 'bumps', 'raised lesions', 'corky patches'],
      severity: 'Medium',
      treatment: 'Use clean seed potatoes and apply soil amendments to lower pH slightly.',
      prevention: 'Avoid planting in dry conditions and maintain even soil moisture.',
    },
  ],
  Corn: [
    {
      diseaseName: 'Northern Corn Leaf Spot',
      keywords: ['elongated spots', 'brown lesion', 'leaf spot'],
      severity: 'Medium',
      treatment: 'Apply a fungicide and remove crop residue after harvest.',
      prevention: 'Rotate crops and provide adequate spacing for ventilation.',
    },
    {
      diseaseName: 'Common Rust',
      keywords: ['orange pustules', 'rust', 'orange spots', 'pustules'],
      severity: 'Medium',
      treatment: 'Use resistant hybrids and apply foliar fungicides if required.',
      prevention: 'Monitor humidity and avoid planting near infected fields.',
    },
  ],
  Rice: [
    {
      diseaseName: 'Leaf Blast',
      keywords: ['diamond-shaped', 'lesion', 'blast', 'yellow edge'],
      severity: 'High',
      treatment: 'Use a recommended triazole fungicide and remove infected leaves.',
      prevention: 'Avoid excess nitrogen fertilizer and keep paddies well drained.',
    },
    {
      diseaseName: 'Brown Spot',
      keywords: ['brown spot', 'brown lesion', 'leaf spot', 'circular spot'],
      severity: 'Medium',
      treatment: 'Apply a copper fungicide and maintain balanced nutrition.',
      prevention: 'Avoid high humidity and keep seedlings healthy before transplanting.',
    },
  ],
  Cotton: [
    {
      diseaseName: 'Bacterial Blight',
      keywords: ['water soaked', 'black spots', 'blight', 'angular lesion'],
      severity: 'High',
      treatment: 'Use bactericides and remove infected foliage; practice strict sanitation.',
      prevention: 'Avoid overhead irrigation and use certified seed.',
    },
    {
      diseaseName: 'Leaf Rust',
      keywords: ['orange pustules', 'rust', 'small spots'],
      severity: 'Medium',
      treatment: 'Apply fungicide and choose rust-resistant varieties.',
      prevention: 'Rotate crops and avoid high humidity around foliage.',
    },
  ],
  Wheat: [
    {
      diseaseName: 'Powdery Mildew',
      keywords: ['white powder', 'powdery', 'white coating'],
      severity: 'Medium',
      treatment: 'Spray with sulfur or a systemic fungicide and remove infected growth.',
      prevention: 'Avoid excessive nitrogen and maintain good airflow.',
    },
    {
      diseaseName: 'Leaf Rust',
      keywords: ['reddish pustules', 'rust', 'orange spots'],
      severity: 'Medium',
      treatment: 'Apply a leaf rust fungicide when pustules appear on leaves.',
      prevention: 'Plant resistant varieties and minimize leaf wetness.',
    },
  ],
};

const aiAnalyze = async (cropType, symptoms) => {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const client = new OpenAIApi(configuration);
    const prompt = `You are an expert crop disease diagnostician. The crop type is ${cropType}. Symptoms reported: ${symptoms}. Provide a JSON object with keys: diseaseName, confidence, severity, treatment, prevention. confidence should be a number from 50 to 100. severity should be one of Low, Medium, High, Critical. Only respond with valid JSON.`;

    const response = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 250,
    });

    const content = response.data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;
    const parsed = JSON.parse(content);
    return {
      diseaseName: parsed.diseaseName,
      confidence: Number(parsed.confidence) || 75,
      severity: parsed.severity || 'Medium',
      treatment: parsed.treatment || '',
      prevention: parsed.prevention || '',
    };
  } catch (error) {
    console.warn('AI analysis fallback', error?.message || error);
    return null;
  }
};

const visionAnalyze = async (file, cropType) => {
  if (!file?.buffer || !process.env.AI_SERVICE_URL || typeof fetch !== 'function') return null;

  try {
    const formData = new FormData();
    formData.append('cropType', cropType);
    formData.append('image', new Blob([file.buffer], { type: file.mimetype }), file.originalname || 'crop-image.jpg');

    const response = await fetch(`${process.env.AI_SERVICE_URL.replace(/\/$/, '')}/detect`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const details = await response.text();
      console.warn('Vision service fallback', details);
      return null;
    }

    const data = await response.json();
    return data.analysis || null;
  } catch (error) {
    console.warn('Vision service fallback', error?.message || error);
    return null;
  }
};

const heuristicAnalysis = (cropType, symptoms) => {
  const symptomText = (symptoms || '').toLowerCase();
  const options = diseaseCatalog[cropType] || [];
  let bestMatch = options[0] || {
    diseaseName: 'Unknown disease',
    severity: 'Medium',
    treatment: 'Consult a local agronomist and upload higher-quality images.',
    prevention: 'Keep the crop healthy with balanced irrigation and nutrition.',
  };
  let matchScore = 0;

  options.forEach((option) => {
    const hits = option.keywords.filter((keyword) => symptomText.includes(keyword)).length;
    if (hits > matchScore) {
      matchScore = hits;
      bestMatch = option;
    }
  });

  const confidence = Math.min(95, 55 + matchScore * 12);

  return {
    diseaseName: bestMatch.diseaseName,
    confidence: confidence || 60,
    severity: bestMatch.severity,
    treatment: bestMatch.treatment,
    prevention: bestMatch.prevention,
  };
};

const scanDisease = async (req, res) => {
  const { farmId, cropType, symptoms, latitude, longitude } = req.body;

  if (!cropType) return res.status(400).json({ message: 'Crop type is required.' });
  if (!req.file?.buffer) return res.status(400).json({ message: 'Crop disease image is required.' });

  let farm = null;
  if (farmId) {
    farm = await FarmLocation.findById(farmId);
    if (!farm) return res.status(404).json({ message: 'Farm location not found.' });
  }

  let imageUrl = '';
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    const upload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'agro_ai/scans', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    imageUrl = upload.secure_url;
  }

  const analysis =
    (await visionAnalyze(req.file, cropType)) ||
    (await aiAnalyze(cropType, symptoms)) ||
    heuristicAnalysis(cropType, symptoms);

  if (!farm) {
    return res.status(201).json({
      report: null,
      analysis,
      message: 'Scan completed. Add a farm to save this disease report to your dashboard.',
    });
  }

  const report = await DiseaseReport.create({
    farm: farm._id,
    user: req.user._id,
    cropType,
    diseaseName: analysis.diseaseName,
    confidence: analysis.confidence,
    severity: analysis.severity,
    treatment: analysis.treatment,
    prevention: analysis.prevention,
    imageUrl,
    hotspot: {
      type: 'Point',
      coordinates: [Number(longitude) || 0, Number(latitude) || 0],
    },
  });

  res.status(201).json({ report, analysis });
};

module.exports = { scanDisease };
