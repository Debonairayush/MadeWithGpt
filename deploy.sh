#!/bin/bash
# Quick deployment script for MapWithGPT

set -e  # Exit on any error

echo "🚀 Starting MapWithGPT deployment..."

# Configuration
PROJECT_DIR="/var/www/mapwithgpt"
DOMAIN="yourdomain.com"  # Change this to your domain

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root (use sudo)"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install system dependencies for Puppeteer
echo "📦 Installing system dependencies..."
apt-get install -y \
    ca-certificates fonts-liberation libappindicator3-1 libasound2 \
    libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 \
    libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
    libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    lsb-release wget xdg-utils

# Install global npm packages
echo "📦 Installing global npm packages..."
npm install -g pm2 serve

# Install nginx
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing nginx..."
    apt install -y nginx
fi

# Create project directory
echo "📁 Setting up project directory..."
mkdir -p $PROJECT_DIR
mkdir -p $PROJECT_DIR/logs

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd $PROJECT_DIR/Api
npm install --production

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies and building..."
cd $PROJECT_DIR/GPTMapper
npm install
npm run build

# Setup environment variables
echo "🔧 Setting up environment variables..."
cd $PROJECT_DIR/Api
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=production
EOF
    echo "⚠️  Please edit $PROJECT_DIR/Api/.env and add your OpenAI API key"
fi

# Setup PM2 ecosystem
echo "🔧 Setting up PM2 configuration..."
cd $PROJECT_DIR
cp ecosystem.config.js ecosystem.config.js.bak 2>/dev/null || true

# Start services with PM2
echo "🚀 Starting services with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u www-data --hp /var/www

# Setup nginx configuration
echo "🔧 Setting up nginx configuration..."
cp nginx.conf /etc/nginx/sites-available/mapwithgpt

# Update domain in nginx config
sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/mapwithgpt

# Enable site
ln -sf /etc/nginx/sites-available/mapwithgpt /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t
systemctl reload nginx

# Setup firewall
echo "🔒 Setting up firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443

# Setup backup script
echo "💾 Setting up backup script..."
cp backup.sh /usr/local/bin/backup-mapwithgpt.sh
chmod +x /usr/local/bin/backup-mapwithgpt.sh

# Add backup to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-mapwithgpt.sh") | crontab -

# Set proper permissions
echo "🔧 Setting proper permissions..."
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit $PROJECT_DIR/Api/.env and add your OpenAI API key"
echo "2. Update domain in /etc/nginx/sites-available/mapwithgpt if needed"
echo "3. Setup SSL with: sudo certbot --nginx -d $DOMAIN"
echo "4. Check service status: pm2 status"
echo "5. View logs: pm2 logs"
echo ""
echo "🌐 Your app should be running at:"
echo "   Frontend: http://$DOMAIN"
echo "   API: http://$DOMAIN/api/"
echo ""
echo "🔧 Useful commands:"
echo "   pm2 status          - Check service status"
echo "   pm2 logs            - View logs"
echo "   pm2 restart all     - Restart services"
echo "   sudo systemctl status nginx - Check nginx status"
