# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://pmi_it:Loai-66343439@cluster0.e0rjr.mongodb.net/cardiology_hospital?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-for-cardiology-hospital-2024

# Environment
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## For Vercel Deployment

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable:

### Production Environment Variables:
- `MONGODB_URI` = `mongodb+srv://pmi_it:Loai-66343439@cluster0.e0rjr.mongodb.net/cardiology_hospital?retryWrites=true&w=majority`
- `JWT_SECRET` = `your-super-secret-jwt-key-for-cardiology-hospital-2024`
- `NODE_ENV` = `production`
- `FRONTEND_URL` = `https://cardiology-website-frontend.vercel.app`

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique JWT secrets in production
- Keep MongoDB credentials secure
- The `.env` file is already in `.gitignore`
