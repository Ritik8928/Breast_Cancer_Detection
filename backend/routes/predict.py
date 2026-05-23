from flask import Blueprint, request, jsonify
import os
import sys
import random

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
        print(f"Data received: {data}")
        print("=" * 50)

        # Map frontend field names to model field names
        mapped_data = {
            'Age': int(data.get('Age', 0)),
            'Tumor Size': float(data.get('Tumour_Size', 0)),                      # Tumour_Size → Tumor Size
            'Regional Node Examined': int(data.get('Regional_nodes_examined', 0)), # → Regional Node Examined
            'Reginol Node Positive': int(data.get('Regional_nodes_positive', 0)),  # → Reginol Node Positive
            'Race': data.get('Race', 'White'),
            'Marital Status': data.get('Martial_Status', 'Single'),               # Martial_Status → Marital Status
            'T Stage ': data.get('T_Stage', 'Stage I'),                           # T_Stage → T Stage (space)
            'N Stage': data.get('N_Stage', 'Stage I'),
            '6th Stage': data.get('Sixth_Stage', 'Stage I'),                      # Sixth_Stage → 6th Stage
            'Estrogen Status': data.get('Estrogen_Status', 'Positive'),           # Estrogen_Status → Estrogen Status
            'Progesterone Status': data.get('Progesterone_Status', 'Positive')    # → Progesterone Status
        }

        print(f"Mapped data for model: {mapped_data}")

        result = ml_service.predict(mapped_data)

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