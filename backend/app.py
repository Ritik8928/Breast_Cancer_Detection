from flask import Flask
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv
from routes.patient import patient_bp
from routes.forgot_password import forgot_bp

# Load environment variables from .env file
load_dotenv()

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from routes.auth import auth_bp
from routes.predict import predict_bp
from routes.otp import otp_bp

app = Flask(__name__)

# CORS configuration - Read from environment variable
cors_origins_str = os.getenv('CORS_ORIGINS', '')
cors_origins = [origin.strip() for origin in cors_origins_str.split(',') if origin.strip()]

# Add default origins
default_origins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://flask-hello-world-a01be83f.containers.snapdeploy.dev'
]

# Combine and remove duplicates
all_origins = list(set(cors_origins + default_origins))

print(f"📋 CORS allowed origins: {all_origins}")

CORS(app, origins=all_origins, supports_credentials=True)

# Secret key from .env or fallback
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here-change-this')

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
    print("🚀 Flask Backend Running on http://localhost:5000")
    print("="*50)
    print("\n📋 Available APIs:")
    print("   POST /api/auth/register  - Register new user")
    print("   POST /api/auth/login     - Login user")
    print("   GET  /api/auth/users     - Get all users (debug)")
    print("   POST /api/predict/       - Make prediction")
    print("   POST /api/otp/send       - Send OTP")
    print("   POST /api/otp/verify     - Verify OTP")
    print("   GET  /api/health         - Health check")
    print("="*50 + "\n")
    
    port = int(os.environ.get("PORT", 5000))  
    app.run(host='0.0.0.0', port=port, debug=False)