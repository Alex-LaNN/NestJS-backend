#!/usr/bin/bash

LOGFILE="deploy.log"

log() {
echo "$(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "$LOGFILE"
}

error_exit() {
log "ERROR: $1"
# You can add a command to send a notification, for example:
# echo "Deployment failed: $1" | mail -s "Deployment Error" your-email@example.com
exit 1
}

log "=== Starting deployment process ==="

log "Updating package list..."
sudo apt update && sudo apt upgrade -y | tee -a "$LOGFILE" || error_exit "Unable to update system."

log "Installing Git..."
sudo apt install -y git | tee -a "$LOGFILE" || error_exit "Failed to install Git."

log "Installing Docker..."
sudo apt install -y docker.io | tee -a "$LOGFILE" || error_exit "Failed to install Docker."

log "Starting Docker..."
sudo systemctl start docker | tee -a "$LOGFILE" || error_exit "Failed to start Docker."
sudo systemctl enable docker | tee -a "$LOGFILE" || error_exit "Failed to enable Docker on system startup."

log "Installing Docker Compose..."
sudo apt install -y docker-compose | tee -a "$LOGFILE" || error_exit "Failed to install Docker Compose."

log "Cloning repository from GitHub..."
git clone https://github.com/Alex-LaNN/NestJS-backend.git | tee -a "$LOGFILE" || error_exit "Failed to clone repository."

log "Changing to project directory..."
cd NestJS-backend || error_exit "Failed to change to project directory."

log "Starting Docker Compose..."
sudo docker-compose up -d --build | tee -a "$LOGFILE" || error_exit "Failed to start Docker Compose."

log "Checking running containers..."
sudo docker ps | tee -a "$LOGFILE" || error_exit "Failed to check running containers."

log "=== Deployment completed successfully ==="