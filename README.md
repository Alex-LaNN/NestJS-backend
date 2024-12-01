# NestJS Star Wars Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
  <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
</p>

## Description

This project is a NestJS-based backend application for managing Star Wars data, including entities like People, Films, Planets, Species, Starships, and Vehicles. The application provides a set of CRUD APIs for these entities, integrates with a database, supports image uploads, and implements authentication and authorization.

## Features

- CRUD operations for Star Wars entities
- Pagination support
- Image uploads to AWS S3
- Validation of data
- Database integration and migrations
- Authentication and authorization using Passport.js
- Role-based access control
- Global error handling
- Swagger documentation

## Prerequisites

- Node.js
- npm
- Docker (optional, for containerized deployment)
- MySQL database

## Installation

```bash
# Clone the project from the repository
git clone https://github.com/Alex-LaNN/NestJS-backend.git

# Navigate into the project directory
cd NestJS-backend

# Install dependencies
npm install
```

## Configuration

The application uses environment variables for configuration. Create `.env` files based on your environment.

### Development Environment (`.env`)

```bash
# Server parameters
HOST=localhost
PORT=your_application_port

# Paginate parameter
LIMIT_COUNT=your_limit_count

# Database
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=your_database_port
DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name

# AWS S3 parameters
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Secret Key
JWT_SECRET=your_jwt_secret

# For bcrypt password hashing
SALT_ROUNDS=you_salt_rounds
```

### Production Environment (`.env.production`)

```bash
# Server parameters
DOMAIN_NAME=your_domain_name
APP_PORT=your_application_port

# Pagination
LIMIT_COUNT=your_limit_count

# Database connection
DB_TYPE=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=your_database_name

# Security
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=you_salt_rounds

# AWS S3 parameters
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_REGION=your_aws_region
BUCKET_NAME=your_s3_bucket_name
```

## Local Development

```bash
# Start the application in development mode
npm run start:dev

# Run unit tests
npm run test
```

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Deployment Steps

```bash
# Clone the repository
git clone https://github.com/Alex-LaNN/NestJS-backend.git
cd NestJS-backend

# Prepare environment files
# Copy .env.production and configure variables

# Build and run containers
docker-compose -f docker-compose.yml up --build -d

# Check running containers
docker ps
```

### Docker Compose Services

The `docker-compose.yml` includes:
- **Application Container**: Runs the NestJS application
- **MySQL Container**: Hosts the database
- **Nginx Container**: Reverse proxy and HTTPS handling

### Container Management

```bash
# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Update the application
git pull
docker-compose down
docker-compose -f docker-compose.yml up --build -d
```

## Swagger API Documentation (home page)

API documentation is available at `/api` after running the application.

## Access the Application

- Local: http://localhost:<your_application_port>/api
- Production: https://<your_domain_name>/api

## Stay in Touch

- **Author**: [Alex-LaNN](https://alex-lann.github.io/)
- **Telegram**: [@Alex_LaNN](https://t.me/Alex_LaNN)
- **Email**: alex75klg@gmail.com

## License

[Insert License Information]