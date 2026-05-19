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
                "subject": "🔐 Verify Your Email - Breast Cancer Detection",
                "html": f"""
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Your OTP Code</h2>
                    <p>Your OTP for registration is: <strong>{otp}</strong></p>
                    <p>Valid for 5 minutes.</p>
                </div>
                """
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
                "subject": "🔐 Password Reset Request",
                "html": f"""
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Password Reset</h2>
                    <p>Your OTP for password reset is: <strong>{otp}</strong></p>
                    <p>Valid for 5 minutes.</p>
                </div>
                """
            }
            resend.Emails.send(params)
            print(f"✅ Password reset OTP sent to {to_email}")
            return True
        except Exception as e:
            print(f"❌ Resend error: {e}")
            return False
    
    def generate_otp(self):
        return str(random.randint(100000, 999999))