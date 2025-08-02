# MapWithGPT - Server Deployment Guide

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **Server**: Linux (Ubuntu/CentOS recommended) or any VPS
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB free space

### Dependencies Installation (Ubuntu/Debian)
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install additional dependencies for Puppeteer
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx for reverse proxy
sudo apt install -y nginx

# Install certbot for SSL (optional)
sudo apt install -y certbot python3-certbot-nginx
```

## 🚀 Deployment Steps

### Step 1: Upload Project Files
```bash
# Create project directory
sudo mkdir -p /var/www/mapwithgpt
cd /var/www/mapwithgpt

# Upload your project files here
# You can use scp, git clone, or any file transfer method
git clone <your-repo-url> .
# OR
# scp -r ./MapWithGPT-main user@server:/var/www/mapwithgpt
```

### Step 2: Setup Backend API
```bash
# Navigate to API directory
cd /var/www/mapwithgpt/Api

# Install dependencies
npm install

# Install additional production dependencies
npm install --production

# Create environment file
cp .env.example .env
nano .env
```

**Configure .env file:**
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=production
```

### Step 3: Setup Frontend
```bash
# Navigate to frontend directory
cd /var/www/mapwithgpt/GPTMapper

# Install dependencies
npm install

# Build for production
npm run build
```

### Step 4: Setup PM2 Configuration
```bash
# Create PM2 ecosystem file
cd /var/www/mapwithgpt
```

Create the ecosystem.config.js file (see separate file).

### Step 5: Start Services with PM2
```bash
# Start both backend and frontend
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### Step 6: Configure Nginx Reverse Proxy
```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/mapwithgpt
```

Configure nginx (see separate file).

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/mapwithgpt /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 7: Setup SSL (Optional but Recommended)
```bash
# Get SSL certificate with Let's Encrypt
sudo certbot --nginx -d yourdomain.com

# Auto-renewal setup (usually automatic)
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Process Management Commands

### PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Stop services
pm2 stop all

# Delete services
pm2 delete all

# Monitor in real-time
pm2 monit
```

### Service Management
```bash
# Check nginx status
sudo systemctl status nginx

# Restart nginx
sudo systemctl restart nginx

# Check server resources
htop
df -h
free -h
```

## 🔒 Security Considerations

### Firewall Setup
```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### Additional Security
```bash
# Update packages regularly
sudo apt update && sudo apt upgrade

# Setup automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📊 Monitoring & Logs

### Log Locations
- **PM2 Logs**: `~/.pm2/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **System Logs**: `/var/log/syslog`

### Monitoring Commands
```bash
# Watch PM2 logs in real-time
pm2 logs --lines 100

# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep node
```

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest changes
cd /var/www/mapwithgpt
git pull origin main

# Update backend dependencies
cd Api
npm install

# Rebuild frontend
cd ../GPTMapper
npm install
npm run build

# Restart services
pm2 restart all
```

### Backup Strategy
```bash
# Create backup script
sudo nano /usr/local/bin/backup-mapwithgpt.sh

# Make executable
sudo chmod +x /usr/local/bin/backup-mapwithgpt.sh

# Add to crontab for daily backups
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-mapwithgpt.sh
```

## 🌐 Domain & DNS Setup

1. **Point your domain to server IP**:
   - A record: `yourdomain.com` → `your.server.ip`
   - A record: `www.yourdomain.com` → `your.server.ip`

2. **Update nginx configuration** with your domain name

3. **Get SSL certificate** using certbot

## 📞 Troubleshooting

### Common Issues
```bash
# If Puppeteer fails to start
sudo apt-get install -y chromium-browser
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# If port is already in use
sudo lsof -i :3000
sudo kill -9 <PID>

# If npm install fails
npm cache clean --force
rm -rf node_modules
npm install

# Check service status
pm2 status
sudo systemctl status nginx
```

### Performance Optimization
```bash
# Increase PM2 instances for better performance
pm2 scale api 2  # Run 2 instances of API

# Enable gzip compression in nginx
# Add to nginx config:
# gzip on;
# gzip_types text/plain application/json application/javascript text/css;
```

This guide provides a complete setup for running MapWithGPT on a production server with proper process management, security, and monitoring.
