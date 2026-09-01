import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import pickle
import os

# Define file paths
CSV_PATH = "Hospital Wait  TIme Data-selected-columns.csv"
MODEL_PATH = "model.pkl"

def create_synthetic_data(num_records=1000):
    """
    Generates realistic hospital queue data for the hackathon demo.
    """
    print("Generating synthetic hospital queue data...")
    np.random.seed(42)
    
    # 0 = Monday, 6 = Sunday
    days = np.random.randint(0, 7, num_records)
    
    # Hospital hours 8 AM to 8 PM (8 to 20)
    hours = np.random.randint(8, 20, num_records)
    
    # Crowd size ranges from 0 to 200
    crowds = np.random.randint(0, 200, num_records)
    
    # Calculate wait times based on patterns
    # Baseline wait time is roughly crowd_size / 3
    base_waits = crowds / 3.0
    
    wait_times = []
    for i in range(num_records):
        day = days[i]
        hour = hours[i]
        wait = base_waits[i]
        
        # Pattern 1: Mondays are 20% slower
        if day == 0:
            wait *= 1.2
            
        # Pattern 2: Peak hours (12 PM - 2 PM) are 30% slower
        if hour in [12, 13, 14]:
            wait *= 1.3
            
        # Add some random noise to make it realistic
        noise = np.random.uniform(-5, 5)
        wait = max(1, wait + noise) # Ensure wait is at least 1 min
        
        wait_times.append(round(wait))
        
    return pd.DataFrame({
        'day_of_week': days,
        'hour_of_day': hours,
        'current_crowd_size': crowds,
        'wait_time': wait_times
    })

def train():
    try:
        # We try to load the CSV first
        print(f"Checking for {CSV_PATH}...")
        df = pd.read_csv(CSV_PATH)
        
        # Check if the CSV actually has data and the required columns
        # Since the user's uploaded CSV was found to be empty/missing columns, we fallback
        if len(df) < 5 or 'wait_time' not in df.columns:
            print("CSV is empty or missing columns. Falling back to synthetic data for the demo.")
            df = create_synthetic_data()
    except Exception as e:
        print(f"Error loading CSV: {e}. Falling back to synthetic data.")
        df = create_synthetic_data()

    # Prepare features and target
    X = df[['day_of_week', 'hour_of_day', 'current_crowd_size']]
    y = df['wait_time']

    # Train a Random Forest Model (Simple, fast, robust)
    print("Training Random Forest Prediction Engine...")
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X, y)

    # Save the trained model to disk
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"Model successfully trained and saved to {MODEL_PATH}")

if __name__ == "__main__":
    train()
