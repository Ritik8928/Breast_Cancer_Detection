from flask import Blueprint, request, jsonify
from datetime import datetime
import sys
import os
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.email_services import EmailService, MockEmailService

otp_bp = Blueprint('otp', __name__)

USE_REAL_EMAIL = True   

EMAIL_ADDRESS = os.getenv('EMAIL_ADDRESS')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
# ============================================

# Initialize email service
if USE_REAL_EMAIL and EMAIL_ADDRESS and EMAIL_PASSWORD:
    email_service = EmailService(EMAIL_ADDRESS, EMAIL_PASSWORD)
    print("✅ Using REAL email service")
else:
    email_service = MockEmailService()
    print("⚠️ Using MOCK email service (OTP in console)")

otp_storage = {}

@otp_bp.route('/send', methods=['POST'])
def send_otp():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email required'}), 400
        
        otp = email_service.generate_otp()
        
        otp_storage[email] = {
            'otp': otp,
            'timestamp': datetime.now(),
            'verified': False
        }
        
        if email_service.send_registraion_otp(email, otp):
            return jsonify({'success': True, 'message': 'OTP sent to your email!'})
        else:
            return jsonify({'success': False, 'error': 'Failed to send OTP'}), 500
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@otp_bp.route('/verify', methods=['POST'])
def verify_otp():
    try:
        data = request.json
        email = data.get('email')
        user_otp = data.get('otp')
        
        if email not in otp_storage:
            return jsonify({'success': False, 'error': 'OTP not found'}), 400
        
        stored = otp_storage[email]
        time_diff = (datetime.now() - stored['timestamp']).total_seconds()
        
        if time_diff > 300:
            del otp_storage[email]
            return jsonify({'success': False, 'error': 'OTP expired'}), 400
        
        if user_otp == stored['otp']:
            otp_storage[email]['verified'] = True
            return jsonify({'success': True, 'message': 'OTP verified!'})
        else:
            return jsonify({'success': False, 'error': 'Invalid OTP'}), 400
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500