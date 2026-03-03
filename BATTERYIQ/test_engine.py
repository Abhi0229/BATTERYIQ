import pandas as pd
from core.battery_core_engine import analyze_battery

# Load engineered dataset
df = pd.read_csv("data/battery_iq_engineered_dataset.csv")

# Run analysis
result = analyze_battery(df)

print("=== Battery Engine Output ===")
print(result)