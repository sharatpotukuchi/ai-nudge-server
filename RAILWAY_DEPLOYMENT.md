# Railway Deployment Guide

## Quick Deploy to Railway

### Option 1: Railway CLI (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Deploy from dev folder:**
   ```bash
   cd /Users/appleapple/Documents/exp-qualtrics/dev
   railway init
   railway up
   ```

4. **Set environment variable:**
   ```bash
   railway variables set OPENAI_API_KEY="your-openai-api-key-here"
   ```

5. **Get the public URL:**
   ```bash
   railway domain
   ```

### Option 2: Railway Web Dashboard

1. **Go to:** https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Connect your repository** (you'll need to push to GitHub first)
5. **Set environment variable:** `OPENAI_API_KEY`
6. **Deploy**

### Option 3: Direct Upload

1. **Go to:** https://railway.app
2. **Create New Project** → "Empty Project"
3. **Upload the `dev/` folder** as a ZIP file
4. **Set environment variable:** `OPENAI_API_KEY`
5. **Deploy**

## After Deployment

1. **Get your public URL** (e.g., `https://your-app-name.railway.app`)
2. **Update Qualtrics ED field:**
   - `ai_nudge_endpoint`: `https://your-app-name.railway.app/nudge`
3. **Test the endpoint:**
   ```bash
   curl https://your-app-name.railway.app/health
   ```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (already set)
- `PORT`: Automatically set by Railway

## Monitoring

- **Logs:** Available in Railway dashboard
- **Health check:** `https://your-app-name.railway.app/health`
- **Metrics:** CPU, Memory usage in dashboard

## Troubleshooting

- **Build fails:** Check `package.json` and dependencies
- **Runtime errors:** Check logs in Railway dashboard
- **CORS issues:** Already configured for all origins
- **API key issues:** Verify environment variable is set correctly
