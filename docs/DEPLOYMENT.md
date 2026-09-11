# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (for containerized deployment)
- Git

## Development Deployment

### 1. Clone & Setup
```bash
git clone <repository>
cd Kortex
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Configure .env with database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/kortex_db

npm run db:migrate
npm run db:seed
npm run dev
```

Backend will run on http://localhost:3000

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend will run on http://localhost:5173

## Production Deployment

### 1. Database Setup
```bash
# Create PostgreSQL database and user
createdb kortex_db
createuser kortex_user -P
```

### 2. Backend Deployment
```bash
cd backend
npm install
npm run build

# Set production environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://...
export JWT_SECRET=your-secret-key
export TELEGRAM_BOT_TOKEN=your-token

# Run migrations
npm run db:migrate

# Start server
npm start
```

### 3. Frontend Deployment
```bash
cd frontend
npm install
npm run build

# Serve dist directory with web server
# Use nginx, Apache, or cloud storage
```

### 4. Environment Variables

**Backend (.env)**
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=<min 32 chars>
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

FRONTEND_URL=https://frontend.domain.com
CORS_ORIGIN=https://frontend.domain.com

TELEGRAM_BOT_TOKEN=<bot-token>
TELEGRAM_BOT_USERNAME=<bot-username>

SMTP_HOST=<smtp-server>
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASSWORD=<password>

LOG_LEVEL=info
```

**Frontend (.env)**
```
VITE_API_URL=https://api.domain.com/api
```

## Docker Deployment

### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
```

### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: kortex_user
      POSTGRES_PASSWORD: kortex_password
      POSTGRES_DB: kortex_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://kortex_user:kortex_password@postgres:5432/kortex_db
      NODE_ENV: production
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run with: `docker-compose up -d`

## Cloud Deployment

### AWS Deployment

**Backend (EC2)**
```bash
# SSH into EC2 instance
ssh -i key.pem ec2-user@instance-ip

# Install dependencies
sudo yum install nodejs npm postgresql
git clone <repo>
cd Kortex/backend
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name kortex-backend -- start
```

**Frontend (S3 + CloudFront)**
```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://kortex-frontend/

# Set up CloudFront distribution pointing to S3
```

**Database (RDS)**
- Create RDS PostgreSQL instance
- Configure security groups
- Update DATABASE_URL in backend

### Heroku Deployment

**Backend**
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
heroku create kortex-backend
heroku config:set DATABASE_URL=postgresql://...
git push heroku main
```

**Frontend**
```bash
cd frontend
npm run build

# Deploy to Netlify or Vercel
netlify deploy --prod --dir=dist
```

## SSL/TLS Certificate

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d api.domain.com
sudo certbot certonly --standalone -d domain.com

# Update nginx configuration to use certificates
```

## Nginx Reverse Proxy Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.domain.com;

    ssl_certificate /etc/letsencrypt/live/api.domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name domain.com;

    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;

    root /var/www/kortex/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Monitoring & Maintenance

### Backup Strategy
```bash
# Daily PostgreSQL backups
pg_dump kortex_db > backup_$(date +%Y%m%d).sql

# Store in S3
aws s3 cp backup_*.sql s3://kortex-backups/
```

### Log Rotation
```bash
# Configure logrotate for application logs
/var/log/kortex/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
}
```

### Health Checks
```bash
# Monitor endpoint
curl https://api.domain.com/health
```

## Post-Deployment

- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Backups scheduled
- [ ] Monitoring configured
- [ ] Email notifications working
- [ ] Telegram bot configured
- [ ] Load testing completed
- [ ] Security scan passed

---

**Version:** 1.0
**Last Updated:** 2026-09-01
