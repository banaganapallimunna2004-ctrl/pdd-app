import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
from model import analyze_image, SUPPORTED_CROPS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'Agro AI Vision Service'})

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'Image file is required.'}), 400

    image_file = request.files['image']
    crop_type = request.form.get('cropType', 'Tomato')
    image = Image.open(image_file.stream).convert('RGB')
    array = np.array(image)
    resized = cv2.resize(array, (224, 224))

    result = analyze_image(resized, crop_type)
    response = {
        'analysis': result,
        'supportedCrops': SUPPORTED_CROPS,
    }
    return jsonify(response)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6000))
    app.run(host='0.0.0.0', port=port)
