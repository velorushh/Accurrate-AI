# ACCURRATE AI — Deployment Guide

This guide covers deploying the **FastAPI Backend on Render** and the **React (Vite) Frontend on Vercel**.

---

## Part 1: Deploy Backend to Render (Free Web Service)

1. Go to [render.com](https://render.com) and log in (or sign up with your GitHub account).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your repository: **`velorushh/Accurrate-AI`**.
4. Configure the Web Service settings:
   - **Name**: `accurrate-api` (or your choice)
   - **Region**: Oregon (US West) or closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Click **Advanced** $\rightarrow$ **Add Environment Variable**:
   - `GEMINI_API_KEY`: *(Your Google Gemini API key)*
   - `PORT`: `10000` *(Render sets this automatically, but you can set it if prompted)*
6. Click **Create Web Service**.
7. Once deployed, Render will provide a public URL like:
   `https://accurrate-api.onrender.com`
   *(You can verify it by opening `https://accurrate-api.onrender.com/health` in your browser to see `{"status": "healthy"}`)*.

---

## Part 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import the repository: **`velorushh/Accurrate-AI`**.
4. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://your-backend.onrender.com` | URL of your deployed Render backend |
   | `VITE_FIREBASE_API_KEY` | `AIzaSyCKA00Q1gnYN6EvNYrCNJDUAL4zFZir_LE` | Firebase Web API Key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `accurrate-ai.firebaseapp.com` | Firebase Auth Domain |
   | `VITE_FIREBASE_PROJECT_ID` | `accurrate-ai` | Firebase Project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `accurrate-ai.firebasestorage.app` | Firebase Storage Bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `873938502600` | Firebase Messaging Sender ID |
   | `VITE_FIREBASE_APP_ID` | `1:873938502600:web:e1ba27dfe4149ef1aaf6fd` | Firebase App ID |
   | `VITE_FIREBASE_MEASUREMENT_ID` | `G-JGL3EERS0V` | Firebase Analytics Measurement ID |

6. Click **Deploy**.
7. In ~30–60 seconds, your site will be live on a `*.vercel.app` domain.

---

## Part 3: Firebase Auth Authorized Domains (Crucial Step)

For Google / Microsoft OAuth and Email sign-ins to work on your live Vercel domain:

1. Open the [Firebase Console](https://console.firebase.google.com).
2. Select your project: **`accurrate-ai`**.
3. Navigate to **Authentication** $\rightarrow$ **Settings** $\rightarrow$ **Authorized domains**.
4. Click **Add domain**.
5. Enter your Vercel domain (e.g. `your-app-name.vercel.app`).
6. Click **Done**.
