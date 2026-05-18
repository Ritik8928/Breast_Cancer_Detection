import json
import os
from datetime import datetime

PATIENT_FILE = r"D:\Projects\Breast_Cancer_Detection\patients.json"

def load_patients():
    if os.path.exists(PATIENT_FILE):
        with open(PATIENT_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_patients(patients):
    with open(PATIENT_FILE, 'w') as f:
        json.dump(patients, f, indent=2)

class PatientDataService:
    @staticmethod
    def save_patient(email, patient_data):
        patients = load_patients()
        
        patients[email] = {
            'patientData': patient_data,
            'saved_at': datetime.now().isoformat()
        }
        
        save_patients(patients)
        return {'success': True, 'message': 'Patient data saved!'}
    
    @staticmethod
    def get_patient(email):
        patients = load_patients()
        if email in patients:
            return {'success': True, 'data': patients[email]}
        return {'success': False, 'data': None}
    
    @staticmethod
    def get_all_patients():
        patients = load_patients()
        return patients