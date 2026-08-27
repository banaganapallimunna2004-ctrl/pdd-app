const cloudinary = require('../config/cloudinary');
const DiseaseReport = require('../models/DiseaseReport');
const FarmLocation = require('../models/FarmLocation');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const createReport = async (req, res) => {
  const { farmId, cropType, diseaseName, scientificName, confidence, severity, treatment, prevention, symptoms, treatmentSuggestions, preventionTips, latitude, longitude, userEmail } = req.body;

  let farm = null;
  if (farmId) {
    try {
      farm = await FarmLocation.findById(farmId);
    } catch (e) {}
  }

  let imageUrl = '';
  if (req.file && req.file.buffer) {
    try {
      const upload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'agro_ai/reports', resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = upload.secure_url;
    } catch (e) {}
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }

  const report = await DiseaseReport.create({
    farm: farm ? farm._id : undefined,
    user: req.user?._id,
    userEmail: userEmail || req.user?.email,
    cropType: cropType || 'Crop',
    diseaseName,
    scientificName: scientificName || 'N/A',
    confidence: confidence || 90,
    severity: severity || 'Medium',
    treatment: treatment || 'Apply recommended bio-fungicide.',
    prevention: prevention || 'Maintain crop hygiene.',
    symptoms: symptoms || [],
    treatmentSuggestions: treatmentSuggestions || [],
    preventionTips: preventionTips || [],
    imageUrl,
    hotspot: {
      type: 'Point',
      coordinates: [Number(longitude) || 76.9558, Number(latitude) || 11.0168],
    },
  });

  res.status(201).json({ success: true, report });
};

const getReports = async (req, res) => {
  const query = req.user?.role === 'Admin' ? {} : (req.user?._id ? { $or: [{ user: req.user._id }, { user: { $exists: false } }, { userEmail: req.user.email }] } : {});
  const reports = await DiseaseReport.find(query).sort({ createdAt: -1 }).populate('farm user', 'name email');
  res.json({ reports });
};

const getLatestReports = async (req, res) => {
  const reports = await DiseaseReport.find().sort({ createdAt: -1 }).limit(16).populate('farm user', 'name');
  res.json({ reports });
};

const exportPdf = async (req, res) => {
  const reports = await DiseaseReport.find({}).populate('farm user', 'name email');
  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="agroai-disease-report.pdf"');

  doc.fontSize(22).fillColor('#38bdf8').text('Agro AI Disease Intelligence Report', { align: 'center' });
  doc.moveDown();

  reports.forEach((report, index) => {
    doc.fontSize(14).fillColor('#ffffff').text(`${index + 1}. ${report.cropType} - ${report.diseaseName}`, { continued: true });
    doc.fontSize(12).fillColor('#94a3b8').text(` (${report.severity})`);
    doc.text(`Confidence: ${report.confidence}%`);
    doc.text(`Treatment: ${report.treatment}`);
    doc.text(`Prevention: ${report.prevention}`);
    doc.text(`Farm: ${report.farm?.name || 'Unknown'}`);
    doc.moveDown();
  });

  doc.pipe(res);
  doc.end();
};

const exportExcel = async (req, res) => {
  const reports = await DiseaseReport.find({}).populate('farm user', 'name email');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Disease Reports');

  sheet.columns = [
    { header: 'Crop', key: 'cropType', width: 16 },
    { header: 'Disease', key: 'diseaseName', width: 22 },
    { header: 'Confidence (%)', key: 'confidence', width: 16 },
    { header: 'Severity', key: 'severity', width: 12 },
    { header: 'Treatment', key: 'treatment', width: 40 },
    { header: 'Prevention', key: 'prevention', width: 40 },
    { header: 'Farm', key: 'farm', width: 18 },
    { header: 'Reported By', key: 'user', width: 20 },
  ];

  reports.forEach((report) => {
    sheet.addRow({
      cropType: report.cropType,
      diseaseName: report.diseaseName,
      confidence: report.confidence,
      severity: report.severity,
      treatment: report.treatment,
      prevention: report.prevention,
      farm: report.farm?.name,
      user: report.user?.name,
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="agroai-disease-report.xlsx"');
  await workbook.xlsx.write(res);
  res.end();
};

const updateReport = async (req, res) => {
  const report = await DiseaseReport.findById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found.' });
  if (!report.user.equals(req.user._id) && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Not authorized to edit this report.' });
  }

  Object.assign(report, req.body);
  await report.save();
  res.json({ report });
};

const deleteReport = async (req, res) => {
  const report = await DiseaseReport.findById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found.' });

  if (!report.user.equals(req.user._id) && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Not authorized to delete this report.' });
  }

  await report.remove();
  res.json({ message: 'Report deleted.' });
};

module.exports = { createReport, getReports, getLatestReports, exportPdf, exportExcel, updateReport, deleteReport };
