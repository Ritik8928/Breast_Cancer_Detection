from flask import Blueprint, request, jsonify
from datetime import datetime
import sys
import os
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to import, with fallback
try:
    from services.email_services import ResendEmailService
    RESEND_API_KEY = os.getenv('RESEND_API_KEY')
    if RESEND_API_KEY:
        email_service = ResendEmailService(RESEND_API_KEY)
        print("✅ Using Resend email service")
    else:
        print("❌ RESEND_API_KEY not set")
        email_service = None
except ImportError as e:
    print(f"❌ Import error: {e}")
    email_service = None

otp_bp = Blueprint('otp', __name__)
otp_storage = {}

@otp_bp.route('/send', methods=['POST'])
def send_otp():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email required'}), 400
        
        if not email_service:
            return jsonify({'success': False, 'error': 'Email service not configured'}), 500
        
        otp = email_service.generate_otp()
        
        otp_storage[email] = {
            'otp': otp,
            'timestamp': datetime.now(),
            'verified': False
        }
        
        if email_service.send_registration_otp(email, otp):
            return jsonify({'success': True, 'message': 'OTP sent to your email!'})
        else:
            return jsonify({'success': False, 'error': 'Failed to send OTP'}), 500
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@otp_bp.route('/verify', methods=['POST'])
def verify_otp():
    print(f"\n{'='*60}")
    print(f"🔵 OTP VERIFY REQUEST RECEIVED")
    print(f"{'='*60}")
    
    try:
        data = request.json
        email = data.get('email')
        user_otp = data.get('otp')
        
        print(f"📧 Email: {email}")
        print(f"🔐 Entered OTP: {user_otp}")
        
        if email not in otp_storage:
            print(f"❌ OTP not found for {email}")
            return jsonify({'success': False, 'error': 'OTP not found'}), 400
        
        stored = otp_storage[email]
        stored_otp = stored['otp']
        time_diff = (datetime.now() - stored['timestamp']).total_seconds()
        
        print(f"💾 Stored OTP: {stored_otp}")
        print(f"⏱️ Time elapsed: {time_diff:.0f} seconds")
        
        if time_diff > 300:
            del otp_storage[email]
            print(f"❌ OTP expired for {email}")
            return jsonify({'success': False, 'error': 'OTP expired'}), 400
        
        if user_otp == stored_otp:
            otp_storage[email]['verified'] = True
            print(f"✅ OTP verified successfully for {email}")
            return jsonify({'success': True, 'message': 'OTP verified!'})
        else:
            print(f"❌ Invalid OTP for {email}")
            return jsonify({'success': False, 'error': 'Invalid OTP'}), 400
    
    except Exception as e:
        print(f"❌ Error in verify_otp: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500