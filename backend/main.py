

import numpy as np
import math
import torch
import torchaudio
from flask_cors import CORS
from flask import Flask, request, jsonify
from transformers import ASTFeatureExtractor, ASTModel
import keras

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

MODEL = keras.models.load_model("../training/disease_predictor.h5")
class_names = ["Healthy", "Asthma", "Tuberculosis"]

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
feature_extractor = ASTFeatureExtractor.from_pretrained("MIT/ast-finetuned-audioset-10-10-0.4593")
ast_model = ASTModel.from_pretrained("MIT/ast-finetuned-audioset-10-10-0.4593")
ast_model.to(DEVICE)
ast_model.eval()

def get_bool(key):
    return request.form.get(key, '').lower() == 'true'

def get_ast_embedding_from_file(file):
    waveform, sr = torchaudio.load(file)
    waveform = waveform.mean(dim=0)
    if sr != 16000:
        waveform = torchaudio.functional.resample(waveform, sr, 16000)
    target_len = 16000 * 5
    if waveform.shape[0] > target_len:
        waveform = waveform[:target_len]
    elif waveform.shape[0] < target_len:
        waveform = torch.nn.functional.pad(waveform, (0, target_len - waveform.shape[0]))
    inputs = feature_extractor([waveform.cpu().numpy()], sampling_rate=16000, return_tensors="pt").input_values.to(DEVICE)
    with torch.no_grad():
        outputs = ast_model(inputs)
        pooled_embedding = outputs.pooler_output
    return pooled_embedding.cpu().numpy()

def get_severity_label(conf):
    if conf < 0.4:
        return "Low"
    elif conf < 0.7:
        return "Medium"
    else:
        return "High"

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"message": "Flask API is running"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    try:
        features = {
            'age': int(request.form.get('age')),
            'gender': 1 if request.form.get('gender') == 'Male' else 0,
            'tbContactHistory': int(get_bool('tbContactHistory')),
            'wheezingHistory': int(get_bool('wheezingHistory')),
            'phlegmCough': int(get_bool('phlegmCough')),
            'familyAsthmaHistory': int(get_bool('familyAsthmaHistory')),
            'feverHistory': int(get_bool('feverHistory')),
            'coldPresent': int(get_bool('coldPresent')),
            'packYears': int(request.form.get('packYears')),
        }
        clinical_features = np.array([list(features.values())], dtype=np.float32)

        if 'coughFile' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        cough_file = request.files['coughFile']
        ast_embedding = get_ast_embedding_from_file(cough_file)

        prediction = MODEL.predict([ast_embedding, clinical_features])[0]
        predicted_idx = int(np.argmax(prediction))
        predicted_class = class_names[predicted_idx]
        confidence = float(prediction[predicted_idx])

        asthmaProb = 0.0
        tbProb = 0.0
        severity = ""

        if predicted_class == "Healthy":
            asthmaProb = 0.0
            tbProb = 0.0
            severity = "Healthy"
        elif predicted_class == "Asthma":
            asthmaProb = math.floor(confidence * 100)
            tbProb = 100 - asthmaProb
            severity = f"Asthma ({get_severity_label(confidence)})"
        elif predicted_class == "Tuberculosis":
            tbProb = math.floor(confidence * 100)
            asthmaProb = 100 - tbProb
            severity = f"Tuberculosis ({get_severity_label(confidence)})"

        print("predicted class:",predicted_class)
        print("predicted index",predicted_idx)
        print("Asthma probability",asthmaProb)
        print("TB probability",tbProb)
        print("Severity:",severity)

        return jsonify({
            'asthmaProb': asthmaProb,
            'tbProb': tbProb,
            'severity': severity
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=7000)
