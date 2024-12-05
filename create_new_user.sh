#!/usr/bin/bash

# Script for adding a new user to the system
# Supports creating an SSH directory, adding to sudo, setting a password.
# Requires execution as superuser.

# Лог-файл для записи действий скрипта
LOGFILE="/var/log/user_addition.log"

# Store the current working directory in the variable CURRENTDIR
CURRENTDIR=$(pwd)

# Функция логирования
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') [INFO]: $1" | tee -a "$LOGFILE"
}

# Функция для завершения скрипта с сообщением об ошибке
error_exit() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') [ERROR]: $1" | tee -a "$LOGFILE"
    exit 1
}

# Проверка доступности необходимых команд
check_required_commands() {
    for cmd in useradd chown chmod chpasswd; do
        if ! command -v "$cmd" &>/dev/null; then
            error_exit "Command '$cmd' is not available. Please install it."
        fi
    done
}

# Проверка на существование пользователя
check_user_exists() {
    if id "$1" &>/dev/null; then
        return 0  # Пользователь существует
    else
        return 1  # Пользователь не существует
    fi
}

# Чистка в случае ошибок
cleanup_user() {
    if check_user_exists "$new_username"; then
        sudo userdel -r "$new_username" &>/dev/null
        log "User '$new_username' has been cleaned up after an error."
    fi
}

# Установка ловушки на случай ошибки
trap cleanup_user ERR

# Проверка существования группы sudo
check_sudo_group() {
    if ! grep -q '^sudo:' /etc/group; then
        error_exit "Group 'sudo' does not exist on this system."
    fi
}

# Проверка существования файла authorized_keys
check_authorized_keys_file() {
    if [[ ! -f "$CURRENTDIR/.ssh/authorized_keys" ]]; then
        error_exit "File 'authorized_keys' not found in $CURRENTDIR/.ssh."
    fi
}

# Проверка необходимых команд и ресурсов
check_required_commands
check_sudo_group
check_authorized_keys_file

# Запрос на добавление нового пользователя
read -p "Do you want to add a new user to the server? Enter 'y' to confirm: " add_user

if [[ "$add_user" != "y" ]]; then
    log "User addition cancelled by user."
    exit 0
fi

# Получение и проверка имени пользователя
while true; do
    read -p "Enter username for the new user: " new_username

    if [[ -z "$new_username" ]]; then
        error_exit "Username cannot be empty."
    fi

    if [[ ! "$new_username" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        error_exit "Invalid username. Only alphanumeric characters, hyphens, and underscores are allowed."
    fi

    if check_user_exists "$new_username"; then
        read -p "User '$new_username' already exists. Do you want to choose a different username? (y/n): " retry
        if [[ "$retry" != "y" ]]; then
            log "User addition cancelled."
            exit 0
        fi
    else
        break
    fi
done

# Получение пароля
while true; do
    read -sp "Enter password for the new user (characters won't be shown): " new_password
    echo

    if [[ ${#new_password} -lt 8 ]]; then
        log "Password must be at least 8 characters long. Please try again."
    else
        break
    fi
done

# Запрос на добавление в sudo-группу
read -p "Add user to 'sudo' group? Enter 'y' to confirm: " add_to_sudo
add_to_sudo=$([[ "$add_to_sudo" == "y" ]] && echo "y" || echo "n")

# Проверка на существование пользователя (вторая защита)
if check_user_exists "$new_username"; then
    error_exit "User '$new_username' already exists. Aborting."
fi

# Создание пользователя с домашним каталогом и оболочкой Bash
sudo useradd -m -s /bin/bash "$new_username" || error_exit "Failed to create user '$new_username'."

# Создание SSH-директории и копирование ключей
sudo mkdir -p /home/"$new_username"/.ssh || error_exit "Failed to create .ssh directory."
sudo cp "$CURRENTDIR"/.ssh/authorized_keys /home/"$new_username"/.ssh/ || error_exit "Failed to copy authorized_keys."

# Установка прав на SSH-директорию
sudo chown -R "$new_username":"$new_username" /home/"$new_username"/.ssh || error_exit "Failed to set ownership on .ssh."
sudo chmod 700 /home/"$new_username"/.ssh || error_exit "Failed to set permissions on .ssh."
sudo chmod 600 /home/"$new_username"/.ssh/authorized_keys || error_exit "Failed to set permissions on authorized_keys."

# Добавление в группу sudo, если требуется
if [[ "$add_to_sudo" == "y" ]]; then
    sudo usermod -aG sudo "$new_username" || error_exit "Failed to add user '$new_username' to the sudo group."
fi

# Установка пароля
echo "$new_username:$new_password" | sudo chpasswd || error_exit "Failed to set password for user '$new_username'."

log "New user '$new_username' created successfully."