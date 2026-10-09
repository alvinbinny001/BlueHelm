import xgboost as xgb
import pandas as pd
import numpy as np
import os

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "xgboost_model.json")

FEATURE_NAMES = ["feature_1", "feature_2", "feature_3"]

def train_dummy_model():
    """Trains a simple dummy XGBoost model and saves it if it doesn't exist."""
    print("Training dummy XGBoost model...")
    X = pd.DataFrame(np.random.rand(100, 3), columns=FEATURE_NAMES)
    y = X["feature_1"] * 0.5 + X["feature_2"] * 0.3 + X["feature_3"] * 0.2 + np.random.randn(100) * 0.1

    dtrain = xgb.DMatrix(X, label=y, feature_names=FEATURE_NAMES)
    params = {"objective": "reg:squarederror"}
    booster = xgb.train(params, dtrain, num_boost_round=10)
    booster.save_model(MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

def load_model():
    """Loads the XGBoost model. Trains a dummy one if it doesn't exist."""
    if not os.path.exists(MODEL_PATH):
        train_dummy_model()

    booster = xgb.Booster()
    booster.load_model(MODEL_PATH)
    return booster

# Global model instance
model = load_model()

def optimize(feature_1: float, feature_2: float, feature_3: float) -> float:
    """Runs optimization prediction using the loaded model."""
    input_data = pd.DataFrame([{
        "feature_1": feature_1,
        "feature_2": feature_2,
        "feature_3": feature_3
    }])
    dmatrix = xgb.DMatrix(input_data, feature_names=FEATURE_NAMES)
    prediction = model.predict(dmatrix)[0]
    return float(prediction)
