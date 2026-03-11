#!/bin/bash

echo "🚀 Setting up Company Scraper SaaS..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please ensure PostgreSQL 14+ is installed and running."
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis not found. Please ensure Redis 6+ is installed and running."
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
cd backend
echo "Installing backend dependencies..."
npm install
cd ..

# Install frontend dependencies
cd frontend
echo "Installing frontend dependencies..."
npm install
cd ..

echo ""
echo "📄 Setting up environment variables..."
echo ""

# Copy env files
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
fi

echo ""
echo "🗄️  Database setup..."
echo "Run the following commands to set up your database:"
echo ""
echo "  createdb company_scraper"
echo "  psql -U postgres -d company_scraper -f database/schema.sql"
echo ""

echo "✅ Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
