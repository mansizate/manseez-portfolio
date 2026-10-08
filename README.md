# Live chatbot setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Generate a Django `SECRET_KEY` as directed in that file and set it, then add your
   Gemini API key. Never commit `backend/.env`.
3. Optionally set `GEMINI_MODEL`; the default is `gemini-3.1-flash-lite`.
4. Start the API with `backend\venv\Scripts\python.exe backend\manage.py runserver`.
5. Start the Vite app with `npm run dev`.

By default, the frontend uses the deployed Render API. For local development, set
`VITE_API_URL=http://localhost:8000` in a local Vite environment file. Set `VITE_API_URL`
to the backend origin (without `/api/chat/`) when using a different backend. Keep
`GEMINI_API_KEY` only in the backend environment, never in Vite variables.
On Render, configure `SECRET_KEY`, `GEMINI_API_KEY`, and optionally `GEMINI_MODEL`;
keep the existing `DEBUG`, host, CORS, and CSRF origin settings on the backend.
