#!/bin/sh

# Use for teamcity agent

echo "1.Просмотр из run-tests.sh..."
pwd
ls -lart

# Go to the working directory
cd /usr/src

echo "2.Просмотр из run-tests.sh..."
pwd
ls -lart

# Cleaning node_modules if they exist
rm -rf node_modules

# Install Dependencies
echo "Installing dependencies..."
npm install

# Performing a build
echo "Building the project..."
npm run build

echo "3.Просмотр из run-tests.sh..."
pwd
ls -lart

# Run tests
echo "Running tests..."
#npm run test
npm run test -- films.controller.spec.ts

# Saving test execution status
TEST_EXIT_CODE=$?

# Exit with test completion code
exit $TEST_EXIT_CODE