from flask import Blueprint, request, jsonify
from services.patient_data import PatientDataService

patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/save', methods=['POST'])
def save_patient():
    try:
        data = request.json
        email = data.get('email')
        patient_data = data.get('patientData')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email required'}), 400
        
        result = PatientDataService.save_patient(email, patient_data)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@patient_bp.route('/get/<email>', methods=['GET'])
def get_patient(email):
    try:
        result = PatientDataService.get_patient(email)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@patient_bp.route('/all', methods=['GET'])
def get_all_patients():
    try:
        patients = PatientDataService.get_all_patients()
        return jsonify({'success': True, 'patients': patients})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500