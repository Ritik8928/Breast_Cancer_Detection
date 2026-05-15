import sys
import os
import numpy as np
import pandas as pd

from dataclasses import dataclass

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import (
    OneHotEncoder,
    StandardScaler
)

from src.exception import CustomException
from src.logger import logging
from src.utils import save_object


# =========================================================
# Configuration class
# Stores the path where preprocessor.pkl will be saved
# =========================================================

@dataclass
class DataTransformationConfig:
    preprocessor_obj_file_path = os.path.join(
        'artifacts',
        'preprocessor.pkl'
    )


# =========================================================
# Main Data Transformation Class
# =========================================================

class DataTransformation:

    def __init__(self):
        self.data_transformation_config = DataTransformationConfig()

    # =====================================================
    # Function to create preprocessing pipelines
    # =====================================================

    def get_data_transformer_object(self):

        try:

            # Numerical columns
            numerical_columns = [
                "Age",
                "Tumor Size",
                "Regional Node Examined",
                "Reginol Node Positive"
            ]

            # Categorical columns
            categorical_columns = [
                "Race",
                "Marital Status",
                "T Stage ",
                "N Stage",
                "6th Stage",
                "Estrogen Status",
                "Progesterone Status"
            ]

            # =================================================
            # Numerical Pipeline
            # 1. Fill missing values using median
            # 2. Apply scaling
            # =================================================

            num_pipeline = Pipeline(
                steps=[
                    (
                        'imputer',
                        SimpleImputer(strategy='median')
                    ),

                    (
                        'scaler',
                        StandardScaler()
                    )
                ]
            )

            # =================================================
            # Categorical Pipeline
            # 1. Fill missing values
            # 2. Apply One Hot Encoding
            # 3. Scale encoded values
            # =================================================

            cat_pipeline = Pipeline(
                steps=[
                    (
                        'imputer',
                        SimpleImputer(strategy='most_frequent')
                    ),

                    (
                        'one_hot_encoder',
                        OneHotEncoder(handle_unknown='ignore')
                    ),

                    (
                        'scaler',
                        StandardScaler(with_mean=False)
                    )
                ]
            )

            logging.info(
                f"Numerical Columns: {numerical_columns}"
            )

            logging.info(
                f"Categorical Columns: {categorical_columns}"
            )

            # =================================================
            # Combine numerical + categorical pipelines
            # =================================================

            preprocessor = ColumnTransformer(
                [
                    (
                        'num_pipeline',
                        num_pipeline,
                        numerical_columns
                    ),

                    (
                        'cat_pipeline',
                        cat_pipeline,
                        categorical_columns
                    )
                ]
            )

            return preprocessor

        except Exception as e:
            raise CustomException(e, sys)

    # =====================================================
    # Main Transformation Function
    # =====================================================

    def initiate_data_transformation(
        self,
        train_path,
        test_path
    ):

        try:

            # =============================================
            # Read train and test CSV files
            # =============================================

            train_df = pd.read_csv(train_path)
            test_df = pd.read_csv(test_path)

            logging.info(
                "Train and test data loaded successfully"
            )

            # =============================================
            # Remove duplicate rows
            # =============================================

            train_df = train_df.drop_duplicates()
            test_df = test_df.drop_duplicates()

            logging.info(
                "Duplicate rows removed"
            )

            # =============================================
            # Drop unnecessary columns
            # =============================================

            cols_to_drop = [
                "Survival Months",
                "A Stage",
                "differentiate",
                "Grade"
            ]

            train_df = train_df.drop(columns=cols_to_drop)
            test_df = test_df.drop(columns=cols_to_drop)

            logging.info(
                f"Dropped columns: {cols_to_drop}"
            )

            # =============================================
            # Handle outliers using IQR clipping
            # =============================================

            cols_to_clip = [
                "Regional Node Examined",
                "Reginol Node Positive",
                "Tumor Size"
            ]

            for col in cols_to_clip:

                # Calculate Q1 and Q3 using train data
                Q1 = train_df[col].quantile(0.25)
                Q3 = train_df[col].quantile(0.75)

                # Calculate IQR
                IQR = Q3 - Q1

                # Lower and upper limits
                lower_limit = Q1 - 1.5 * IQR
                upper_limit = Q3 + 1.5 * IQR

                # Clip train data
                train_df[col] = train_df[col].clip(
                    lower_limit,
                    upper_limit
                )

                # Apply same limits on test data
                test_df[col] = test_df[col].clip(
                    lower_limit,
                    upper_limit
                )

            logging.info(
                "Outliers handled using IQR clipping"
            )

            # =============================================
            # Get preprocessing object
            # =============================================

            preprocessing_obj = (
                self.get_data_transformer_object()
            )

            # =============================================
            # Define target column
            # =============================================

            target_column_name = "Status"

            # =============================================
            # Separate input features (X) and target (y)
            # =============================================

            input_feature_train_df = train_df.drop(
                columns=[target_column_name],
                axis=1
            )

            target_feature_train_df = train_df[
                target_column_name
            ]

            input_feature_test_df = test_df.drop(
                columns=[target_column_name],
                axis=1
            )

            target_feature_test_df = test_df[
                target_column_name
            ]

            logging.info(
                "Input features and target column separated"
            )

            # =============================================
            # Apply preprocessing on train and test data
            # =============================================

            input_feature_train_arr = (
                preprocessing_obj.fit_transform(
                    input_feature_train_df
                )
            )

            input_feature_test_arr = (
                preprocessing_obj.transform(
                    input_feature_test_df
                )
            )

            logging.info(
                "Preprocessing applied successfully"
            )

            # =============================================
            # Combine transformed input data with target
            # =============================================

            train_arr = np.c_[
                input_feature_train_arr,
                np.array(target_feature_train_df)
            ]

            test_arr = np.c_[
                input_feature_test_arr,
                np.array(target_feature_test_df)
            ]

            # =============================================
            # Save preprocessing object as pickle file
            # =============================================

            save_object(
                file_path=self.data_transformation_config.preprocessor_obj_file_path,
                obj=preprocessing_obj
            )

            logging.info(
                "Preprocessor pickle file saved successfully"
            )

            # =============================================
            # Return transformed arrays + pickle path
            # =============================================

            return (
                train_arr,
                test_arr,
                self.data_transformation_config.preprocessor_obj_file_path
            )

        except Exception as e:
            raise CustomException(e, sys)