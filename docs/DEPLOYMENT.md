# Deployment Guide

## Backend Deployment (Render / Heroku)

1.  **Environment Variables**:
    Set the following in your cloud provider:
    - `NODE_ENV`: production
    - `MONGO_URI`: Your MongoDB connection string
    - `JWT_SECRET`: A strong secret key

2.  **Build Command**:
    The backend doesn't require a build step for Node.js, but ensure `npm install` runs.

3.  **Start Command**:
    `npm start`

## Frontend Deployment (Vercel / Netlify)

1.  **Build Command**:
    `npm run build`

2.  **Output Directory**:
    `dist`

3.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://my-api.onrender.com/api`)
    - You need to update `src/services/api.js` to use `import.meta.env.VITE_API_URL` instead of hardcoded localhost if you haven't already.

## Local Testing

1.  **Backend**:
    ```bash
    cd server
    npm start
    ```
    Runs on http://localhost:5000

2.  **Frontend**:
    ```bash
    cd client
    npm run dev
    ```
    Runs on http://localhost:5173
