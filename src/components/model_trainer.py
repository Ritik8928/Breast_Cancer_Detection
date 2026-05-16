import os
import sys
from dataclasses import dataclass

from src.exception import CustomException
from src.logger import logging
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import(
    accuracy_score, 
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score
)

from src.utils import save_object, evaluate_models

@dataclass
class ModelTrainerConfig:
    trained_model_file_path = os.path.join('artifacts', 'model.pkl')

class ModelTrainer:
    def __init__(self):
        self.model_trainer_config = ModelTrainerConfig()

    def initiate_model_trainer(self, train_array, test_array):
        try:
            logging.info("Splitting training and testing input data")
            X_train, y_train, X_test, y_test = (
                train_array[:, :-1],
                train_array[:, -1],
                test_array[:, :-1],
                test_array[:, -1]
            )

            models = {
                "Decision Tree": DecisionTreeClassifier(),
                "Logistic Regression": LogisticRegression()
            }

            model_report: dict = evaluate_models(X_train=X_train, y_train=y_train, X_test=X_test, 
                                                 y_test=y_test, models=models
                                                 )
            # To get the best model score from the dict
            best_model_score = max(sorted(model_report.values()))

            # To get the best model name from the dict
            best_model_name = list(model_report.keys())[
                list(model_report.values()).index(best_model_score)
            ]

            best_model = models[best_model_name]
            if best_model_score < 0.6:
                raise CustomException("No best model found with score greater than 0.6", sys)
            logging.info("Best found model on both training and testing dataset")
            
            save_object(
                file_path=self.model_trainer_config.trained_model_file_path,
                obj=best_model
            )

            predicted = best_model.predict(X_test)
            f1 = f1_score(y_test, predicted, average='weighted')

            return f1


        except Exception as e:
            raise CustomException(e, sys)