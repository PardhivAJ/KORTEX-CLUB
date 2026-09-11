# Architecture & Design Decisions

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Authentication:** JWT
- **Password Hashing:** bcrypt

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios

## Architectural Patterns

### 1. Service Layer Pattern
- **Location:** `backend/src/services/`
- **Purpose:** Business logic separation from routes
- **Examples:** authService, pointsService, attendanceService

### 2. Route Handler Pattern
- **Location:** `backend/src/routes/`
- **Purpose:** API endpoint definitions
- **Benefits:** Organized, maintainable, testable

### 3. Middleware Chain Pattern
- **Authentication Middleware:** Validates JWT tokens
- **Authorization Middleware:** Role-based access control
- **Error Handler Middleware:** Centralized error handling

### 4. Repository Pattern (via Prisma ORM)
- Database queries through Prisma client
- Type-safe database operations
- Built-in migrations support

### 5. Adapter Pattern
- **Timetable Integration:** ExcelTimetableSource → ERPTimetableSource
- **Notification Integration:** TelegramNotificationService → EmailNotificationService
- **Benefit:** Easy to swap implementations without changing core logic

## Database Design

### Normalization
- 3NF normalization applied
- Minimal redundancy
- Referential integrity maintained

### Indexing Strategy
- Indexes on frequently queried columns
- Foreign keys indexed for JOIN operations
- Composite indexes for common filter patterns

### Soft Deletes
- User records: Use `isActive` and `isApproved` flags
- Events: Use `isActive` flag
- Audit trail: Preserved in audit logs

## Security Architecture

### Authentication Flow
```
User Login
  ↓ (credentials)
Auth Service (bcrypt validation)
  ↓ (valid)
Generate JWT (access + refresh tokens)
  ↓
Client stores tokens
  ↓
Include access token in Authorization header
  ↓
Auth Middleware validates token
  ↓
Continue to route handler
```

### Authorization Flow
```
Route receives request with auth token
  ↓
Auth Middleware extracts user info
  ↓
Route handler calls Authorization Middleware
  ↓
Check user role against required roles
  ↓
If authorized: continue
If not: return 403 Forbidden
```

### Password Security
- Minimum 12 characters required
- bcrypt with 12 salt rounds
- Never stored in plain text
- Never logged

## Attendance Workflow Architecture

### Check-in Flow
```
Student presents QR code
  ↓
Verify QR is valid and not expired
  ↓
Record check-in timestamp
  ↓
Lookup student timetable
  ↓
Detect overlapping classes
  ↓
If conflict: Mark with conflict flag
  ↓
Group students by Faculty + Subject + TimeSlot
  ↓
Generate attendance request per faculty
  ↓
Send Telegram notification (only to relevant faculty)
  ↓
Faculty approves/rejects
  ↓
Update attendance status
  ↓
Allocate points
```

### Faculty Notification Grouping
- Students grouped by: Faculty + Subject + Time Slot
- Only relevant faculty receive notifications
- Reduces notification spam
- Improves faculty context awareness

## Scalability Considerations

### Caching Strategy
- Leaderboard: Updated hourly (cache invalidation)
- User profiles: Cached on login
- Configuration: Cached in environment variables

### Database Optimization
- Connection pooling: min 5, max 20
- Query optimization: Lazy loading where appropriate
- Batch operations: For bulk inserts/updates

### API Pagination
- Default page size: 50
- Maximum page size: 100
- Reduces payload and improves response time

## Future Scalability

### Horizontal Scaling
- Stateless API design enables load balancing
- Session stored in JWT (not server-side)
- Database can scale via replication

### Microservices Potential
- Attendance service could be separate
- Points service could be separate
- Notification service could be separate
- Admin service could be separate

## Testing Strategy

### Unit Tests
- Auth service (token generation, password hashing)
- Points service (calculation logic)
- Utility functions

### Integration Tests
- Complete user registration flow
- Event registration and check-in
- Points allocation workflow
- Attendance request generation

### API Tests
- All endpoints for different roles
- Input validation
- Error handling

## Deployment Architecture

### Development
- Local PostgreSQL
- Node.js dev server
- React dev server (Vite)

### Production
- Dockerized backend
- Dockerized frontend
- PostgreSQL on managed service
- Redis for caching (future)
- Nginx for reverse proxy
- SSL/TLS encryption

## Error Handling Strategy

### Validation Errors
- Input validation at route level (express-validator)
- Database constraint validation (Prisma)
- Custom business logic validation (service layer)

### Error Response
```json
{
  "error": "Descriptive error message",
  "status": 400
}
```

### Error Logging
- All errors logged to stdout
- Structured logging (future: ELK stack)
- Sensitive data masked

## Monitoring & Observability

### Current
- Console logging with log levels
- Audit logs in database

### Future
- Application Performance Monitoring (APM)
- Distributed tracing
- Centralized logging (ELK/Splunk)
- Metrics collection (Prometheus)
- Alerting system

---

**Version:** 1.0
**Last Updated:** 2026-09-01
