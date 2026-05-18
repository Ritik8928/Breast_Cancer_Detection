import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random

class EmailService:
    def __init__(self, email_address, email_password):
        self.email_address = email_address
        self.email_password = email_password
        print(f"✅ EmailService initialized with {email_address}")
    
    def send_registration_otp(self, to_email, otp):
        """OTP for Registration"""
        subject = "Welcome to Breast Cancer Detection - Verify Your Email"
        
        body = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; border-bottom: 2px solid #28a745; padding-bottom: 20px; margin-bottom: 20px;">
                    <h1 style="color: #28a745; margin: 0;">📝 Breast Cancer Detection</h1>
                    <p style="color: #666; margin: 5px 0 0;">Complete Your Registration</p>
                </div>
                <div style="text-align: center;">
                    <p style="font-size: 16px; color: #333;">Welcome! Please verify your email address.</p>
                    <p style="font-size: 16px; color: #333;">Your OTP for registration is:</p>
                    <div style="font-size: 32px; font-weight: bold; color: #28a745; background: #f0f0f0; padding: 15px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
                        {otp}
                    </div>
                    <p style="color: #666; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self._send_email(to_email, subject, body)
    
    def send_password_reset_otp(self, to_email, otp):
        """OTP for Password Reset"""
        subject = "🔐 Password Reset Request - Breast Cancer Detection"
        
        body = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; border-bottom: 2px solid #dc3545; padding-bottom: 20px; margin-bottom: 20px;">
                    <h1 style="color: #dc3545; margin: 0;">🔐 Breasr Cancer Detection</h1>
                    <p style="color: #666; margin: 5px 0 0;">Password Reset Request</p>
                </div>
                <div style="text-align: center;">
                    <p style="font-size: 16px; color: #333;">We received a request to reset your password.</p>
                    <p style="font-size: 16px; color: #333;">Your OTP for password reset is:</p>
                    <div style="font-size: 32px; font-weight: bold; color: #dc3545; background: #f0f0f0; padding: 15px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
                        {otp}
                    </div>
                    <p style="color: #666; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self._send_email(to_email, subject, body)
    
    def _send_email(self, to_email, subject, body):
        """Internal method to send email"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"Breast Cancer Detection <{self.email_address}>"
            msg['To'] = to_email
            msg.attach(MIMEText(body, 'html'))
            
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(self.email_address, self.email_password)
                server.send_message(msg)
            
            print(f"✅ Email sent to {to_email}")
            return True
        
        except Exception as e:
            print(f"❌ Email error: {e}")
            return False
    
    def generate_otp(self):
        return str(random.randint(100000, 999999))


class MockEmailService:
    def __init__(self):
        print("⚠️ Using Mock Email Service")
    
    def send_registration_otp(self, to_email, otp):
        print(f"\n{'='*50}")
        print(f"📧 [REGISTRATION] OTP for {to_email}: {otp}")
        print(f"{'='*50}\n")
        return True
    
    def send_password_reset_otp(self, to_email, otp):
        print(f"\n{'='*50}")
        print(f"📧 [PASSWORD RESET] OTP for {to_email}: {otp}")
        print(f"{'='*50}\n")
        return True
    
    def generate_otp(self):
        return str(random.randint(100000, 999999))