# 🚀 Deployment Guide for MindCare

Deploying a full-stack MERN (MongoDB, Express, React, Node) application involves two main parts: the **Backend (Server)** and the **Frontend (Web App)**.

## 1. Prerequisites 📋
1. Your project is pushed to GitHub.
2. You have a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.
3. You have a [Groq API Key](https://console.groq.com/keys).

---

## 2. Deploying the Backend (API Server) 🌐
We recommend using **Render** for a free and simple Node.js deployment.

1.  **Sign in to [Render.com](https://render.com/)** and link your GitHub account.
2.  **Create a New Web Service**:
    *   Select your `MindCare` repository.
    *   **Root Directory**: Set this to `server`.
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
3.  **Environment Variables**:
    *   Go to the "Environment" tab in Render and add:
        *   `MONGODB_URI`: Your full MongoDB connection string.
        *   `JWT_SECRET`: A strong random string for security.
4.  **Wait for Deployment**: Render will give you a URL like `https://mindcare-backend.onrender.com`. Copy this!

---

## 3. Deploying the Frontend (React App) 💻
We recommend **Vercel** or **Netlify** for the frontend.

1.  **Sign in to [Vercel.com](https://vercel.com/)** and link your GitHub account.
2.  **Create a New Project**:
    *   Select your `MindCare` repository.
    *   **Root Directory**: Set this to `./` (the default).
    *   **Framework Preset**: Vite (should be detected automatically).
3.  **Environment Variables**:
    *   Add your frontend variables:
        *   `VITE_GROQ_API_KEY`: Your Groq API key.
        *   `VITE_API_URL`: **IMPORTANT** - Paste the URL you copied from Render here (e.g., `https://mindcare-backend.onrender.com`).
4.  **Deploy**: Click deploy and your app will be live!

---

## 4. Final Security Check 🔐

### MongoDB IP Whitelisting
In your MongoDB Atlas dashboard:
1. Go to **Network Access**.
2. Click **Add IP Address**.
3. Select **Allow Access from Anywhere** (IP `0.0.0.0/0`) since Render's IP addresses change frequently.

### Environment Variable Update
Ensure you never push your `.env` files to GitHub. I have already updated your `.gitignore` to keep them safe.

---
**Congratulations! Your MindCare platform is now live and accessible to the world! 🎉**
