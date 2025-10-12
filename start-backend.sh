#!/bin/bash

echo "Starting StockLens Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI server..."

# Determine port (default 8000). If in use, fallback to 8001
PORT_TO_USE=${PORT:-8000}
if command -v lsof >/dev/null 2>&1; then
    if lsof -i :"$PORT_TO_USE" -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Port $PORT_TO_USE is in use, switching to 8001"
        PORT_TO_USE=8001
    fi
fi

echo "Launching uvicorn on port $PORT_TO_USE..."
uvicorn main:app --host 0.0.0.0 --port "$PORT_TO_USE"
