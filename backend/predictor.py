# predictor.py
# BatteryIQ — ML Prediction Engine

import pickle
import numpy as np
import os
import csv

# ============================================
# LOAD ALL MODELS AT STARTUP
# ============================================

# Current file directory (backend/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Local paths within the new project structure
MODEL_DIR = os.path.join(BASE_DIR, "models")
DATA_PATH = os.path.join(BASE_DIR, "data", "master_df_final.csv")

def load_model(filename):
    path = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Critical Model missing: {path}")
    with open(path, "rb") as f:
        return pickle.load(f)

# Load once on startup
try:
    stress_model  = load_model("stress_model.pkl")
    health_model  = load_model("health_model.pkl")
    rul_model     = load_model("rul_model.pkl")
    eff_model     = load_model("eff_model.pkl")
    feature_cols  = load_model("feature_cols.pkl")
    print("All BatteryIQ models loaded successfully from local directory!")
except Exception as e:
    print(f"ERROR: Failed to load models: {str(e)}")
    # We don't crash the whole process here so the API can still return errors
    stress_model = health_model = rul_model = eff_model = feature_cols = None

# ============================================
# HELPER: Human-friendly status labels
# ============================================

def get_stress_info(stress):
    info = {
        'Low'    : {"message": "Battery is healthy and operating normally.",
                    "color": "success", "icon": "[OK]"},
        'Medium' : {"message": "Battery showing signs of aging. Monitor closely.",
                    "color": "warning", "icon": "[!]"},
        'High'   : {"message": "Battery under HIGH stress. Service recommended!",
                    "color": "danger",  "icon": "[!!]"}
    }
    return info.get(stress, info['Low'])

def get_health_info(score):
    if score >= 85:
        return {"status": "Excellent",  "color": "success", "icon": "H"}
    elif score >= 70:
        return {"status": "Good",       "color": "primary", "icon": "G"}
    elif score >= 55:
        return {"status": "Fair",       "color": "warning", "icon": "F"}
    else:
        return {"status": "Poor",       "color": "danger",  "icon": "P"}

def get_rul_info(rul):
    if rul >= 100:
        return {"status": "Long life remaining",     "color": "success"}
    elif rul >= 50:
        return {"status": "Moderate life remaining", "color": "primary"}
    elif rul >= 20:
        return {"status": "Limited life remaining",  "color": "warning"}
    else:
        return {"status": "Replace soon!",           "color": "danger"}

def get_efficiency_info(score):
    if score >= 70:
        return {"status": "Highly efficient",     "color": "success"}
    elif score >= 40:
        return {"status": "Moderately efficient", "color": "primary"}
    elif score >= 20:
        return {"status": "Low efficiency",       "color": "warning"}
    else:
        return {"status": "Very low efficiency",  "color": "danger"}

# ============================================
# MAIN PREDICTION FUNCTION
# ============================================

def predict_battery_health(input_data: dict) -> dict:
    if stress_model is None:
        return {"success": False, "error": "ML Models not loaded. Please check backend/models/"}
    
    try:
        # Build input vector in correct feature order using numpy
        # This replaces the heavy Pandas DataFrame approach
        input_vector = np.array([[float(input_data.get(col, 0)) for col in feature_cols]])

        # Run all 4 models (they accept numpy arrays)
        stress     = stress_model.predict(input_vector)[0]
        health     = round(float(health_model.predict(input_vector)[0]), 2)
        rul        = max(0, int(round(float(rul_model.predict(input_vector)[0]))))
        efficiency = round(float(eff_model.predict(input_vector)[0]), 2)

        # Clamp values to valid ranges
        health     = max(0, min(100, health))
        efficiency = max(0, min(100, efficiency))

        return {
            "success"          : True,
            "stress_label"     : stress,
            "health_score"     : health,
            "RUL"              : rul,
            "efficiency_score" : efficiency,
            "stress_info"      : get_stress_info(stress),
            "health_info"      : get_health_info(health),
            "rul_info"         : get_rul_info(rul),
            "efficiency_info"  : get_efficiency_info(efficiency),
            "driver_summary"   : _get_driver_summary(stress, health, rul),
        }
    except Exception as e:
        return {"success": False, "error": f"Prediction failed: {str(e)}"}


def _get_driver_summary(stress, health, rul):
    if stress == 'High' or health < 60 or rul < 20:
        return {"title": "[!] Battery Needs Attention", "message": "Critical signs detected.", "color": "danger"}
    elif stress == 'Medium' or health < 80 or rul < 50:
        return {"title": "[?] Battery Aging Detected", "message": "Normal aging, monitor closely.", "color": "warning"}
    else:
        return {"title": "[OK] Battery is Healthy", "message": "Enjoy your ride!", "color": "success"}


# ============================================
# HISTORY DATA FOR CHARTS (Lightweight CSV)
# ============================================

def get_battery_history(battery_id: str = None) -> dict:
    try:
        if not os.path.exists(DATA_PATH):
            return {"success": False, "error": f"Data file missing at {DATA_PATH}"}
        
        # Lightweight CSV reading without Pandas
        with open(DATA_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            data = list(reader)

        batteries = sorted(list(set(row['battery_id'] for row in data)))

        if battery_id is None or battery_id not in batteries:
            battery_id = batteries[0]

        # Filter and sort
        batt_rows = [row for row in data if row['battery_id'] == battery_id]
        batt_rows.sort(key=lambda x: int(x['cycle_number']))

        return {
            "success"    : True,
            "battery_id" : battery_id,
            "batteries"  : batteries,
            "cycles"     : [int(r['cycle_number']) for r in batt_rows],
            "capacity"   : [round(float(r['capacity']), 3) for r in batt_rows],
            "health"     : [round(float(r['health_score']), 2) for r in batt_rows],
            "efficiency" : [round(float(r['efficiency_score']), 2) for r in batt_rows],
            "rul"        : [int(float(r['RUL'])) for r in batt_rows],
        }
    except Exception as e:
        return {"success": False, "error": f"History retrieval failed: {str(e)}"}
