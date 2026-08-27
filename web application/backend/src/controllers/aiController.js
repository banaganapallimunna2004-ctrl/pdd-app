const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const detectLanguage = (message) => {
  const text = String(message || '').toLowerCase();
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  if (/hola|fertilizante|enfermedad|clima|agua|riego|plaga|hongo|tomate/i.test(text)) return 'es';
  return 'en';
};

const getMultilingualResponse = (message, location) => {
  const lang = detectLanguage(message);
  const text = String(message || '').toLowerCase();

  // 1. Tomato Early / Late Blight
  if (/tomato|blight|early blight|late blight|टमाटर|టమోటా/i.test(text)) {
    if (lang === 'hi') {
      return `🍅 **टमाटर अगेती / पछेती झुलसा (Early / Late Blight) उपचार:**
1. **जैविक नियंत्रण:** नीम तेल (1500 ppm) 5ml प्रति लीटर पानी में मिलाकर हर 7-10 दिनों में छिड़कें।
2. **कवकनाशी:** कॉपर ऑक्सीक्लोराइड (2.5 ग्राम/लीटर) या मैन्कोजेब (2 ग्राम/लीटर) का छिड़काव करें।
3. **कृषि प्रबंधन:** नीचे की संक्रमित पत्तियों को तोड़कर खेत से दूर जला दें और ड्रिप सिंचाई का उपयोग करें।`;
    }
    if (lang === 'te') {
      return `🍅 **టమోటా ఆకుమచ్చ / ఎర్లీ బ్లైట్ నివారణ:**
1. **సేంద్రీయ పద్ధతి:** వేప నూనె (1500 ppm) 5ml లీటరు నీటిలో కలిపి 7-10 రోజులకు ఒకసారి పిచికారీ చేయండి।
2. **రసాయన చికిత్స:** కాపర్ ఆక్సీక్లోరైడ్ (2.5 గ్రా/లీ) లేదా మాంకోజెబ్ (2 గ్రా/లీ) పిచికారీ చేయండి।
3. **యాజమాన్యం:** వ్యాధి సోకిన ఆకులను వెంటనే తొలగించి నాశనం చేయండి।`;
    }
    return `🍅 **Tomato Early & Late Blight Management Guide:**
1. **Organic / Bio-Control:** Spray cold-pressed Neem Oil (1500 ppm) @ 4–5 mL/L with liquid soap or Trichoderma viride @ 5 g/L.
2. **Fungicide Application:** Apply Copper Oxychloride (2.5 g/L) or Mancozeb 75% WP (2 g/L) at first sign of concentric brown rings.
3. **Cultural Practice:** Prune bottom 12 inches of foliage to avoid soil-splash infection. Always water at the base, never over the leaves.`;
  }

  // 2. Wheat Irrigation / Schedule
  if (/wheat|irrigation|schedule|गेंहू|గోధుమ/i.test(text)) {
    if (lang === 'hi') {
      return `🌾 **गेहूं की फसल के लिए सिंचाई कार्यक्रम:**
1. **CRI अवस्था (20-25 दिन):** पहली और सबसे महत्वपूर्ण सिंचाई।
2. **कल्ले फूटते समय (40-45 दिन):** दूसरी सिंचाई।
3. **गांठ बनते समय (60-65 दिन):** तीसरी सिंचाई।
4. **फूल आते समय (80-85 दिन):** चौथी सिंचाई।
5. **दूधिया अवस्था (100-105 दिन):** पांचवी हल्की सिंचाई (तेज हवा में न करें)।`;
    }
    return `🌾 **Optimal Wheat Irrigation Schedule (Critical Growth Stages):**
1. **CRI Stage (20–25 Days after sowing):** Most vital crown root initiation irrigation.
2. **Tillering Stage (40–45 Days):** Promotes strong shoot multiplication.
3. **Jointing Stage (60–65 Days):** Supports stem elongation and node strength.
4. **Flowering / Anthesis (80–85 Days):** Critical for spikelet fertility.
5. **Milk / Grain Filling (100–105 Days):** Light irrigation. Avoid watering during heavy winds to prevent lodging.`;
  }

  // 3. Corn / Maize NPK Ratio
  if (/corn|maize|npk|मक्का|మొక్కజొన్న/i.test(text)) {
    if (lang === 'hi') {
      return `🌽 **मक्का के लिए NPK एवं पोषक तत्व अनुपात:**
- **सिफारिश:** N:P:K = 120:60:40 किग्रा प्रति हेक्टेयर।
- **बुवाई के समय (बेसल):** पूरा फॉस्फोरस (DAP), पूरा पोटाश (MOP) और 1/3 नाइट्रोजन (यूरिया)।
- **घुटने की ऊंचाई (30 दिन):** 1/3 नाइट्रोजन का टॉप ड्रेसिंग।
- **नर मंजरी निकलते समय (50 दिन):** शेष 1/3 नाइट्रोजन दें।
- **जिंक:** 25 किग्रा जिंक सल्फेट प्रति हेक्टेयर मिट्टी में मिलाएँ।`;
    }
    return `🌽 **Corn / Maize NPK Fertilizer Recommendation:**
- **Standard Ratio:** N:P:K = 120:60:40 kg/ha (Hybrids: 150:75:50 kg/ha).
- **Basal Dose (at planting):** 100% Phosphorus (DAP/SSP), 100% Potash (MOP), and 1/3rd Nitrogen (Urea).
- **Knee-High Stage (V6 stage ~30 days):** Top-dress 1/3rd Nitrogen.
- **Tasseling Stage (VT stage ~50 days):** Top-dress remaining 1/3rd Nitrogen for maximum cob weight.
- **Micronutrient:** Apply 25 kg/ha Zinc Sulfate (ZnSO₄) to prevent white bud disorder.`;
  }

  // 4. Monsoon / Rain / Weather Risk
  if (/monsoon|rain|weather|potato|risk|मौसम|వర్షం/i.test(text)) {
    return `🌧️ **Monsoon Weather Precautions & Potato / Vegetable Care:**
1. **Drainage:** Clear field furrows immediately to prevent root waterlogging and bacterial soft rot.
2. **Preventive Spray:** High humidity (>80%) triggers late blight; spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L before downpours.
3. **Ridge Elevation:** Keep potato tubers deeply earthed up on high ridges to avoid greening and fungal infection.`;
  }

  // 5. Pest Control / Neem Oil / Aphids / Worms
  if (/pest|insect|aphid|worm|neem|कीट|పురుగు/i.test(text)) {
    return `🛡️ **Integrated Pest Management (IPM) & Organic Controls:**
1. **Sucking Pests (Aphids, Thrips, Whiteflies):** Spray 10,000 ppm Neem Oil @ 3 mL/L + 1 mL soap, or install yellow sticky traps (15 traps/acre).
2. **Caterpillars / Borers:** Apply Bacillus thuringiensis (Bt) @ 2 g/L or Pheromone lure traps (5 traps/acre).
3. **Beneficial Predators:** Preserve ladybird beetles and hoverfly larvae for natural biological balance.`;
  }

  // 6. Soil pH & Fertilizer General
  if (/fertilizer|urea|dap|soil|ph|manure|compost|खाद|ఎరువులు/i.test(text)) {
    return `🌱 **Soil Health & Precision Fertilizer Management:**
1. **Soil Testing:** Maintain ideal pH between 6.2 and 7.2 for maximum nutrient availability.
2. **Acidic Soil (pH < 6.0):** Apply agricultural lime (calcium carbonate) 250–500 kg/ha before sowing.
3. **Alkaline Soil (pH > 7.8):** Apply agricultural gypsum or elemental sulfur to reduce salinity.
4. **Organic Matter:** Incorporate 5–10 tonnes/ha well-rotted farmyard manure (FYM) or vermicompost annually.`;
  }

  // Default response
  if (lang === 'hi') {
    return `🌾 **नमस्ते! मैं आपका एग्रो AI सलाहकार हूँ।**\nमैं फसल रोग निदान, सटीक उर्वरक (NPK), सिंचाई योजना, मौसम जोखिम एवं जैविक खेती से जुड़े हर सवाल में आपकी मदद कर सकता हूँ। कृपया अपनी फसल का नाम या समस्या लिखकर पूछें।`;
  }
  if (lang === 'te') {
    return `🌾 **నమస్కారం! నేను మీ అగ్రో AI అసిస్టెంట్ ని.**\nపంటల తెగుళ్లు, ఎరువుల మోతాదు (NPK), నీటిపారుదల షెడ్యూల్ మరియు సేంద్రీయ వ్యవసాయ పద్ధతులపై మీకు ఖచ్చితమైన సలహాలు ఇవ్వగలను। మీ సందేహాన్ని అడగండి।`;
  }
  if (lang === 'es') {
    return `🌾 **¡Hola! Soy su Agrónomo de Inteligencia Artificial AgroAI.**\nPuedo orientarle en diagnóstico de patógenos vegetales, cálculo de dosis de fertilizantes N-P-K, planes de riego e insumos biológicos. ¿En qué cultivo desea asesoría hoy?`;
  }

  return `🌾 **Hello! I am your Agro AI Agronomist.**\nI can provide field-verified guidance on:\n- 🌿 **Crop Disease Diagnosis & Treatment** (Fungal, Bacterial, Viral)\n- 🧪 **Precision Fertilizer Schedules** (NPK, Micronutrients, Organic Compost)\n- 💧 **Optimal Irrigation Timings** (Growth stages, Evapotranspiration)\n- 🌦️ **Weather-Aware Farm Management** (Monsoon risk, Heat stress, Frost)\n\nAsk any question above or type your specific crop problem to receive instant guidance!`;
};

