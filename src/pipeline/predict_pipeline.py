import sys
from src.exception import CustomException
from src.utils import load_object
import numpy as np
import pandas as pd

class PredictPipeline:
    def __init__(self):
        pass

    def predict(self, features):
        try:
            model_path = "artifacts/model.pkl"
            model = load_object(file_path=model_path)

            preprocessor_path = "artifacts/preprocessor.pkl"
            preprocessor = load_object(file_path='artifacts/preprocessor.pkl')

            data_scaled = preprocessor.transform(features)
            preds = model.predict(data_scaled)
            return preds
        except Exception as e:
            raise CustomException(e, sys)
        
class CustomData:
    def __init__(self,
                Age: int,
                Tumour_Size: float,
                Regional_nodes_examined: int,
                Regional_nodes_positive: int,
                Race: str,
                Martial_Status: str,
                T_Stage: str,
                N_Stage: str,
                Sixth_Stage: str,
                Estrogen_Status: str,
                Progesterone_Status: str
                ):

                self.Age = Age
                self.Tumour_Size = Tumour_Size
                self.Regional_nodes_examined = Regional_nodes_examined
                self.Regional_nodes_positive = Regional_nodes_positive
                self.Race = Race
                self.Martial_Status = Martial_Status
                self.T_Stage = T_Stage
                self.N_Stage = N_Stage
                self.Sixth_Stage = Sixth_Stage
                self.Estrogen_Status = Estrogen_Status
                self.Progesterone_Status = Progesterone_Status

    def get_data_as_dataframe(self):
        try:
            custom_data_input_dict = {
                "Age": [self.Age],
                "Tumour_Size": [self.Tumour_Size],
                "Regional_nodes_examined": [self.Regional_nodes_examined],
                "Regional_nodes_positive": [self.Regional_nodes_positive],
                "Race": [self.Race],
                "Marital Status": [self.Martial_Status],
                "T Stage": [self.T_Stage],
                "N Stage": [self.N_Stage],
                "Sixth_Stage": [self.Sixth_Stage],
                "Estrogen_Status": [self.Estrogen_Status],
                "Progesterone_Status": [self.Progesterone_Status]
            }
            return pd.DataFrame(custom_data_input_dict)
        
        except Exception as e:
             raise CustomException(e, sys)
