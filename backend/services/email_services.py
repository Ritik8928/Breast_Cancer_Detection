import resend
import os
import random

class ResendEmailService:
    def __init__(self, api_key):
        resend.api_key = api_key
        self.from_email = os.getenv('RESEND_FROM_EMAIL', 'onboarding@resend.dev')
        print(f"✅ ResendEmailService initialized")
    
    def send_registration_otp(self, to_email, otp):
        """Send OTP for registration"""
        try:
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": "🔐 Verify Your Email - Breast Cancer Detection",
                "html": f"""
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white;">
                        <h2 style="text-align: center;">Email Verification</h2>
                        <p>Your OTP for registration is:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 36px; font-weight: bold; letter-spacing: 5px; background: white; color: #764ba2; padding: 15px 30px; border-radius: 5px;">{otp}</span>
                        </div>
                        <p>This OTP is valid for 5 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                </body>
                </html>
                """
            }
            email = resend.Emails.send(params)
            print(f"✅ OTP sent to {to_email} via Resend")
            return True
        except Exception as e:
            print(f"❌ Resend error: {e}")
            return False
    
    def send_password_reset_otp(self, to_email, otp):
        """Send OTP for password reset"""
        try:
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": "🔐 Password Reset Request",
                "html": f"""
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%); padding: 30px; border-radius: 10px; color: white;">
                        <h2 style="text-align: center;">Password Reset</h2>
                        <p>Your OTP for password reset is:</p>
                        <div style="text-align: center; margin: 30px 0;">
                      s      <span style="font-size: 36px; font-weight: bold; letter-spacing: 5px; background: white; color: #c92a2a; padding: 15px 30px; border-radius: 5px;">{otp}</span>
                        </div>
                        <p>This OTP is valid for 5 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                </body>
                </html>
                """
            }
            email = resend.Emails.send(params)
            print(f"✅ Password reset OTP sent to {to_email} via Resend")
            return True
        except Exception as e:
            print(f"❌ Resend error: {e}")
            return False
    
    def generate_otp(self):
        return str(random.randint(100000, 999999))