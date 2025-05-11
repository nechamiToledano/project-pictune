import os
from dotenv import load_dotenv
from app.api import create_app  # פונקציה שמייצרת את האפליקציה שלך

# טעינת משתני הסביבה מקובץ .env
load_dotenv()

# יצירת האפליקציה
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
