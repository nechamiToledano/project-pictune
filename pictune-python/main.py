import os
from dotenv import load_dotenv
import uvicorn
from app.api import create_app  # פונקציה שמייצרת את האפליקציה שלך

# טעינת משתני הסביבה מקובץ .env
load_dotenv()

# יצירת האפליקציה
app = create_app()

port = int(os.environ.get("PORT", 8000))
uvicorn.run(app, host="0.0.0.0", port=port)
