const FarmLocation = require('../models/FarmLocation');

const createFarm = async (req, res) => {
  const { name, description, zoneType, cropType, coordinates, satelliteViewUrl } = req.body;
  const farm = await FarmLocation.create({
    owner: req.user._id,
    name,
    description,
    zoneType,
    cropType,
    coordinates,
    satelliteViewUrl,
  });
  res.status(201).json({ farm });
};

const getFarms = async (req, res) => {
  const query = req.user.role === 'Admin' ? {} : { owner: req.user._id };
  const farms = await FarmLocation.find(query).sort({ createdAt: -1 });
  res.json({ farms });
};

const getFarmById = async (req, res) => {
  const farm = await FarmLocation.findById(req.params.id).populate('owner', 'name email');
  if (!farm) return res.status(404).json({ message: 'Farm not found.' });
  res.json({ farm });
};

const updateFarm = async (req, res) => {
  const farm = await FarmLocation.findById(req.params.id);
  if (!farm) return res.status(404).json({ message: 'Farm not found.' });
  if (!farm.owner.equals(req.user._id) && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Not authorized to update this farm.' });
  }
  Object.assign(farm, req.body);
  await farm.save();
  res.json({ farm });
};

const removeFarm = async (req, res) => {
  const farm = await FarmLocation.findById(req.params.id);
  if (!farm) return res.status(404).json({ message: 'Farm not found.' });
  if (!farm.owner.equals(req.user._id) && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Not authorized to delete this farm.' });
  }
  await farm.remove();
  res.json({ message: 'Farm removed.' });
};

module.exports = { createFarm, getFarms, getFarmById, updateFarm, removeFarm };
