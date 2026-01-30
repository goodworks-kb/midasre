#!/bin/bash

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error installing dependencies. Make sure Node.js is installed."
    exit 1
fi

echo ""
echo "Starting development server..."
echo "The website will open automatically in your browser."
echo "Press Ctrl+C to stop the server."
echo ""

npm run dev
