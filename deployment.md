# 🚀 Deployment Guide: AI Resume Plus on Vercel

This guide outlines the steps to deploy both the Frontend and Backend of the AI Resume Plus application to Vercel.

## Prerequisites

- A [Vercel Account](https://vercel.com/).
- The project pushed to a GitHub repository.

## 1. Deploying the Backend

The backend is configured to run as a Serverless Function on Vercel.

1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import your GitHub Repository** (`ai-resume-plus`).
3.  **Configure Project**:
    *   **Project Name**: `ai-resume-plus-backend` (or similar).
    *   **Framework Preset**: Select **Other**.
    *   **Root Directory**: Click "Edit" and select `Backend`.
4.  **Environment Variables**:
    Add the following variables from your local `.env` file:
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `ACCESS_TOKEN_SECRET`: Your JWT access secret.
    *   `ACCESS_TOKEN_EXPIRY`: e.g., `1d`.
    *   `REFRESH_TOKEN_SECRET`: Your JWT refresh secret.
    *   `REFRESH_TOKEN_EXPIRY`: e.g., `10d`.
    *   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
    *   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
    *   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
    *   `ALLOWED_SITE`: The URL of your Frontend deployment (you can add this later after deploying the frontend).
5.  Click **Deploy**.

## 2. Deploying the Frontend

The frontend is a Vite React application.

1.  **Go to your Vercel Dashboard** and click **"Add New..."** -> **"Project"**.
2.  **Import the SAME GitHub Repository** (`ai-resume-plus`).
3.  **Configure Project**:
    *   **Project Name**: `ai-resume-plus-frontend` (or similar).
    *   **Framework Preset**: Vercel should automatically detect **Vite**.
    *   **Root Directory**: Click "Edit" and select `Frontend`.
4.  **Environment Variables**:
    Add the following variables:
    *   `VITE_APP_URL`: The URL of your deployed Backend (e.g., `https://ai-resume-plus-backend.vercel.app`).
    *   `VITE_GROQ_API_KEY`: Your Groq API Key.
    *   `VITE_OPENAI_API_KEY`: Your OpenAI API Key.
    *   `VITE_GEMENI_API_KEY`: Your Gemini API Key.
    *   `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk Key (if used).
    *   `VITE_STRAPI_API_KEY`: Your Strapi Key (if used).
5.  Click **Deploy**.

## 3. Final Configuration

1.  **Update Backend CORS**:
    *   Once the Frontend is deployed, copy its URL (e.g., `https://ai-resume-plus-frontend.vercel.app`).
    *   Go to your **Backend Project** in Vercel -> **Settings** -> **Environment Variables**.
    *   Add or Update the `ALLOWED_SITE` variable with the Frontend URL.
    *   **Redeploy** the Backend for the changes to take effect (go to Deployments -> Redeploy).

## Troubleshooting

-   **Backend 404s**: Ensure `vercel.json` in the Backend folder is correctly routing to `api/index.js`.
-   **Frontend 404s on Refresh**: Ensure `vercel.json` in the Frontend folder has the rewrite rule for SPA routing.
-   **CORS Errors**: Double-check that `ALLOWED_SITE` in the Backend environment variables matches your Frontend URL exactly (no trailing slash).
