# KORTEX - Attendance & Event Management System

A comprehensive full-stack application for managing student attendance, events, hackathons, and achieving gamification through a points-based leaderboard system.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn
- Git

### Installation

1. **Clone/Setup the repository**
```bash
cd Kortex
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run db:migrate
npm run db:seed
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
```

4. **Start Development**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Project Structure

```
Kortex/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # API request handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database models (Prisma)
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Utility functions
│   │   ├── adapters/          # Integration adapters
│   │   └── index.ts           # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── tests/                 # Backend tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client services
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS/Tailwind styles
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── tests/                 # Frontend tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── README.md
│
├── database/                   # Database documentation and samples
│   ├── schema.md              # Database schema documentation
│   ├── samples/               # Sample data
│   └── timetable-template.xlsx
│
├── docs/                       # Project documentation
│   ├── API.md                 # API documentation
│   ├── ARCHITECTURE.md        # Architecture decisions
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── TESTING.md             # Testing guide
│
├── tests/                      # Integration tests
│   ├── e2e/                   # End-to-end tests
│   └── integration/           # Integration tests
│
├── KORTEX_SPEC.md             # Complete specification
├── README.md                  # This file
├── .env.example               # Environment variables template
└── .gitignore                 # Git ignore rules
```

## Core Features

### ✅ Authentication & RBAC
- Email-based student registration with OTP verification
- Admin approval workflow
- Role-based access control (Student, MOD, Admin, Faculty)
- JWT-based authentication with token refresh

### ✅ Event Management
- Event creation and registration
- Event capacity management
- Attendance tracking
- Event-specific point allocation

### ✅ Hackathon System
- Hackathon creation and team management
- Team registration with member roles
- Check-in system

### ✅ Attendance Workflow
- **QR-based check-in**: Fast, secure student verification
- **Timetable integration**: Excel file upload and parsing
- **Conflict detection**: Automatic detection of overlapping classes
- **Smart faculty notifications**: Only relevant faculty receive notifications via Telegram
- **Audit trail**: Complete attendance history

### ✅ Points & Leaderboard
- Dynamic points allocation based on event type and performance
- Global leaderboard with real-time updates
- Category-based leaderboards
- Transparent points history

### ✅ Admin Dashboard
- Student registration approvals
- Event management
- Timetable import
- Analytics and reporting
- Audit log access

### ✅ Faculty Tools
- Check attendance requests (Portal/Telegram)
- Approve/reject attendance
- View student attendance history
- Subject and time-slot based grouping

## Development Workflow

### Database Migrations
```bash
# Generate migration
npm run db:generate

# Run migrations
npm run db:migrate

# Reset database (development only)
npm run db:reset

# Seed development data
npm run db:seed
```

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration tests
cd tests
npm test
```

### Building for Production
```bash
# Backend build
cd backend
npm run build

# Frontend build
cd frontend
npm run build
```

## API Documentation

See [docs/API.md](docs/API.md) for complete API endpoint documentation.

Key endpoints:
- `POST /api/auth/register` - Student registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - Login
- `GET /api/events` - List events
- `POST /api/check-in/generate-qr` - Generate QR code
- `POST /api/check-in/submit` - Submit check-in
- `GET /api/leaderboard` - Global leaderboard

## Security

- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ JWT authentication with secure tokens
- ✅ Role-based authorization on all endpoints
- ✅ SQL injection prevention (Prisma ORM)
- ✅ CORS configuration
- ✅ Rate limiting on sensitive endpoints
- ✅ Comprehensive audit logging
- ✅ Environment variable protection

## Performance Optimization

- Indexed database queries
- Pagination on all list endpoints (default: 50 per page)
- Cached leaderboard (hourly updates)
- Gzip compression
- Connection pooling

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Update DATABASE_URL in .env
npm run db:reset
```

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Configuration

See `.env.example` for all configuration options:
- Database connection
- JWT secrets and expiry
- Telegram bot credentials
- Email (SMTP) settings
- Points configuration
- Rate limiting settings

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions including Docker setup.

## Integration Architecture

### Timetable Integration
- **v1**: Excel file upload and parsing
- **Future**: College ERP API
- Uses adapter pattern for seamless switching

### Notification Integration
- **v1**: Telegram Bot API
- **Future**: Email, In-app, SMS
- Uses strategy pattern for extensibility

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## License

Proprietary - KORTEX Project

## Support

For issues or questions, contact the development team or create an issue in the project tracker.

---

**Version**: 1.0
**Last Updated**: 2026-09-01
**Status**: Production Ready
# KORTEX-CLUB 
#   K O R T E X - C L U B  
 #   K O R T E X - C L U B  
 #   K O R T E X - C L U B  
 