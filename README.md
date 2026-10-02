# Caviar Beauty Frontend

React and Vite storefront. This folder is self-contained and can be deployed as its own Vercel project.

## Local development

1. Install Node.js 22.12 or newer (the version used in CI).
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `VITE_API_URL` to the backend URL ending in `/api`. For local development, leave it unset; Vite proxies `/api` and `/uploads` to `http://localhost:4000`.
4. Run `npm run dev`.

Useful commands: `npm run build`, `npm run preview`, and `npm test`.

## Vercel

Create a Vercel project with this folder as its Root Directory. Set `VITE_API_URL` to the full deployed backend API URL (for example `https://your-backend.vercel.app/api`). Optional frontend variables are `VITE_GOOGLE_CLIENT_ID`, `VITE_RAZORPAY_KEY_ID`, `VITE_GA_MEASUREMENT_ID`, and `VITE_FRONTEND_URL`. Vite embeds these values during the build, so redeploy after changing them.

API requests use `VITE_API_URL` directly; the production deployment does not depend on a same-origin API rewrite. For reliable cookie-based login across hosting providers, use HTTPS custom domains under the same parent domain when possible. The backend must allow this site's exact origin in `FRONTEND_URL`.
