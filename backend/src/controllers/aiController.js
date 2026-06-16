const { Configuration, OpenAIApi } = require('openai');

const fallbackResponse = (message, location) => {
  const lower = message.toLowerCase();
  if (/fertilizer|shop|store|dealer/.test(lower)) {
    const loc = location ? `near (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : 'in your area';
    return `Here are recommended fertilizer suppliers ${loc}:\n- GreenGrow Fertilizers (Organic & NPK blends)\n- Harvest Supply Co. (Soil health solutions)\n- FieldCare Depot (Crop protection & nutrient packs)\n\nUse the live map to view exact shop locations and distances.`;
  }
  if (/disease|blight|pest|infection/.test(lower)) {
    return 'For crop disease prediction, focus on early leaf sampling and moisture control. Use the disease scanner to upload plant imagery, then follow the generated treatment and prevention recommendations for the detected pathogen.';
  }
  if (/weather|rain|irrigation/.test(lower)) {
    return 'Monitor soil moisture and humidity closely. Apply irrigation when soil moisture drops below optimal levels, and use weather-aware forecasts to avoid overwatering before rain.';
  }
  return 'I can help with fertilizer selection, disease diagnosis, shop locations, and farm recommendations. Try asking for a fertilizer plan for your crop or where to buy supplies near your location.';
};

const chat = async (req, res) => {
  const { message, location } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    const answer = fallbackResponse(message, location);
    return res.json({ answer });
  }

  try {
    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const client = new OpenAIApi(config);
    const prompt = `You are Agro AI, a crop disease and fertilizer advisor. Answer briefly with safe recommendations and mention the user's location if provided.`;
    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: `Question: ${message}${location ? `\nLocation: ${location.lat}, ${location.lng}` : ''}` },
    ];

    const response = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 400,
      temperature: 0.8,
    });

    const answer = response.data.choices?.[0]?.message?.content?.trim() || fallbackResponse(message, location);
    res.json({ answer });
  } catch (error) {
    console.error('AI chat error', error?.response?.data || error.message);
    const answer = fallbackResponse(message, location);
    res.json({ answer });
  }
};

module.exports = { chat };