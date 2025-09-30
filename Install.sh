#!/bin/bash

echo "🚀 Installing SelfCore web terminal..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential docker.io docker-compose jq

sudo systemctl enable docker --now

# Backend
cd backend || exit
npm install

# Frontend
cd ../frontend || exit
npm install

# Start Docker Compose
cd ..
docker-compose up -d --build

# Generate first session link
SESSION_ID=$(curl -s http://selfcorex.duckdns.org:3001/session/new | jq -r '.id')
echo "✅ SelfCore terminal ready!"
echo "Open your browser: http://selfcorex.duckdns.org:5173/?id=$SESSION_ID"
