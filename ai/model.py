import numpy as np

SUPPORTED_CROPS = ['Tomato', 'Potato', 'Corn', 'Rice', 'Cotton', 'Wheat']
DISEASES = [
    {'name': 'Early Blight', 'treatment': 'Apply fungicide spray weekly.', 'prevention': 'Rotate crops and avoid overhead irrigation.'},
    {'name': 'Powdery Mildew', 'treatment': 'Use sulfur-based fungicides.', 'prevention': 'Improve air circulation and reduce humidity.'},
    {'name': 'Leaf Spot', 'treatment': 'Remove infected foliage and apply protective barrier treatment.', 'prevention': 'Use disease resistant seed varieties.'},
    {'name': 'Healthy', 'treatment': 'Maintain normal monitoring and balanced nutrition.', 'prevention': 'Continue crop hygiene and soil health programs.'},
]

class DummyDiseaseModel:
    def predict(self, image_array):
        score = np.mean(image_array) / 255.0
        index = int(score * (len(DISEASES) - 1))
        return DISEASES[index]

MODEL = DummyDiseaseModel()

def analyze_image(image_array, crop_type):
    disease = MODEL.predict(image_array)
    confidence = float(np.clip(np.mean(image_array) / 255.0 * 100, 0, 100))
    if disease['name'] == 'Healthy':
        severity = 'Low'
    elif confidence > 70:
        severity = 'High'
    else:
        severity = 'Medium'

    return {
        'cropType': crop_type if crop_type in SUPPORTED_CROPS else 'Unknown',
        'diseaseName': disease['name'],
        'confidence': round(confidence, 1),
        'severity': severity,
        'treatment': disease['treatment'],
        'prevention': disease['prevention'],
    }
