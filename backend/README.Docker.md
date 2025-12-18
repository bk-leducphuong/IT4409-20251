# Docker Containerization for E-Commerce Backend

This document provides an overview of the Docker setup for deploying the E-commerce backend application on Google Cloud VM.

## 📋 Overview

The application is containerized using Docker with three main services:
- **Express Backend API** (Node.js)
- **MongoDB Database** (NoSQL)
- **Meilisearch** (Search Engine)
- **Nginx** (Reverse Proxy - Production only)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│            Google Cloud VM                  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │         Nginx (Port 80/443)          │  │
│  │         Reverse Proxy                │  │
│  └────────────┬─────────────────────────┘  │
│               │                             │
│  ┌────────────▼─────────────────────────┐  │
│  │    Express Backend (Port 5001)       │  │
│  │    - Node.js Application             │  │
│  │    - REST API                        │  │
│  │    - File Uploads                    │  │
│  └────┬──────────────────────┬──────────┘  │
│       │                      │              │
│  ┌────▼──────────┐    ┌──────▼─────────┐  │
│  │   MongoDB     │    │  Meilisearch   │  │
│  │   (Port 27017)│    │  (Port 7700)   │  │
│  │   Database    │    │  Search Engine │  │
│  └───────────────┘    └────────────────┘  │
│                                             │
│  Volumes: uploads, mongodb_data,           │
│           meilisearch_data                 │
└─────────────────────────────────────────────┘
```

## 📁 Docker Files

### Core Files

1. **`Dockerfile`** - Multi-stage build for Express backend
   - Optimized for production
   - Uses Alpine Linux (minimal size)
   - Non-root user for security
   - Health checks included

2. **`.dockerignore`** - Excludes unnecessary files from Docker builds
   - Reduces image size
   - Faster builds

3. **`docker-compose.yml`** - Development/General configuration
   - All services with default settings
   - Development-friendly
   - Hot-reload enabled

4. **`docker-compose.dev.yml`** - Local development
   - Source code mounting
   - Nodemon for auto-restart
   - Simple credentials

5. **`docker-compose.prod.yml`** - Production deployment
   - Includes Nginx
   - Logging configuration
   - Resource limits
   - Auto-restart policies

6. **`.env.docker`** - Environment template
   - All required variables
   - Example values
   - Security notes

### Configuration Files

7. **`nginx/nginx.conf`** - Nginx reverse proxy configuration
   - SSL/TLS ready
   - Rate limiting
   - Gzip compression
   - Security headers

### Scripts

8. **`scripts/deploy.sh`** - Deployment automation script
   - Deploy, update, restart commands
   - Health checks
   - Backup functionality

9. **`scripts/gcp-setup.sh`** - Initial VM setup
   - Install Docker & Docker Compose
   - Configure firewall
   - Set up monitoring

### Documentation

10. **`DEPLOYMENT_GUIDE.md`** - Complete deployment guide
    - Step-by-step instructions
    - GCP VM setup
    - SSL configuration
    - Troubleshooting

11. **`DOCKER_QUICK_START.md`** - Quick reference
    - Common commands
    - Quick operations

## 🚀 Quick Start

### Local Development

```bash
# Start services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Production Deployment on GCP

#### 1. Create GCP VM
```bash
gcloud compute instances create ecommerce-backend \
  --machine-type=e2-standard-2 \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=50GB \
  --tags=http-server,https-server
```

#### 2. Connect to VM
```bash
gcloud compute ssh ecommerce-backend
```

#### 3. Run Setup Script
```bash
# Download setup script
curl -O https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/master/backend/scripts/gcp-setup.sh

# Make executable
chmod +x gcp-setup.sh

# Run setup
./gcp-setup.sh

# Log out and back in
exit
```

#### 4. Clone and Configure
```bash
# SSH back in
gcloud compute ssh ecommerce-backend

# Clone repository
cd ~/apps
git clone YOUR_REPO_URL
cd YOUR_REPO/backend

# Configure environment
cp .env.docker .env
nano .env  # Edit with your values
```

