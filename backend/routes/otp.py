from flask import Blueprint, request, jsonify
from datetime import datetime
import sys
import os
import traceback
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.email_services import EmailService, MockEmailService

otp_bp = Blueprint('otp', __name__)

# Print environment variables status
EMAIL_ADDRESS = os.getenv('EMAIL_ADDRESS')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

print(f"\n{'='*50}")
print(f"📧 EMAIL_ADDRESS from env: {EMAIL_ADDRESS}")
print(f"📧 EMAIL_PASSWORD loaded: {'✅ Yes' if EMAIL_PASSWORD else '❌ No'}")
print(f"{'='*50}\n")

# Initialize email service
if EMAIL_ADDRESS and EMAIL_PASSWORD:
    try:
        email_service = EmailService(EMAIL_ADDRESS, EMAIL_PASSWORD)
        print("✅ Using REAL email service")
    except Exception as e:
        print(f"❌ Error initializing EmailService: {e}")
        traceback.print_exc()
        email_service = MockEmailService()
        print("⚠️ Falling back to MOCK email service")
else:
    print("⚠️ Email credentials missing! Using MOCK email service")
    email_service = MockEmailService()

otp_storage = {}

@otp_bp.route('/send', methods=['POST'])
def send_otp():
    print(f"\n{'='*60}")
    print(f"🔵 OTP SEND REQUEST RECEIVED")
    print(f"{'='*60}")
    
    try:
        # Get request data
        data = request.json
        email = data.get('email')
        
        print(f"📧 Email: {email}")
        
        if not email:
            print("❌ No email provided")
            return jsonify({'success': False, 'error': 'Email required'}), 400
        
        # Generate OTP
        otp = email_service.generate_otp()
        print(f"🔐 Generated OTP: {otp}")
        
        # Store OTP
        otp_storage[email] = {
            'otp': otp,
            'timestamp': datetime.now(),
            'verified': False
        }
        print(f"💾 OTP stored for {email}")
        
        # Send email - WITH DETAILED ERROR HANDLING
        print(f"📤 Attempting to send OTP email to {email}...")
        
        try:
            # Try the correct method name
            result = email_service.send_registration_otp(email, otp)
            print(f"📧 send_registration_otp() result: {result}")
            
        except AttributeError as e:
            print(f"❌ AttributeError: {e}")
            print(f"💡 Available methods: {[m for m in dir(email_service) if not m.startswith('_')]}")
            
            # Try alternative method names
            try:
                if hasattr(email_service, 'send_otp_email'):
                    result = email_service.send_otp_email(email, otp)
                    print(f"📧 send_otp_email() result: {result}")
                else:
                    result = False
                    print("❌ No suitable send method found")
            except Exception as e2:
                print(f"❌ Alternative method also failed: {e2}")
                result = False
                
        except Exception as e:
            print(f"❌ Exception while sending email: {type(e).__name__}: {e}")
            traceback.print_exc()
            result = False
        
        # Return response
        if result:
            print(f"✅ OTP email sent successfully to {email}")
            return jsonify({'success': True, 'message': 'OTP sent to your email! Check spam folder if not received.'})
        else:
            print(f"❌ Failed to send OTP email to {email}")
            # Print OTP to console as fallback
            print(f"\n{'!'*60}")
            print(f"⚠️ EMAIL NOT SENT - Use this OTP for testing: {otp}")
            print(f"📧 This OTP is valid for 5 minutes")
            print(f"{'!'*60}\n")
            return jsonify({'success': True, 'message': f'OTP: {otp} (Check server logs - email failed to send)'})
    
    except Exception as e:
        print(f"\n{'!'*60}")
        print(f"❌ UNEXPECTED ERROR in send_otp:")
        print(f"❌ Error type: {type(e).__name__}")
        print(f"❌ Error message: {e}")
        print(f"❌ Full traceback:")
        traceback.print_exc()
        print(f"{'!'*60}\n")
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