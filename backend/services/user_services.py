import json
import os
import bcrypt
from datetime import datetime

USERS_FILE = r"D:\Projects\Breast_Cancer_Detection\users.json"

print(f"📁 Users file: {USERS_FILE}")

def hash_password(password):
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password, hashed):
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

class UserService:
    @staticmethod
    def _load_users():
        if os.path.exists(USERS_FILE):
            try:
                with open(USERS_FILE, 'r', encoding='utf-8') as f:
                    users = json.load(f)
                    print(f"📖 Loaded {len(users)} users")
                    return users
            except Exception as e:
                print(f"❌ Error: {e}")
                return {}
        print("⚠️ No users file found")
        return {}
    
    @staticmethod
    def _save_users(users):
        try:
            with open(USERS_FILE, 'w', encoding='utf-8') as f:
                json.dump(users, f, indent=2, ensure_ascii=False)
            print(f"💾 Saved {len(users)} users")
            return True
        except Exception as e:
            print(f"❌ Save error: {e}")
            return False
    
    @staticmethod
    def register_user(email, username, password, fullname, phone=''):
        users = UserService._load_users()
        
        print(f"📝 Registering: {email}")
        
        # Check if email exists
        if email in users:
            return {'success': False, 'error': 'Email already registered!'}
        
        # Check if username exists
        for user_data in users.values():
            if user_data.get('username') == username:
                return {'success': False, 'error': 'Username already taken!'}
        
        # Hash password before saving
        hashed_password = hash_password(password)
        print(f"🔐 Password hashed successfully")
        
        # Save user with hashed password
        users[email] = {
            'fullname': fullname,
            'email': email,
            'username': username,
            'phone': phone,
            'password': hashed_password,  # ← Hashed password stored
            'registered_at': datetime.now().isoformat()
        }
        
        if UserService._save_users(users):
            print(f"✅ Registered: {email}")
            return {'success': True, 'message': 'Registration successful!'}
        else:
            return {'success': False, 'error': 'Failed to save user!'}
    
    @staticmethod
    def login_user(email, password):
        users = UserService._load_users()
        
        print(f"🔐 Login attempt: {email}")
        print(f"Available emails: {list(users.keys())}")
        
        if email not in users:
            print(f"❌ Email not found: {email}")
            return {'success': False, 'error': 'User not found! Please register first.'}
        
        stored_hash = users[email]['password']
        print(f"Stored hash: {stored_hash[:30]}...")
        
        # Verify password against hash
        if verify_password(password, stored_hash):
            print(f"✅ Password verified for: {email}")
            user_data = {
                'email': users[email]['email'],
                'username': users[email]['username'],
                'fullname': users[email]['fullname']
            }
            return {'success': True, 'user': user_data}
        else:
            print(f"❌ Password mismatch for: {email}")
            return {'success': False, 'error': 'Invalid password!'}
    
    @staticmethod
    def get_all_users():
        users = UserService._load_users()
        # Remove passwords from output for security
        user_list = []
        for email, user_data in users.items():
            user_list.append({
                'email': email,
                'username': user_data.get('username'),
                'fullname': user_data.get('fullname'),
                'phone': user_data.get('phone'),
                'registered_at': user_data.get('registered_at')
            })
        return user_list