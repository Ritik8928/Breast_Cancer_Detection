from flask import Flask
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv
from routes.patient import patient_bp
from routes.forgot_password import forgot_bp
from routes.auth import auth_bp
from routes.predict import predict_bp
from routes.otp import otp_bp

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)

# ✅ SIMPLE CORS - Allow all origins (Temporary fix for testing)
CORS(app, resources={r"/*": {"origins": "*"}})

# Secret key
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(predict_bp, url_prefix='/api/predict')
app.register_blueprint(otp_bp, url_prefix='/api/otp')
app.register_blueprint(patient_bp, url_prefix='/api/patient')
app.register_blueprint(forgot_bp, url_prefix='/api/forgot-password')

@app.route('/api/health', methods=['GET'])
def health():
    return {'status': 'healthy', 'message': 'Server is running!'}

@app.route('/')
def home():
    return {'status': 'ok', 'message': 'Breast Cancer Detection API is running'}

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Flask Backend Running")
    print("="*50)
    
    port = int(os.environ.get("PORT", 5000))  
    app.run(host='0.0.0.0', port=port, debug=False)