# model_trainer.py
import os
import sys
from dataclasses import dataclass
from src.exception import CustomException
from src.logger import logging
from src.utils import save_object
from imblearn.over_sampling import SMOTE
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    roc_auc_score
)


@dataclass
class ModelTrainerConfig:
    trained_model_file_path = os.path.join('artifacts','model.pkl')

class ModelTrainer:
    def __init__(self):
        self.config = ModelTrainerConfig()

    def initiate_model_trainer(self, train_array, test_array):
        try:
            # Split Data
            X_train, y_train, X_test, y_test = (
                train_array[:, :-1],
                train_array[:, -1],

                test_array[:, :-1],
                test_array[:, -1]
            )

            # Apply SMOTE
            smote = SMOTE(random_state=42)
            X_train, y_train = smote.fit_resample(X_train, y_train)
            logging.info("SMOTE applied successfully")

            # Models
            models = {
                "decision tree": DecisionTreeClassifier(
                    class_weight='balanced',
                    max_depth=3,
                    min_samples_leaf=20,
                    random_state=42
                ),

                "logistic regression": LogisticRegression(
                    class_weight='balanced',
                    C=0.1,
                    penalty='l2',
                    solver='liblinear',
                    random_state=42
                ),

                "random forest": RandomForestClassifier(
                    class_weight='balanced',
                    n_estimators=300,
                    max_depth=5,
                    min_samples_leaf=15,
                    random_state=42
                )
            }

            # Model Evaluation
            model_report = {}
            for model_name, model in models.items():

                # Train Model
                model.fit(X_train, y_train)

                #train test score
                train_score = model.score(X_train, y_train)
                test_score = model.score(X_test, y_test)

                # Probability Prediction
                y_prob = model.predict_proba(X_test)[:, 1]

                # Threshold Tuning
                y_pred = (y_prob > 0.4).astype(int)

                # Classification Report
                report = classification_report(y_test,y_pred,output_dict=True)

                # Macro Avg F1 Score
                model_score = report['macro avg']['f1-score']
                model_report[model_name] = model_score

                print(f"\n================ {model_name} ================\n")
                print(classification_report(y_test, y_pred))

            # Best Model Selection
            best_model_name = max(model_report,key=model_report.get)
            best_model_score = model_report[best_model_name]
            best_model = models[best_model_name]

            print("\n===================================")

            print("Best Model:", best_model_name)
            print("Best Score:", best_model_score)

            print("===================================\n")

            # Save Best Model
            save_object(
                file_path=self.config.trained_model_file_path,
                obj=best_model
            )
            logging.info("Best model saved successfully")

            # Final Evaluation

            predicted = best_model.predict(X_test)
            y_prob = best_model.predict_proba(X_test)[:, 1]

            accuracy = accuracy_score(y_test, predicted)
            roc_auc = roc_auc_score(y_test,y_prob)
            cm = confusion_matrix(y_test,predicted)
            cr = classification_report(y_test,predicted)

            print("\nAccuracy Score:")
            print(accuracy)

            print("\nROC-AUC Score:")
            print(roc_auc)

            print("\nConfusion Matrix:")
            print(cm)

            print("\nClassification Report:")
            print(cr)

            print("Train Score:", train_score)
            print("Test Score:", test_score)

        except Exception as e:
            raise CustomException(e, sys)