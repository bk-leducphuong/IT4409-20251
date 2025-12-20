# Docker Quick Start Guide

This is a quick reference for common Docker operations with your E-commerce backend.

## 🚀 Quick Commands

### Local Development

```bash
# Start all services (development mode with hot-reload)
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop services
docker compose -f docker-compose.dev.yml down
```

### Production Deployment

```bash
# First time setup
cp .env.docker .env
# Edit .env with your configuration
nano .env

# Deploy using the script
chmod +x scripts/deploy.sh
./scripts/deploy.sh deploy

# Or manually
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## 📦 Service Management

### Check Status

```bash
# View running containers
docker ps

# View service status
docker-compose -f docker-compose.prod.yml ps

# View resource usage
docker stats
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f mongodb
docker-compose -f docker-compose.prod.yml logs -f meilisearch

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

### Restart Services

```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

## 🔧 Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Or use the script
./scripts/deploy.sh update
```

### Database Operations

```bash
# Access MongoDB shell
docker exec -it ecommerce-mongodb-prod mongosh \
  -u admin -p YOUR_PASSWORD --authenticationDatabase admin

# Run seed scripts
docker exec -it ecommerce-backend-prod npm run seed:all

# Sync Meilisearch
docker exec -it ecommerce-backend-prod npm run sync:meilisearch
```

### Backup

```bash
# Manual backup
./scripts/deploy.sh backup

# Or manually backup MongoDB
docker exec ecommerce-mongodb-prod mongodump \
  --username admin \
  --password YOUR_PASSWORD \
  --authenticationDatabase admin \
  --out /backups/backup-$(date +%Y%m%d)
```

### Clean Up

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Clean everything
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker logs ecommerce-backend-prod

# Check if port is in use
sudo lsof -i :5001

# Restart service
docker-compose -f docker-compose.prod.yml restart backend
```

### Cannot connect to MongoDB

```bash
# Check MongoDB logs
docker logs ecommerce-mongodb-prod

# Verify connection from backend
docker exec -it ecommerce-backend-prod sh
# Inside container:
mongosh "mongodb://admin:PASSWORD@mongodb:27017/ecommerce?authSource=admin"
```

### Out of disk space

```bash
# Check disk usage
df -h
docker system df

# Clean up
docker system prune -a
docker volume prune
```

## 🌐 Access Services

- **API:** http://your-vm-ip/api/home
- **API Docs:** http://your-vm-ip/api-docs
- **MongoDB:** mongodb://admin:password@your-vm-ip:27017/ecommerce
- **Meilisearch:** http://your-vm-ip:7700

## 📝 Environment Variables

Key variables to set in `.env`:

```bash
NODE_ENV=production
MONGODB_URI=mongodb://admin:password@mongodb:27017/ecommerce?authSource=admin
JWT_SECRET=your-super-secret-key
MEILI_MASTER_KEY=your-meilisearch-key
FRONTEND_URL=https://yourdomain.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔒 Security Checklist

- [ ] Change default passwords in `.env`
- [ ] Use strong JWT_SECRET (64+ characters)
- [ ] Configure firewall rules
- [ ] Set up SSL/HTTPS
- [ ] Enable MongoDB authentication
- [ ] Secure Meilisearch with master key
- [ ] Regular backups automated
- [ ] Monitor logs for suspicious activity

## 📚 Additional Resources

- Full deployment guide: `DEPLOYMENT_GUIDE.md`
- Docker documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Google Cloud: https://cloud.google.com/docs
