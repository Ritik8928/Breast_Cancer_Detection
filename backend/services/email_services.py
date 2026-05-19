import resend
import os
import random

class ResendEmailService:
    def __init__(self, api_key):
        resend.api_key = api_key
        self.from_email = os.getenv('RESEND_FROM_EMAIL', 'onboarding@resend.dev')
        print(f"✅ ResendEmailService initialized")
    
    def send_registration_otp(self, to_email, otp):
        try:
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": "🔐 Verify Your Email",
                "html": f"<h2>Your OTP is: {otp}</h2><p>Valid for 5 minutes.</p>"
            }
            resend.Emails.send(params)
            print(f"✅ OTP sent to {to_email}")
            return True
        except Exception as e:
            print(f"❌ Resend error: {e}")
            return False
    
    def send_password_reset_otp(self, to_email, otp):
        try:
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": "🔐 Password Reset",
                "html": f"<h2>Your OTP is: {otp}</h2><p>Valid for 5 minutes.</p>"
            }
            resend.Emails.send(params)
            print(f"✅ Password reset OTP sent to {to_email}")
            return True
        except Exception as e:
            print(f"❌ Resend error: {e}")
            return False
    
    def generate_otp(self):
        return str(random.randint(100000, 999999))