import pandas as pd
import joblib
import os

# Load trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "battery_rul_model.pkl")

model = joblib.load(MODEL_PATH)


def analyze_battery(df):
    """
    Takes battery dataframe with cycle_number and capacity_retention_percent
    Returns battery intelligence summary dictionary
    """

    # Get latest cycle
    current_cycle = df["cycle_number"].iloc[-1]
    current_health = df["capacity_retention_percent"].iloc[-1]

    # Predict health at next 20 cycles
    future_cycle = pd.DataFrame({"cycle_number": [current_cycle + 20]})
    predicted_future_health = model.predict(future_cycle)[0]

    # Estimate remaining cycles to 60%
    target_health = 60
    avg_deg = abs(df["capacity_retention_percent"].diff().mean())
    remaining_cycles = (current_health - target_health) / avg_deg

    # Health status
    if current_health > 85:
        status = "Excellent"
    elif current_health > 75:
        status = "Good"
    elif current_health > 65:
        status = "Warning"
    else:
        status = "Critical"

    return {
        "current_cycle": int(current_cycle),
        "current_health": round(float(current_health), 2),
        "status": status,
        "remaining_cycles": int(round(remaining_cycles)),
        "predicted_health_20_cycles_later": round(float(predicted_future_health), 2)
    }