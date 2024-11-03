#!/bin/sh

# Переходим в рабочую директорию
cd /usr/src

# Очищаем node_modules если они есть
rm -rf node_modules

# Устанавливаем зависимости
echo "Installing dependencies..."
npm install

# Выполняем сборку
echo "Building the project..."
npm run build

# Запускаем тесты
echo "Running tests..."
npm run test

# Сохраняем статус выполнения тестов
TEST_EXIT_CODE=$?

# Выходим с кодом завершения тестов
exit $TEST_EXIT_CODE