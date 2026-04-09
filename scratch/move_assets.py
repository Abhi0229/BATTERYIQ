import os
import shutil

# Paths
old_project = r'c:\Users\abhis\OneDrive\Desktop\BATTERYIQ'
new_project = r'c:\Users\abhis\OneDrive\Desktop\BATTERYIQMAIN'

def move_files():
    # Targets
    target_data = os.path.join(new_project, 'backend', 'data')
    target_models = os.path.join(new_project, 'backend', 'models')
    
    # Create dirs
    os.makedirs(target_data, exist_ok=True)
    os.makedirs(target_models, exist_ok=True)
    
    # Files to move
    # 1. CSV Data
    csv_file = 'master_df_final.csv'
    src_csv = os.path.join(old_project, 'data', csv_file)
    if os.path.exists(src_csv):
        shutil.copy2(src_csv, os.path.join(target_data, csv_file))
        print(f"Copied {csv_file}")
    
    # 2. Models
    models = ['eff_model.pkl', 'feature_cols.pkl', 'health_model.pkl', 'rul_model.pkl', 'stress_model.pkl']
    for m in models:
        src_m = os.path.join(old_project, 'models', m)
        if os.path.exists(src_m):
            shutil.copy2(src_m, os.path.join(target_models, m))
            print(f"Copied {m}")

if __name__ == "__main__":
    try:
        move_files()
        print("Done!")
    except Exception as e:
        print(f"Error: {e}")
