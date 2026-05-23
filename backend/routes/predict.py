from flask import Blueprint, request, jsonify
import os
import sys

# Create blueprint
predict_bp = Blueprint('predict', __name__)

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ml_services import MLService

# Project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Model paths
MODEL_PATH = os.path.join(BASE_DIR, 'artifacts', 'model.pkl')
PREPROCESSOR_PATH = os.path.join(BASE_DIR, 'artifacts', 'preprocessor.pkl')

print("MODEL PATH:", MODEL_PATH)
print("PREPROCESSOR PATH:", PREPROCESSOR_PATH)

# Check files
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

if not os.path.exists(PREPROCESSOR_PATH):
    raise FileNotFoundError(f"Preprocessor file not found: {PREPROCESSOR_PATH}")

# Load ML service
ml_service = MLService(MODEL_PATH, PREPROCESSOR_PATH)

print("Using real ML model")


@predict_bp.route('/', methods=['POST'])
def predict():
    try:
        data = request.json

        print("=" * 50)
        print("Prediction request received")
        print(f"Data keys: {list(data.keys()) if data else 'None'}")
        print("=" * 50)

        result = ml_service.predict(data)

        return jsonify(result)

    except Exception as e:
        print(f"❌ Prediction error: {e}")

        import traceback
        traceback.print_exc()

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@predict_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'status': 'healthy'
    })