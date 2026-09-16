# Tokyo Mediator — Vercel Version

## Deploy on Vercel
1. Import this folder/repository into Vercel.
2. No build command is required.
3. Add Environment Variable:
   - `GEMINI_API_KEY` = your Gemini API key
   - Optional: `GEMINI_MODEL` = `gemini-2.5-flash-lite`
4. Deploy.

The AI endpoint is `/api/chat` and is implemented as a Vercel serverless function.

## Firebase
Enable Anonymous Authentication and Realtime Database, then publish `firebase-rules.json` as your Realtime Database rules.

Never put the Gemini API key in frontend files or commit it to GitHub.
