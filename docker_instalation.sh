#!/usr/bin/bash

log "Checking Docker installation..."
if ! dpkg -l | grep -qw docker.io; then
    log "Installing Docker..."
    # Removing old Docker versions (if any)
    sudo apt-get remove docker docker-engine docker.io containerd runc

    # Setting up a Docker repository 
    sudo apt-get update sudo apt-get install ca-certificates curl gnupg lsb-release 

    # Adding the Official Docker GPG Key 
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg 

    # Configuring a stable repository 
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \  
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Installing Docker Engine
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # Adding the required users from the corresponding list to the 'docker' group
    for user in "${users[@]}"; do
      sudo usermod -aG docker $USER
    done

    sudo ufw default deny incoming 
    sudo ufw default allow outgoing 
    sudo ufw allow 22/tcp   # SSH 
    sudo ufw allow 80/tcp   # HTTP 
    sudo ufw allow 443/tcp  # HTTPS 
    sudo ufw enable

    # Docker Startup and Autostart
    sudo systemctl daemon-reload
    sudo systemctl restart docker
    sudo systemctl enable docker

    log "Docker installed and started successfully."
else
    log "Docker is already installed, skipping."
fi

log "Checking Docker Compose installation..."
if ! dpkg -l | grep -qw docker-compose; then
    log "Installing Docker Compose..."
    sudo apt install -y docker-compose | tee -a "$LOGFILE" || error_exit "Failed to install Docker Compose."
else
    log "Docker Compose is already installed, skipping."
fi