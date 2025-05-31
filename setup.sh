#!/bin/bash
set -e

# Set up application directory
echo "Setting up application directory..."
cd /home/ec2-user
rm -rf team-tasks
mkdir -p team-tasks
cd team-tasks

# Clone repo with specific branch
echo "Cloning repository..."
git clone --branch move-tasks https://github.com/lkersten/team-tasks.git .
if [ ! -f "package.json" ]; then
    echo "Error: Repository not cloned correctly"
    exit 1
fi

# Create .env file
echo "Creating .env file..."
cat > .env << EOL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=team_tasks
DATABASE_URL=postgres://postgres:postgres@localhost:5432/team_tasks
EOL

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database migrations and seed
echo "Running database migrations..."
mkdir -p drizzle
npm run db:generate

# Ensure PostgreSQL is running and accessible
sudo systemctl restart postgresql
sleep 5  # Give PostgreSQL time to start

# Run migrations with explicit password
PGPASSWORD=postgres npm run db:push
PGPASSWORD=postgres npm run db:seed

# Build the app
echo "Building application..."
npm run build

# Start with PM2 and configure startup
echo "Starting application..."
pm2 start npm --name "team-tasks" -- start
pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save

echo "Setup completed!" 