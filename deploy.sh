#!/usr/bin/bash

# Get the absolute path to the current directory
LOGDIR=$(pwd)

LOGFILE="$LOGDIR/deploy.log"

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

# Move .env.production file to project directory
log "Moving .env.production file to the project directory..."
if [ -f "/home/ubuntu/.env.production" ]; then
    mv /home/ubuntu/.env.production . | tee -a "$LOGFILE" || error_exit "Failed to move .env.production file to project directory."
else
    error_exit ".env.production not found in /home/ubuntu."
fi

# Set permissions for .env.production
log "Setting permissions for .env.production..."
sudo chmod 600 .env.production | tee -a "$LOGFILE" || error_exit "Failed to set permissions for .env.production."

log "Starting Docker Compose..."
sudo docker-compose up -d --build | tee -a "$LOGFILE" || error_exit "Failed to start Docker Compose."

log "Checking running containers..."
sudo docker ps | tee -a "$LOGFILE" || error_exit "Failed to check running containers."

log "=== Deployment completed successfully ==="