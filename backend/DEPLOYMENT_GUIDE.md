# Docker Deployment Guide for Google Cloud VM

This guide will help you deploy your E-commerce backend application on a Google Cloud VM using Docker and Docker Compose.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Google Cloud VM Setup](#google-cloud-vm-setup)
3. [Install Docker and Docker Compose](#install-docker-and-docker-compose)
4. [Deploy Application](#deploy-application)
5. [SSL/HTTPS Setup](#ssl-https-setup)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Backup and Recovery](#backup-and-recovery)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Google Cloud account
- Domain name (optional but recommended for production)
- Basic knowledge of Linux command line
- Git installed locally

---

## Google Cloud VM Setup

### 1. Create a VM Instance

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **Compute Engine** → **VM Instances**
3. Click **Create Instance**

**Recommended configuration:**
- **Name:** ecommerce-backend
- **Region:** Choose closest to your users (e.g., us-central1, asia-southeast1)
- **Machine type:** 
  - Development: e2-medium (2 vCPU, 4 GB memory)
  - Production: e2-standard-2 (2 vCPU, 8 GB memory) or higher
- **Boot disk:**
  - OS: Ubuntu 22.04 LTS
  - Size: 30 GB (minimum), 50 GB recommended
- **Firewall:**
  - ✅ Allow HTTP traffic
  - ✅ Allow HTTPS traffic

### 2. Configure Firewall Rules

Create firewall rules for your application:

```bash
# Allow HTTP
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow HTTP traffic"

# Allow HTTPS
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow HTTPS traffic"

# Optional: Allow custom backend port (if not using nginx)
gcloud compute firewall-rules create allow-backend \
  --allow tcp:5001 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow backend API traffic"
```

### 3. Set Static IP Address (Recommended)

```bash
# Reserve a static IP
gcloud compute addresses create ecommerce-ip --region=us-central1

# Get the IP address
gcloud compute addresses describe ecommerce-ip --region=us-central1

# Attach to your VM
gcloud compute instances delete-access-config ecommerce-backend \
  --access-config-name="external-nat"

gcloud compute instances add-access-config ecommerce-backend \
  --access-config-name="external-nat" \
  --address=STATIC_IP_HERE
```

### 4. Connect to Your VM

```bash
gcloud compute ssh ecommerce-backend
```

Or use the **SSH in browser** option from the GCP Console.

---

## Install Docker and Docker Compose

### 1. Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Docker

```bash
# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Apply group changes (or logout and login again)
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

### 3. Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

---

## Deploy Application

### 1. Clone Your Repository

```bash
# Create app directory
cd ~
mkdir -p apps
cd apps

# Clone your repository (replace with your repo URL)
git clone https://github.com/yourusername/your-repo.git
cd your-repo/backend
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.docker .env

# Edit the environment file with secure values
nano .env
```

**Important:** Update these values in `.env`:

```bash
# Generate a strong JWT secret
JWT_SECRET=$(openssl rand -base64 64)

# Generate a strong MongoDB password
MONGO_PASSWORD=$(openssl rand -base64 32)

# Generate a strong Meilisearch master key
MEILI_MASTER_KEY=$(openssl rand -base64 32)

# Update these in your .env file
# Also update:
# - EMAIL_USER and EMAIL_PASS (your email credentials)
# - FRONTEND_URL (your actual domain)
# - NODE_ENV=production
```

### 3. Create Required Directories

```bash
# Create directories for persistent data
mkdir -p uploads
mkdir -p nginx/ssl
mkdir -p backups

# Set proper permissions
chmod 755 uploads
```

### 4. Build and Start Services

**For Development/Testing:**

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

**For Production:**

```bash
# Build and start with production configuration
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Verify Services

```bash
# Check running containers
docker ps

# Check service health
docker-compose ps

# Test API endpoint
curl http://localhost/api/home
```

### 6. Initialize Database (First Time Only)

```bash
# Access the backend container
docker exec -it ecommerce-backend-prod sh

# Run seed scripts
npm run seed:all

# Exit container
exit
```

### 7. Sync Meilisearch Index

```bash
# Sync products to Meilisearch
docker exec -it ecommerce-backend-prod npm run sync:meilisearch
```

---

## SSL/HTTPS Setup

### Option 1: Using Let's Encrypt (Recommended)

#### 1. Install Certbot

```bash
sudo apt install -y certbot
```

#### 2. Stop Nginx (if running)

```bash
docker-compose -f docker-compose.prod.yml stop nginx
```

#### 3. Obtain SSL Certificate

```bash
# Replace with your domain
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Follow the prompts
```

Certificates will be saved to `/etc/letsencrypt/live/yourdomain.com/`

#### 4. Copy Certificates to Project

```bash
# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/

# Set permissions
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 644 nginx/ssl/privkey.pem
```

#### 5. Update Nginx Configuration

Edit `nginx/nginx.conf` and uncomment the HTTPS server block. Update the domain name.

#### 6. Restart Services

```bash
docker-compose -f docker-compose.prod.yml up -d --force-recreate nginx
```

#### 7. Set Up Auto-Renewal

```bash
# Create renewal script
sudo nano /etc/cron.daily/certbot-renew

# Add this content:
#!/bin/bash
certbot renew --quiet --post-hook "cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /home/username/apps/your-repo/backend/nginx/ssl/ && cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /home/username/apps/your-repo/backend/nginx/ssl/ && docker-compose -f /home/username/apps/your-repo/backend/docker-compose.prod.yml restart nginx"

# Make executable
sudo chmod +x /etc/cron.daily/certbot-renew
```

### Option 2: Using Cloudflare (Alternative)

If you use Cloudflare for your domain, you can enable SSL/TLS there and use Flexible SSL mode. This is easier but less secure than Let's Encrypt.

---

## Monitoring and Maintenance

### 1. View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

### 2. Monitor Resource Usage

```bash
# Real-time stats
docker stats

# Disk usage
docker system df
```

### 3. Update Application

```bash
# Pull latest changes
git pull origin master

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Remove old images
docker image prune -f
```

### 4. Restart Services

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### 5. Stop/Start Services

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml stop

# Start all services
docker-compose -f docker-compose.prod.yml start

# Stop and remove containers
docker-compose -f docker-compose.prod.yml down

# Stop and remove everything (including volumes)
docker-compose -f docker-compose.prod.yml down -v
```

---

## Backup and Recovery

### 1. Backup MongoDB

```bash
# Create backup directory
mkdir -p ~/backups/mongodb

# Backup database
docker exec ecommerce-mongodb-prod mongodump \
  --username admin \
  --password YOUR_MONGO_PASSWORD \
  --authenticationDatabase admin \
  --out /backups/backup-$(date +%Y%m%d-%H%M%S)

# Copy backup from container
docker cp ecommerce-mongodb-prod:/backups ~/backups/mongodb/

# Compress backup
cd ~/backups/mongodb
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz backup-*
```

### 2. Automated Backup Script

Create a backup script:

```bash
nano ~/backup.sh
```

Add this content:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR=~/backups
MONGO_PASSWORD="YOUR_MONGO_PASSWORD"
DATE=$(date +%Y%m%d-%H%M%S)

# Create backup directories
mkdir -p $BACKUP_DIR/mongodb
mkdir -p $BACKUP_DIR/uploads

# Backup MongoDB
docker exec ecommerce-mongodb-prod mongodump \
  --username admin \
  --password $MONGO_PASSWORD \
  --authenticationDatabase admin \
  --out /backups/backup-$DATE

docker cp ecommerce-mongodb-prod:/backups/backup-$DATE $BACKUP_DIR/mongodb/
cd $BACKUP_DIR/mongodb && tar -czf backup-$DATE.tar.gz backup-$DATE
rm -rf $BACKUP_DIR/mongodb/backup-$DATE

# Backup Uploads
tar -czf $BACKUP_DIR/uploads/uploads-$DATE.tar.gz ~/apps/your-repo/backend/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR/mongodb -name "backup-*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR/uploads -name "uploads-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make it executable and schedule:

```bash
chmod +x ~/backup.sh

# Add to crontab (run daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /home/username/backup.sh >> /home/username/backup.log 2>&1
```

### 3. Restore from Backup

```bash
# Restore MongoDB
docker exec -i ecommerce-mongodb-prod mongorestore \
  --username admin \
  --password YOUR_MONGO_PASSWORD \
  --authenticationDatabase admin \
  --drop \
  /backups/backup-YYYYMMDD-HHMMSS

# Restore uploads
tar -xzf backups/uploads/uploads-YYYYMMDD-HHMMSS.tar.gz -C ~/apps/your-repo/backend/
```

---

## Troubleshooting

### 1. Check Service Status

```bash
# Check if services are running
docker-compose -f docker-compose.prod.yml ps

# Check logs for errors
docker-compose -f docker-compose.prod.yml logs backend
```

### 2. Container Won't Start

```bash
# Check container logs
docker logs ecommerce-backend-prod

# Check if ports are available
sudo netstat -tulpn | grep :5001
sudo netstat -tulpn | grep :27017

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### 3. Cannot Connect to MongoDB

```bash
# Check MongoDB logs
docker logs ecommerce-mongodb-prod

# Test connection from backend
docker exec -it ecommerce-backend-prod sh
mongosh "mongodb://admin:PASSWORD@mongodb:27017/ecommerce?authSource=admin"
```

### 4. Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a
docker volume prune

# Remove old logs
sudo find /var/lib/docker/containers/ -name "*.log" -delete
```

### 5. Memory Issues

```bash
# Check memory usage
free -h
docker stats

# Add swap space if needed
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 6. Permission Issues

```bash
# Fix uploads directory permissions
sudo chown -R 1001:1001 uploads
sudo chmod -R 755 uploads

# Fix nginx permissions
sudo chown -R root:root nginx
sudo chmod -R 755 nginx
```

### 7. API Not Accessible

```bash
# Check if nginx is running
docker-compose -f docker-compose.prod.yml ps nginx

# Check nginx logs
docker-compose -f docker-compose.prod.yml logs nginx

# Test backend directly
curl http://localhost:5001/api/home

# Check firewall
sudo ufw status
gcloud compute firewall-rules list
```

---

## Useful Commands

```bash
# Enter backend container
docker exec -it ecommerce-backend-prod sh

# Enter MongoDB container
docker exec -it ecommerce-mongodb-prod mongosh \
  -u admin -p PASSWORD --authenticationDatabase admin

# View environment variables
docker exec ecommerce-backend-prod printenv

# Check disk usage
docker system df

# Clean up unused resources
docker system prune -a

# Export/Import images
docker save -o backend.tar ecommerce-backend-prod
docker load -i backend.tar

# Copy files from container
docker cp ecommerce-backend-prod:/app/logs ./logs
```

---

## Security Best Practices

1. **Use strong passwords** for MongoDB and Meilisearch
2. **Keep secrets in `.env`** file, never commit to git
3. **Enable firewall** and only open required ports
4. **Use HTTPS** in production with valid SSL certificates
5. **Regular updates** - keep Docker, packages, and dependencies updated
6. **Monitor logs** for suspicious activity
7. **Regular backups** - automate daily backups
8. **Use non-root user** in containers (already configured)
9. **Limit container resources** to prevent DoS
10. **Use Docker secrets** for sensitive data in production

---

## Performance Optimization

1. **Use a CDN** for static assets (CloudFlare, AWS CloudFront)
2. **Enable Redis** for caching (add to docker-compose.yml)
3. **Optimize MongoDB** indexes and queries
4. **Use nginx caching** for API responses
5. **Monitor performance** with tools like Grafana + Prometheus
6. **Scale horizontally** by adding more backend instances
7. **Use SSD** storage for database volumes
8. **Optimize images** before upload (already implemented with Sharp)

---

## Support

For issues or questions:
- Check the logs first
- Review the troubleshooting section
- Consult Docker documentation
- Check your application logs

---

## License

This deployment guide is part of your E-commerce backend project.
