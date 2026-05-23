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
            # Convert frontend data to model's expected column names
            df = pd.DataFrame([{
                'Age': int(data_dict.get('Age', 0)),
                'Tumor Size': float(data_dict.get('Tumour_Size', 0)),                      # ← Changed
                'Regional Node Examined': int(data_dict.get('Regional_nodes_examined', 0)), # ← Changed
                'Reginol Node Positive': int(data_dict.get('Regional_nodes_positive', 0)),  # ← Changed
                'Race': data_dict.get('Race', 'White'),
                'Marital Status': data_dict.get('Martial_Status', 'Single'),               # ← Changed
                'T Stage ': data_dict.get('T_Stage', 'Stage I'),                           # ← Changed (note space)
                'N Stage': data_dict.get('N_Stage', 'Stage I'),                            # ← Changed
                '6th Stage': data_dict.get('Sixth_Stage', 'Stage I'),                      # ← Changed
                'Estrogen Status': data_dict.get('Estrogen_Status', 'Positive'),           # ← Changed
                'Progesterone Status': data_dict.get('Progesterone_Status', 'Positive')    # ← Changed
            }])

            print(f"DataFrame columns: {df.columns.tolist()}")

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

            print(f"Prediction: {prediction[0]}, Confidence: {confidence}")

            return {
                'success': True,
                'prediction': int(prediction[0]),
                'confidence': confidence
            }

        except Exception as e:
            print(f"❌ Prediction error: {e}")
            import traceback
            traceback.print_exc()

            return {
                'success': False,
                'error': str(e)
            }