const chat = async (req, res) => {
  const { message, location } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  // 1. Try Gemini
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const lang = detectLanguage(message);
      let prompt = 'You are Agro AI, an expert precision crop agronomist. Answer briefly and recommend safe treatments. ';
      if (lang === 'hi') prompt += 'Write the entire response in Hindi (हिंदी). ';
      else if (lang === 'te') prompt += 'Write the entire response in Telugu (తెలుగు). ';
      else if (lang === 'es') prompt += 'Write the entire response in Spanish (Español). ';
      else prompt += 'Write the response in English. ';

      prompt += `\n\nUser Question: ${message}${location ? `\nLocation Coordinate: ${location.lat}, ${location.lng}` : ''}`;

      const result = await model.generateContent(prompt);
      const answer = result.response.text();
      return res.json({ answer });
    } catch (error) {
      console.error('Gemini AI error', error.message);
    }
  }

  // 2. Try OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const lang = detectLanguage(message);
      
      let prompt = 'You are Agro AI, an expert precision crop agronomist. Answer briefly and recommend safe treatments. ';
      if (lang === 'hi') prompt += 'Write the entire response in Hindi (हिंदी).';
      else if (lang === 'te') prompt += 'Write the entire response in Telugu (తెలుగు).';
      else if (lang === 'es') prompt += 'Write the entire response in Spanish (Español).';
      else prompt += 'Write the response in English.';

      const messages = [
        { role: 'system', content: prompt },
        { role: 'user', content: `Question: ${message}${location ? `\nLocation Coordinate: ${location.lat}, ${location.lng}` : ''}` },
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 400,
        temperature: 0.75,
      });

      const answer = response.choices?.[0]?.message?.content?.trim() || getMultilingualResponse(message, location);
      return res.json({ answer });
    } catch (error) {
      console.error('OpenAI chat error', error?.response?.data || error.message);
    }
  }

  // 3. Fallback to offline rule-based model
  const answer = getMultilingualResponse(message, location);
  return res.json({ answer });
};

module.exports = { chat };