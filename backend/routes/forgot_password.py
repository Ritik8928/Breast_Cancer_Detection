from flask import Blueprint, request, jsonify
import random
from datetime import datetime
import sys
import os
from dotenv import load_dotenv
from services.user_services import UserService
from services.email_services import ResendEmailService

# Load .env
dotenv_path = r"D:\Projects\Breast_Cancer_Detection\.env"
load_dotenv(dotenv_path)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

forgot_bp = Blueprint('forgot', __name__)

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

print(f"📧 Email: {EMAIL_ADDRESS}")


# Initialize email service
if EMAIL_ADDRESS and RESEND_API_KEY:
    email_service = ResendEmailService(RESEND_API_KEY)
    print("✅ Resend Email Service Initialized")
else:
    print("❌ Resend configuration missing!")
    email_service = None

reset_otp_storage = {}

@forgot_bp.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.json
        email = data.get('email')
        
        print(f"📧 Request for: {email}")
        
        # Check if user exists
        users = UserService._load_users()
        if email not in users:
            return jsonify({'success': False, 'error': 'Email not registered!'}), 400
        
        otp = str(random.randint(100000, 999999))
        
        reset_otp_storage[email] = {
            'otp': otp,
            'timestamp': datetime.now(),
            'verified': False
        }
        
        # Always print to console
        print(f"\n{'='*50}")
        print(f"🔐 OTP for {email}: {otp}")
        print(f"{'='*50}\n")
        
        # Try to send email if service exists
        if email_service:
            try:
                email_service.send_password_reset_otp(email, otp)
            except Exception as e:
                print(f"Email send error: {e}")
        
        return jsonify({'success': True, 'message': f'OTP: {otp} (Check terminal/email)'})
    
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
    

@forgot_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.json
        email = data.get('email')
        user_otp = data.get('otp')
        
        if email not in reset_otp_storage:
            return jsonify({'success': False, 'error': 'OTP not found. Request new OTP.'}), 400
        
        stored = reset_otp_storage[email]
        time_diff = (datetime.now() - stored['timestamp']).total_seconds()
        
        if time_diff > 300:
            del reset_otp_storage[email]
            return jsonify({'success': False, 'error': 'OTP expired. Request new OTP.'}), 400
        
        if user_otp == stored['otp']:
            reset_otp_storage[email]['verified'] = True
            return jsonify({'success': True, 'message': 'OTP verified!'})
        else:
            return jsonify({'success': False, 'error': 'Invalid OTP'}), 400
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@forgot_bp.route('/reset', methods=['POST'])
def reset_password():
    try:
        data = request.json
        email = data.get('email')
        new_password = data.get('newPassword')
        
        if email not in reset_otp_storage or not reset_otp_storage[email].get('verified'):
            return jsonify({'success': False, 'error': 'OTP not verified'}), 400
        
        if len(new_password) < 6:
            return jsonify({'success': False, 'error': 'Password must be at least 6 characters'}), 400
        
        users = UserService._load_users()
        
        if email not in users:
            return jsonify({'success': False, 'error': 'User not found'}), 400
        
        from services.user_services import hash_password
        users[email]['password'] = hash_password(new_password)
        
        UserService._save_users(users)
        
        del reset_otp_storage[email]
        
        print(f"✅ Password reset successful for: {email}")
        
        return jsonify({'success': True, 'message': 'Password reset successful!'})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500