import os
import base64
import io
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
    return jsonify({'status': 'ok', 'service': 'Agro AI Vision Service', 'version': '2.0.0'})

@app.route('/detect', methods=['POST'])
def detect():
    image = None
    crop_type = 'Tomato'

    if 'image' in request.files:
        image_file = request.files['image']
        crop_type = request.form.get('cropType', request.form.get('crop', 'Tomato'))
        image = Image.open(image_file.stream).convert('RGB')
    elif request.is_json and request.json and 'image' in request.json:
        raw_b64 = request.json['image']
        if ',' in raw_b64:
            raw_b64 = raw_b64.split(',', 1)[1]
        image_bytes = base64.b64decode(raw_b64)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        crop_type = request.json.get('cropType', request.json.get('crop', 'Tomato'))
    elif request.form and 'image' in request.form:
        raw_b64 = request.form['image']
        if ',' in raw_b64:
            raw_b64 = raw_b64.split(',', 1)[1]
        image_bytes = base64.b64decode(raw_b64)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        crop_type = request.form.get('cropType', request.form.get('crop', 'Tomato'))

    if image is None:
        return jsonify({'error': 'Image file or base64 string is required.'}), 400

    array = np.array(image)
    resized = cv2.resize(array, (224, 224))

    result = analyze_image(resized, crop_type)
    response = {
        'success': True,
        'analysis': result,
        'supportedCrops': SUPPORTED_CROPS,
    }
    return jsonify(response)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port)
