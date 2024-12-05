#!/usr/bin/bash

# Before running the script, the following condition must be met for its correct operation:
# This script and the .env file with the necessary variable values ​​required for the correct launch and operation of the application must be located in the root folder of the user with root rights. 

# Define the list of users
users=("ubuntu" "alex")

# List of packages to check
packages=("curl" "git" "wget" "software-properties-common" "ufw")

# Store the current working directory in the variable CURRENTDIR
CURRENTDIR=$(pwd)

# Define the path to the log file
LOGFILE="/var/log/start_deploy_with_caddy.log"

# Clear the log file at the start of the script
> "$LOGFILE"

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

log "Checking required utilities installation..."
# Checking required utilities installation
for pkg in "${packages[@]}"; do
  if ! dpkg -l | grep -qw "$pkg"; then
    log "Package '$pkg' not found. Will be installed."
  else
    log "Package '$pkg' is already installed."
  fi
done

# Installing missing packages
if [[ "$(echo "${packages[@]}")" != "$(dpkg -l | grep -oP '^\w+' | grep -Fxq -f <(printf '%s\n' "${packages[@]}"))" ]]; then
  log "Installing the required utilities..."
  sudo apt install -y "${packages[@]}" | tee -a "$LOGFILE" || error_exit "Failed to install all required utilities."
fi

# Создание нового пользователя, если нужно
log "=== User Management ==="
sudo ./create_new_user.sh

# Проверка и установка Docker
log "=== Docker Management ==="
sudo .docker_instalation.sh

log "Cloning repository from GitHub..."
if [ ! -d "NestJS-backend" ]; then
    sudo mkdir NestJS-backend && cd NestJS-backend
    git clone https://github.com/Alex-LaNN/NestJS-backend.git | tee -a "$LOGFILE" || error_exit "Failed to clone repository."
else
    log "Repository 'NestJS-backend' already exists, skipping cloning."
    cd NestJS-backend || error_exit "Failed to change to project directory."
fi

# Move and rename .env file to project directory
log "Moving .env file to the project directory and renaming..."
if [ -f "$CURRENTDIR/.env" ]; then
    sudo mv $CURRENTDIR/.env .env.production | tee -a "$LOGFILE" || error_exit "Failed to move .env.production file to project directory."
else
    log "WARNING: .env not found in /home/ubuntu, skipping move. Check for .env.production file in project root."
fi

# Set permissions for .env.production
log "Setting permissions for .env.production..."
sudo chown ubuntu:ubuntu .env.production
sudo chmod 600 .env.production | tee -a "$LOGFILE" || error_exit "Failed to set permissions for .env.production."

log "Starting Docker Compose..."
sudo --preserve-env docker-compose --env-file .env.production -f docker-composeprod.caddy.yml up -d --build | tee -a "$LOGFILE" || error_exit "Failed to start Docker Compose."

log "Checking running containers..."
sudo docker ps | tee -a "$LOGFILE" || error_exit "Failed to check running containers."

log "=== Deployment completed ==="
