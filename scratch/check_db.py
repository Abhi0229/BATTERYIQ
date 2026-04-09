import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# Try both paths just in case
possible_paths = [
    'sqlite:///instance/batteryiq.db',
    'sqlite:///batteryiq.db',
    'sqlite:///../instance/batteryiq.db'
]

for p in possible_paths:
    print(f"Checking {p}...")
    app.config['SQLALCHEMY_DATABASE_URI'] = p
    db = SQLAlchemy(app)
    try:
        with app.app_context():
            # Check if User table exists
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"Tables in {p}: {tables}")
            if 'user' in tables:
                print("Found 'user' table!")
                break
    except Exception as e:
        print(f"Error checking {p}: {e}")
