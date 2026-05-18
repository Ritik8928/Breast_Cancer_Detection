from flask import Blueprint, request, jsonify
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.user_services import UserService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print(f"\n{'='*50}")
        print(f"📝 REGISTER REQUEST")
        print(f"Full data: {data}")
        
        email = data.get('email', '').strip().lower()  # Convert to lowercase
        username = data.get('username', '').strip()
        password = data.get('password', '')
        fullname = data.get('fullname', '')
        
        print(f"Processed email: {email}")
        print(f"Processed username: {username}")
        print(f"Password length: {len(password)}")
        
        if not email:
            return jsonify({'success': False, 'error': 'Email required'}), 400
        
        if not username:
            return jsonify({'success': False, 'error': 'Username required'}), 400
        
        if not password:
            return jsonify({'success': False, 'error': 'Password required'}), 400
        
        if len(password) < 8:
            return jsonify({'success': False, 'error': 'Password must be 8+ characters'}), 400
        
        result = UserService.register_user(email, username, password, fullname)
        
        print(f"Register result: {result}")
        print(f"{'='*50}\n")
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(f"\n{'='*50}")
        print(f"🔐 LOGIN REQUEST")
        print(f"Full data: {data}")
        
        email = data.get('email', '').strip().lower()  # Convert to lowercase
        password = data.get('password', '')
        
        print(f"Processed email: {email}")
        print(f"Password length: {len(password)}")
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password required'}), 400
        
        result = UserService.login_user(email, password)
        
        print(f"Login result: {result}")
        print(f"{'='*50}\n")
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = UserService.get_all_users()
    print(f"📋 Total users: {len(users)}")
    return jsonify({'success': True, 'users': users, 'count': len(users)})