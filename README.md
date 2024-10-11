<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
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

## Installation

```bash
# Clone the project from the repository
$ git clone https://github.com/Alex-LaNN/NestJS-backend.git

# Navigate into the project directory
$ cd NestJS-backend

# Install dependencies
$ npm install
```

## Configuration

The application uses environment variables for configuration. You can create `.env.development` and `.env.production` files in the root directory with the following variables:

### .env.development

```TypeScript
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

# Aws s3 parameters
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Secret Key
JWT_SECRET=your_jwt_secret

# For bcrypt password hashing.
SALT_ROUNDS=you_salt_rounds
```

### .env.production

``` Typescript

# Server parameters
DOMAIN_NAME=your_domain_name
APP_PORT=your_application_port

# Maximum number of items to display per page.
LIMIT_COUNT=your_limit_count

# Database connection parameters
DB_TYPE=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USER=your_database_username
# Password to your database
DB_PASS=your_database_password
# Name of your database
DB_NAME=your_database_name

# Secret Key for JWT
JWT_SECRET=your_jwt_secret

# Number of rounds for bcrypt password hashing
SALT_ROUNDS=you_salt_rounds

# AWS S3 parameters
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_REGION=your_aws_region
BUCKET_NAME=your_s3_bucket_name
```

## Test

```bash
# unit tests
$ npm run test
```

## Running the app

```bash
# development
$ npm run start:dev
# production
$ npm run start:prod
```

## Swagger API Documentation

The API documentation is available at /api once the application is running. It provides detailed information about the available endpoints and their usage.

## Support

This project is open source and available under the MIT license. If you have any questions or need support, feel free to open an issue on the [GitHub repository](https://github.com/Alex-LaNN/NestJS-backend/tree/master).

## Stay in touch

* Author - [Alex-LaNN](https://alex-lann.github.io/)
* My Telegram - https://t.me/Alex_LaNN
* Email - alex75klg@gmail.com