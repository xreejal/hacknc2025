#!/bin/bash

echo "Starting StockLens Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting Next.js development server..."
npm run dev
