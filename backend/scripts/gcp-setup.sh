#!/bin/bash

# Google Cloud VM Initial Setup Script
# Run this script on your fresh GCP VM to set up everything

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   Google Cloud VM Setup for Docker${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Update system
echo -e "${GREEN}[1/7] Updating system packages...${NC}"
sudo apt update
sudo apt upgrade -y

# Install prerequisites
echo -e "${GREEN}[2/7] Installing prerequisites...${NC}"
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    vim \
    htop \
    ufw

# Install Docker
echo -e "${GREEN}[3/7] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo -e "${GREEN}Docker installed successfully!${NC}"
else
    echo -e "${YELLOW}Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${GREEN}[4/7] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose installed successfully!${NC}"
else
    echo -e "${YELLOW}Docker Compose already installed${NC}"
fi

# Configure firewall
echo -e "${GREEN}[5/7] Configuring firewall...${NC}"
sudo ufw --force enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
echo -e "${GREEN}Firewall configured!${NC}"

# Create app directory
echo -e "${GREEN}[6/7] Creating application directory...${NC}"
mkdir -p ~/apps
cd ~/apps

# Install monitoring tools
echo -e "${GREEN}[7/7] Installing monitoring tools...${NC}"
sudo apt install -y netdata
sudo systemctl start netdata
sudo systemctl enable netdata

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Next steps:"
echo "1. Log out and log back in for Docker group changes to take effect"
echo "2. Clone your repository: git clone YOUR_REPO_URL ~/apps/your-repo"
echo "3. Navigate to backend: cd ~/apps/your-repo/backend"
echo "4. Copy environment file: cp .env.docker .env"
echo "5. Edit .env with your configuration: nano .env"
echo "6. Deploy: ./scripts/deploy.sh deploy"
echo ""
echo "Installed versions:"
docker --version
docker-compose --version
echo ""
echo -e "${YELLOW}Important: Log out and log back in now!${NC}"
