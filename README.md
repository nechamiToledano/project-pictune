# PicTune

**PicTune** is a full-stack music web application that allows users to upload songs, transcribe them using AI, generate lyric-based clips, manage playlists, and more. It includes both a user-facing and an admin interface, with a distributed architecture using .NET, Python, React, and Angular.

---

## 🎯 Features

### 🎵 User Features (React Frontend)

* Sign up / Login (JWT Auth)
* Upload MP3s to S3
* Transcribe songs using AI (AssemblyAI)
* Auto-generate playlists by song mood, topic, etc.
* Create and edit video clips with synced lyrics and images
* Play songs with a built-in audio player

### 🛠 Admin Panel (Angular 19)

* Manage users, playlists, and songs
* View system stats and logs (charts via ngx-charts)
* Full CRUD for all entities

### 🔙 Backend API (.NET 8)

* Auth, user, and playlist management
* Serves media URLs, handles S3, DB
* Connected to the React app via REST

### 🤖 AI Services (Python + FastAPI)

* Audio transcription with AssemblyAI
* Smart playlist generation (topic / genre clustering)
* MoviePy-based video generation with synced lyrics

---

## 🧱 Project Structure

```
project-pictune
├── pictune-app         # Angular 19 admin panel
├── pictune-python      # FastAPI microservice for AI + video generation
├── pictune-server      # .NET 8 Web API
├── pictune             # React 18 frontend for end-users
├── render.yaml         # Deployment config (Render)
└── README.md           # You are here
```

---

## 🚀 Getting Started (Dev)

### Prerequisites

* Node.js + Angular CLI (for pictune-app)
* Python 3.10+ (for pictune-python)
* .NET 8 SDK (for pictune-server)

### Run Angular Admin (Admin Panel)

```bash
cd pictune-app
npm install
npm start
```

### Run React Frontend (User App)

```bash
cd pictune
npm install
npm start
```

### Run .NET API Server

```bash
cd pictune-server
# optional: update appsettings.json
dotnet run
```

### Run Python AI Service

```bash
cd pictune-python
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📦 Tech Stack

| Area             | Technology                           |
| ---------------- | ------------------------------------ |
| Frontend (User)  | React 18, Redux                      |
| Frontend (Admin) | Angular 19, NgRx                     |
| Backend API      | ASP.NET Core 8                       |
| AI & Media       | Python, FastAPI, MoviePy, AssemblyAI, OpenAI API|
| DB + Cloud       | Amazon S3, MySQL                |

---


## 📮 Contact

Made with by Nechama Toledano
[GitHub](https://github.com/nechamiToledano)
