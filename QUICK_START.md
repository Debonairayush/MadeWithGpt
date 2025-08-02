# MapWithGPT - Quick Start Guide

## 🚀 Quick Deployment (Ubuntu/Debian)

### Method 1: Automated Deployment Script
```bash
# 1. Upload project files to your server
scp -r ./MapWithGPT-main root@your-server-ip:/var/www/mapwithgpt

# 2. SSH into your server
ssh root@your-server-ip

# 3. Run the automated deployment script
cd /var/www/mapwithgpt
chmod +x deploy.sh
./deploy.sh

# 4. Add your OpenAI API key
nano /var/www/mapwithgpt/Api/.env
# Replace: OPENAI_API_KEY=your_openai_api_key_here

# 5. Restart services
pm2 restart all

# 6. Setup SSL (replace yourdomain.com with your domain)
certbot --nginx -d yourdomain.com
```

### Method 2: Manual Deployment
Follow the detailed steps in `DEPLOYMENT_GUIDE.md`

## 🔧 Essential Commands

```bash
# Check service status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Check nginx status
sudo systemctl status nginx

# Update application
cd /var/www/mapwithgpt
git pull origin main
cd Api && npm install
cd ../GPTMapper && npm install && npm run build
pm2 restart all
```

## 🌐 Access Your Application

- **Frontend**: https://yourdomain.com
- **API**: https://yourdomain.com/api/getRoadmap?topic=javascript

## 📞 Support

If you encounter issues:
1. Check logs: `pm2 logs`
2. Check nginx: `sudo nginx -t`
3. Check services: `pm2 status`
4. Check firewall: `sudo ufw status`

## 🔐 Environment Variables

Make sure to set your OpenAI API key in `/var/www/mapwithgpt/Api/.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
```
