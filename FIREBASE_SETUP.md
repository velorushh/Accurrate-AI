# Accurrate AI — Firebase Auth Setup

## Step 1: Create a Firebase project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Create a project"**
3. Name it `accurrate-ai` → click Continue
4. Disable Google Analytics (not needed) → click **Create project**

---

## Step 2: Register your web app

1. In the project dashboard, click the **</>** (Web) icon
2. App nickname: `accurrate-ai-web` → click **Register app**
3. You'll see a config block like this — **copy it**:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "accurrate-ai.firebaseapp.com",
  projectId: "accurrate-ai",
  storageBucket: "accurrate-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

4. Paste your values into `src/firebase.js` (replacing the PASTE_YOUR_... placeholders)

---

## Step 3: Enable Google Sign-In

1. In Firebase Console sidebar → **Authentication** → **Get started**
2. Click **Sign-in method** tab
3. Click **Google** → toggle **Enable** → set support email → **Save**

---

## Step 4: Enable Microsoft Sign-In

1. In the same Sign-in method tab, click **Microsoft**
2. Toggle **Enable**
3. You'll need an **Azure App**:
   - Go to https://portal.azure.com/ → **Azure Active Directory** → **App registrations** → **New registration**
   - Name: `Accurrate AI` | Supported account types: **Multitenant** | Redirect URI: leave blank for now → **Register**
   - Copy the **Application (client) ID**
   - Go to **Certificates & secrets** → **New client secret** → copy the **Value**
4. Paste those into Firebase Console Microsoft provider → **Save**
5. Copy the **OAuth redirect URI** that Firebase shows you
6. Go back to Azure → your app → **Authentication** → **Add a platform** → **Web** → paste the Firebase redirect URI → **Save**

---

## Step 5: Add your domain to authorized origins

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add `localhost` (already there) and your production domain when ready

---

## Step 6: Add your Firebase config to the project

Open `src/firebase.js` and replace all `PASTE_YOUR_...` values with your real config.
