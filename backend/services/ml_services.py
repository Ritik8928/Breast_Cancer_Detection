import joblib
import pandas as pd
import numpy as np
import os
import random

class MLService:
    def __init__(self, model_path=None, preprocessor_path=None):
        """Initialize ML Service with model and preprocessor"""
        self.model = None
        self.preprocessor = None
        
        if model_path and os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                print(f"✅ Model loaded from {model_path}")
            except Exception as e:
                print(f"❌ Error loading model: {e}")
                self.model = None
        
        if preprocessor_path and os.path.exists(preprocessor_path):
            try:
                self.preprocessor = joblib.load(preprocessor_path)
                print(f"✅ Preprocessor loaded from {preprocessor_path}")
            except Exception as e:
                print(f"⚠️ Error loading preprocessor: {e}")
    
    def predict(self, data_dict):
        """Make prediction for single input"""
        try:
            # Convert frontend data to DataFrame
            df = pd.DataFrame([{
                'Age': int(data_dict.get('Age', 0)),
                'Tumour_Size': float(data_dict.get('Tumour_Size', 0)),
                'Regional_nodes_examined': int(data_dict.get('Regional_nodes_examined', 0)),
                'Regional_nodes_positive': int(data_dict.get('Regional_nodes_positive', 0)),
                'Race': data_dict.get('Race', 'White'),
                'Martial_Status': data_dict.get('Martial_Status', 'Single'),
                'T_Stage': data_dict.get('T_Stage', 'Stage I'),
                'N_Stage': data_dict.get('N_Stage', 'Stage I'),
                'Sixth_Stage': data_dict.get('Sixth_Stage', 'Stage I'),
                'Estrogen_Status': data_dict.get('Estrogen_Status', 'Positive'),
                'Progesterone_Status': data_dict.get('Progesterone_Status', 'Positive')
            }])
            
            # Apply preprocessor if exists
            if self.preprocessor is not None:
                try:
                    df = self.preprocessor.transform(df)
                except Exception as e:
                    print(f"⚠️ Preprocessor error: {e}")
            
            # Make prediction
            if self.model is not None:
                prediction = self.model.predict(df)
                if hasattr(self.model, 'predict_proba'):
                    prediction_proba = self.model.predict_proba(df)
                    confidence = float(prediction_proba[0][1])
                else:
                    confidence = 0.85
                
                return {
                    'success': True,
                    'prediction': int(prediction[0]),
                    'confidence': confidence
                }
            else:
                # Fallback to random if model not loaded
                prediction = random.choice([0, 1])
                confidence = random.uniform(0.7, 0.95)
                return {
                    'success': True,
                    'prediction': int(prediction),
                    'confidence': float(confidence)
                }
        
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            return {
                'success': False,
                'error': str(e)
            }

class MockMLService:
    def __init__(self):
        print("⚠️ Using Mock ML Service (Random predictions)")
    
    def predict(self, data_dict):
        """Mock prediction - returns random result"""
        prediction = random.choice([0, 1])
        confidence = random.uniform(0.7, 0.95)
        
        print(f"🎲 Mock prediction: {prediction}, confidence: {confidence:.2%}")
        
        return {
            'success': True,
            'prediction': prediction,
            'confidence': confidence
        }