import joblib
import pandas as pd
import os


class MLService:
    def __init__(self, model_path=None, preprocessor_path=None):
        """Initialize ML Service with model and preprocessor"""

        self.model = None
        self.preprocessor = None

        # Load model
        if not model_path or not os.path.exists(model_path):
            raise FileNotFoundError(f"❌ Model file not found: {model_path}")

        try:
            self.model = joblib.load(model_path)
            print(f"✅ Model loaded from {model_path}")
        except Exception as e:
            raise Exception(f"❌ Error loading model: {e}")

        # Load preprocessor
        if not preprocessor_path or not os.path.exists(preprocessor_path):
            raise FileNotFoundError(f"❌ Preprocessor file not found: {preprocessor_path}")

        try:
            self.preprocessor = joblib.load(preprocessor_path)
            print(f"✅ Preprocessor loaded from {preprocessor_path}")
        except Exception as e:
            raise Exception(f"❌ Error loading preprocessor: {e}")

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

            # Apply preprocessing
            processed_data = self.preprocessor.transform(df)

            # Prediction
            prediction = self.model.predict(processed_data)

            # Probability
            if hasattr(self.model, 'predict_proba'):
                prediction_proba = self.model.predict_proba(processed_data)
                confidence = float(prediction_proba[0][1])
            else:
                confidence = 0.0

            return {
                'success': True,
                'prediction': int(prediction[0]),
                'confidence': confidence
            }

        except Exception as e:
            print(f"❌ Prediction error: {e}")

            return {
                'success': False,
                'error': str(e)
            }