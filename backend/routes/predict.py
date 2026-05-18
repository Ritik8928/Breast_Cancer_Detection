from flask import Blueprint, request, jsonify
import random
import numpy as np
import pandas as pd
import os
import sys

# Create blueprint
predict_bp = Blueprint('predict', __name__)

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to load ML service
try:
    from services.ml_services import MLService, MockMLService
    
    MODEL_PATH = os.path.join('artifacts', 'model.pkl')
    PREPROCESSOR_PATH = os.path.join('artifacts', 'preprocessor.pkl')
    
    if os.path.exists(MODEL_PATH):
        ml_service = MLService(MODEL_PATH, PREPROCESSOR_PATH)
        print("✅ Using real ML model")
        use_real_service = True
    else:
        ml_service = MockMLService()
        print("⚠️ Using mock ML model")
        use_real_service = True
        
except Exception as e:
    print(f"⚠️ Could not load ML service: {e}")
    print("⚠️ Using simple mock predictions")
    use_real_service = False

# Simple prediction function (fallback)
def simple_predict(data):
    prediction = random.choice([0, 1])
    confidence = random.uniform(0.7, 0.95)
    return prediction, confidence

@predict_bp.route('/', methods=['POST'])
def predict():
    try:
        data = request.json
        print("="*50)
        print("📊 Prediction request received")
        print(f"📊 Data keys: {list(data.keys()) if data else 'None'}")
        print("="*50)
        
        if use_real_service:
            result = ml_service.predict(data)
            return jsonify(result)
        else:
            prediction, confidence = simple_predict(data)
            return jsonify({
                'success': True,
                'prediction': int(prediction),
                'confidence': float(confidence)
            })
    
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

@predict_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'status': 'healthy',
        'service_ready': use_real_service
    })