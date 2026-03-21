# 🌿 AyurFlow — Setup & Run Guide

## 📁 Project Structure

```
ayurflow/
├── backend/
│   ├── app.py              ← Flask API server
│   └── requirements.txt    ← Python dependencies
├── frontend/
│   ├── index.html          ← Vite entry point
│   ├── vite.config.js      ← Vite + proxy config (connects to Flask)
│   ├── package.json        ← Node dependencies
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css       ← Tailwind v4
│       ├── App.css
│       └── components/
│           ├── AIConsultModal.jsx
│           ├── CartSidebar.jsx
│           ├── Cursor.jsx
│           ├── HerbCard.jsx
│           ├── HerbModal.jsx
│           └── Toolbar.jsx
└── README.md
```

---

## ⚙️ Prerequisites

- **Python 3.9+** → https://python.org
- **Node.js 18+** → https://nodejs.org

---

## 🚀 Step 1 — Start the Flask Backend

Open a terminal in the `backend/` folder:

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Set Gemini AI key for smart recommendations
# Mac/Linux:
export GEMINI_API_KEY="your_key_here"
# Windows CMD:
set GEMINI_API_KEY=your_key_here
# Windows PowerShell:
$env:GEMINI_API_KEY="your_key_here"

# Run the server
python app.py
```

✅ Backend will be running at **http://localhost:5000**

---

## 🚀 Step 2 — Start the React Frontend

Open a **second terminal** in the `frontend/` folder:

```bash
cd frontend

# Install Node dependencies
npm install

# Start the dev server
npm run dev
```

✅ Frontend will be running at **http://localhost:5173**

---

## 🌐 Open in Browser

Go to: **http://localhost:5173**

The Vite dev server automatically proxies all `/api/*` calls to Flask on port 5000 — no CORS issues, everything just works.

---

## 🔑 Gemini AI (Optional)

Without a Gemini API key, the AI Consult feature uses keyword matching (still works!).  
With a key, it uses Google's Gemini 1.5 Flash for smart Ayurvedic recommendations.

Get a free key at: https://aistudio.google.com/

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| `ModuleNotFoundError: flask` | Run `pip install -r requirements.txt` |
| `npm: command not found` | Install Node.js from nodejs.org |
| Blank page / "Failed to fetch" | Make sure Flask is running on port 5000 |
| Herbs not loading | Check internet connection (data from GitHub) |
| AI not working | Set `GEMINI_API_KEY` env var, restart Flask |

---

## 📦 Build for Production

```bash
cd frontend
npm run build
# Output is in frontend/dist/ — serve with any static host
```
