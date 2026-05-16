import os
import sys

from sklearn.metrics import f1_score
import dill

from src.exception import CustomException

def save_object(file_path, obj):
    try:
        dir_path = os.path.dirname(file_path)
        os.makedirs(dir_path, exist_ok=True)
        with open(file_path, "wb") as file_obj:
            dill.dump(obj, file_obj)

    except Exception as e:
        raise CustomException(e, sys)
    
def evaluate_models(X_train, y_train, X_test, y_test, models):
    try:
        report = {}
        for i in range(len(models)):
            model = list(models.values())[i]
            model.fit(X_train, y_train)
            y_prob = model.predict_proba(X_test)[:, 1]
            y_test_pred = (y_prob > 0.4).astype(int)

            test_model_score = f1_score(y_test, y_test_pred, average='weighted')

            report[list(models.keys())[i]] = test_model_score

        return report

    except Exception as e:
        raise CustomException(e, sys)