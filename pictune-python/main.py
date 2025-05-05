import os
from dotenv import load_dotenv
from app.api import create_app  # פונקציה שמייצרת את האפליקציה שלך

# טעינת משתני הסביבה מקובץ .env
load_dotenv()

# יצירת האפליקציה
app = create_app()

# אם אתה רוצה להחיל את האפליקציה על שרת (למשל uvicorn):
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
