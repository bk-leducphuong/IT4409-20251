#!/bin/bash

# Deployment script for Google Cloud VM
# This script helps deploy or update the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   E-Commerce Backend Deployment Script${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker first"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    echo "Creating .env from .env.docker template..."
    if [ -f ".env.docker" ]; then
        cp .env.docker .env
        echo -e "${YELLOW}Please edit .env file with your configuration${NC}"
        exit 1
    else
        echo -e "${RED}Error: .env.docker template not found${NC}"
        exit 1
    fi
fi

# Function to check service health
check_health() {
    local service=$1
    local max_attempts=30
    local attempt=0
    
    echo -n "Waiting for $service to be healthy..."
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose -f $COMPOSE_FILE ps $service | grep -q "healthy"; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e " ${RED}✗${NC}"
    echo -e "${RED}Error: $service failed to start${NC}"
    return 1
}

# Parse command line arguments
ACTION=${1:-deploy}

case $ACTION in
    deploy)
        echo -e "${GREEN}Starting deployment...${NC}"
        echo ""
        
        # Pull latest changes (if in git repo)
        if [ -d ".git" ]; then
            echo "Pulling latest changes..."
            git pull origin master || echo -e "${YELLOW}Warning: Could not pull latest changes${NC}"
        fi
        
        # Build images
        echo "Building Docker images..."
        docker-compose -f $COMPOSE_FILE build
        
        # Start services
        echo "Starting services..."
        docker-compose -f $COMPOSE_FILE up -d
        
        # Check health
        echo ""
        check_health mongodb
        check_health meilisearch
        check_health backend
        
        echo ""
        echo -e "${GREEN}================================================${NC}"
        echo -e "${GREEN}   Deployment completed successfully!${NC}"
        echo -e "${GREEN}================================================${NC}"
        echo ""
        echo "Services status:"
        docker-compose -f $COMPOSE_FILE ps
        echo ""
        echo "View logs with: docker-compose -f $COMPOSE_FILE logs -f"
        ;;
        
    update)
        echo -e "${GREEN}Updating application...${NC}"
        echo ""
        
        # Pull latest changes
        if [ -d ".git" ]; then
            echo "Pulling latest changes..."
            git pull origin master
        fi
        
        # Rebuild and restart
        echo "Rebuilding images..."
        docker-compose -f $COMPOSE_FILE build backend
        
        echo "Restarting backend service..."
        docker-compose -f $COMPOSE_FILE up -d --no-deps backend
        
        echo ""
        echo -e "${GREEN}Update completed!${NC}"
        docker-compose -f $COMPOSE_FILE ps backend
        ;;
        
    restart)
        echo -e "${GREEN}Restarting services...${NC}"
        docker-compose -f $COMPOSE_FILE restart
        echo -e "${GREEN}Services restarted!${NC}"
        docker-compose -f $COMPOSE_FILE ps
        ;;
        
    stop)
        echo -e "${YELLOW}Stopping services...${NC}"
        docker-compose -f $COMPOSE_FILE stop
        echo -e "${GREEN}Services stopped!${NC}"
        ;;
        
    start)
        echo -e "${GREEN}Starting services...${NC}"
        docker-compose -f $COMPOSE_FILE start
        echo -e "${GREEN}Services started!${NC}"
        docker-compose -f $COMPOSE_FILE ps
        ;;
        
    logs)
        SERVICE=${2:-}
        if [ -z "$SERVICE" ]; then
            docker-compose -f $COMPOSE_FILE logs -f
        else
            docker-compose -f $COMPOSE_FILE logs -f $SERVICE
        fi
        ;;
        
    status)
        echo "Services status:"
        docker-compose -f $COMPOSE_FILE ps
        echo ""
        echo "Docker stats:"
        docker stats --no-stream
        ;;
        
    backup)
        echo -e "${GREEN}Creating backup...${NC}"
        BACKUP_DIR="backups/backup-$(date +%Y%m%d-%H%M%S)"
        mkdir -p $BACKUP_DIR
        
        # Backup MongoDB
        echo "Backing up MongoDB..."
        docker exec ecommerce-mongodb-prod mongodump \
            --username admin \
            --password "${MONGO_PASSWORD}" \
            --authenticationDatabase admin \
            --out /backups/mongodb
        
        docker cp ecommerce-mongodb-prod:/backups/mongodb $BACKUP_DIR/
        
        # Backup uploads
        echo "Backing up uploads..."
        cp -r uploads $BACKUP_DIR/
        
        echo -e "${GREEN}Backup completed: $BACKUP_DIR${NC}"
        ;;
        
    clean)
        echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
        docker-compose -f $COMPOSE_FILE down
        docker system prune -f
        echo -e "${GREEN}Cleanup completed!${NC}"
        ;;
        
    help|*)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy     - Deploy the application (default)"
        echo "  update     - Update and restart the backend service"
        echo "  restart    - Restart all services"
        echo "  stop       - Stop all services"
        echo "  start      - Start all services"
        echo "  logs       - View logs (optionally specify service name)"
        echo "  status     - Show services status"
        echo "  backup     - Create backup of database and uploads"
        echo "  clean      - Stop services and clean up Docker resources"
        echo "  help       - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 deploy"
        echo "  $0 logs backend"
        echo "  $0 update"
        ;;
esac
