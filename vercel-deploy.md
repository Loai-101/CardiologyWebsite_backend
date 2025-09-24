# Vercel Deployment Instructions

## Environment Variables Required

Add these environment variables in your Vercel dashboard:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your backend project: `cardiology-website-backend`

### 2. Add Environment Variables
Go to: **Settings** → **Environment Variables**

Add these variables:

```
MONGODB_URI = mongodb+srv://pmi_it:Loai-66343439@cluster0.e0rjr.mongodb.net/cardiology_hospital?retryWrites=true&w=majority
JWT_SECRET = your-super-secret-jwt-key-for-cardiology-hospital-2024
NODE_ENV = production
FRONTEND_URL = https://cardiology-website-frontend.vercel.app
```

### 3. Redeploy
After adding environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic redeploy

## Testing the Deployment

After redeployment, test these endpoints:
- https://cardiology-website-backend-cf1i.vercel.app/
- https://cardiology-website-backend-cf1i.vercel.app/api/offers
- https://cardiology-website-backend-cf1i.vercel.app/api/slider

## Troubleshooting

If you still get CORS errors:
1. Verify all environment variables are set correctly
2. Check that the deployment completed successfully
3. Wait a few minutes for the deployment to fully propagate
4. Clear your browser cache and try again