#### 5. Deploy
```bash
# Using deploy script
./scripts/deploy.sh deploy

# Or manually
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Variables

Create `.env` file from `.env.docker` template:

```bash
# Essential variables
NODE_ENV=production
MONGODB_URI=mongodb://admin:password@mongodb:27017/ecommerce?authSource=admin
JWT_SECRET=your-super-secret-key-min-64-chars
MEILI_MASTER_KEY=your-meilisearch-key
FRONTEND_URL=https://yourdomain.com
```

### Generate Secure Keys

```bash
# JWT Secret (64+ characters recommended)
openssl rand -base64 64

# MongoDB Password
openssl rand -base64 32

# Meilisearch Master Key
openssl rand -base64 32
```

## 📊 Service Management

### View Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Restart Services
```bash
# All services
docker-compose -f docker-compose.prod.yml restart

# Single service
docker-compose -f docker-compose.prod.yml restart backend
```

### Update Application
```bash
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Features

### Implemented Security Measures

1. **Non-root Container User** - Backend runs as user 1001
2. **Environment Isolation** - Secrets in .env file
3. **Network Isolation** - Services in private network
4. **Resource Limits** - Prevent resource exhaustion
5. **Health Checks** - Monitor service health
6. **Nginx Rate Limiting** - Prevent DDoS
7. **Security Headers** - XSS, clickjacking protection
8. **MongoDB Authentication** - Username/password required
9. **Meilisearch API Key** - Master key protection
10. **SSL/TLS Ready** - HTTPS configuration included

### Security Best Practices

- ✅ Never commit `.env` file to git
- ✅ Use strong, unique passwords
- ✅ Enable firewall on VM
- ✅ Keep Docker and images updated
- ✅ Regular security audits
- ✅ Monitor logs for suspicious activity
- ✅ Enable SSL/HTTPS in production
- ✅ Regular backups

## 🔍 Monitoring

### View Resource Usage
```bash
docker stats
```

### Check Disk Usage
```bash
docker system df
```

### Service Health
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Application Logs
```bash
# Real-time logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

## 💾 Backup

### Manual Backup
```bash
./scripts/deploy.sh backup
```

### Automated Backup
See `DEPLOYMENT_GUIDE.md` for cron job setup

### Backup Includes
- MongoDB database
- Uploaded files
- Configuration files

## 🐛 Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   docker logs CONTAINER_NAME
   docker-compose -f docker-compose.prod.yml restart
   ```

2. **Port already in use**
   ```bash
   sudo lsof -i :5001
   # Kill process or change port in .env
   ```

3. **Out of disk space**
   ```bash
   docker system prune -a
   ```

4. **Cannot connect to MongoDB**
   ```bash
   docker logs ecommerce-mongodb-prod
   # Check credentials in .env
   ```

## 📚 Additional Resources

- **Full Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Quick Reference**: `DOCKER_QUICK_START.md`
- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Google Cloud**: https://cloud.google.com/compute/docs

## 🆘 Support

If you encounter issues:

1. Check service logs: `docker-compose logs SERVICE_NAME`
2. Verify environment variables in `.env`
3. Check firewall rules on GCP
4. Review `DEPLOYMENT_GUIDE.md` troubleshooting section
5. Ensure all services are healthy: `docker-compose ps`

## 📝 Notes

- All sensitive data is stored in `.env` (git-ignored)
- Uploads directory is persistent via Docker volumes
- MongoDB data persists across container restarts
- Meilisearch data persists across container restarts
- Nginx handles SSL termination in production

## 🎯 Production Checklist

Before going to production:

- [ ] Update all passwords and secrets in `.env`
- [ ] Configure domain DNS to point to VM IP
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Enable monitoring and alerts
- [ ] Test all API endpoints
- [ ] Configure email service (SMTP)
- [ ] Set up log rotation
- [ ] Document recovery procedures

---

**Happy Deploying! 🚀**
