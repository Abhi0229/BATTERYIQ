import sys
import os

# Add the project root and backend directory to the path so internal imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend'))

from backend.app import app

# Vercel needs the 'app' variable to be available as the entry point
# We wrap the main logic here
if __name__ == "__main__":
    app.run()
