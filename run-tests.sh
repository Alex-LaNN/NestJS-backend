#!/bin/sh

# Use for teamcity agent

# Go to the working directory
cd /usr/src

# Cleaning node_modules if they exist
rm -rf node_modules

# Install Dependencies
echo "Installing dependencies..."
npm install

# Performing a build
echo "Building the project..."
npm run build

# Run tests
echo "Running tests..."
#npm run test
npm run test -- films.controller.spec.ts

# Saving test execution status
TEST_EXIT_CODE=$?

# Exit with test completion code
exit $TEST_EXIT_CODE