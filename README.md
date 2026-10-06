# Live chatbot setup

1. Copy `backend/.env.example` to `backend/.env` and add your Gemini API key.
2. Start the API with `backend\venv\Scripts\python.exe backend\manage.py runserver`.
3. Start the Vite app with `npm run dev`.

The chatbot uses Gemini 3.1 Flash Lite and Google Search grounding for current information.
