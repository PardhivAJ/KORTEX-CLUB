# KORTEX - Complete Specification

## Overview

KORTEX is a comprehensive attendance and event management system for educational institutions. It integrates student registration, OTP-based authentication, admin approval workflows, role-based access control (RBAC), event management, hackathon tracking, QR-based check-in, and intelligent attendance marking with conflict detection.

## Core Features

### 1. Authentication & Authorization

#### 1.1 Student Registration
- Email-based registration with OTP verification
- Personal information collection (name, roll number, department, semester)
- Phone number verification
- Profile completion after registration
- Password hashing using bcrypt (min 12 characters recommended)
- Account activation workflow

#### 1.2 OTP Management
- 6-digit OTP generation
- SMS/Email delivery (v1: Email only)
- OTP expiry: 10 minutes
- Maximum 3 attempts per OTP
- Rate limiting on OTP requests

#### 1.3 Admin Approval Workflow
- Admin dashboard for pending registrations
- Bulk approval/rejection capability
- Rejection with reason feedback
- Approval notification to students
- Email confirmation of approval

#### 1.4 Role-Based Access Control (RBAC)
- Roles: Student, MOD (Moderator), Admin, Faculty
- Permission matrix for each role
- Role-specific dashboards
- Permission validation on backend for all endpoints
- Audit logging of permission checks

### 2. User Profiles

#### 2.1 Student Profile
- Basic info: Name, Email, Phone, Roll Number, Department, Semester
- Profile picture
- Achievements and badges
- Points balance
- Leaderboard rank
- Registered events
- Attendance history
- Hackathon participation

#### 2.2 Faculty/Staff Profile
- Name, Department, Phone, Email
- Specialization
- Time slots
- Assigned classes
- Telegram contact information

#### 2.3 MOD/Admin Profile
- Name, Email, Phone
- Department/Area of responsibility
- Permissions and privileges

### 3. Events Management

#### 3.1 Event Creation
- Event name, description, date, time
- Location/Room details
- Capacity (maximum attendees)
- Categories: Workshop, Seminar, Tech Talk, Competition, etc.
- Organizer/Coordinator assignment
- Faculty/Event coordinator assignment
- Start time, end time
- Registration open/close dates
- Eligibility criteria (department, year, etc.)

#### 3.2 Event Registration
- Students browse and register for events
- Registration confirmation via email
- Event capacity management
- Waitlist functionality
- Registration deadline enforcement
- Cancellation with refund of points (if applicable)

#### 3.3 Event Dashboard
- Event statistics (registered, attended, no-show)
- Attendance rate
- Performance metrics
- Registered students list
- Check-in status

### 4. Hackathons

#### 4.1 Hackathon Management
- Hackathon creation with theme, rules, judging criteria
- Registration period management
- Team creation and team size limits
- Team member management
- Prize pool and scoring rules
- Sponsorship details
- Duration (start date/time to end date/time)

#### 4.2 Hackathon Participation
- Team registration
- Team member role assignment (leader, members)
- Project submission
- Live evaluation period
- Judging panel assignment

#### 4.3 Hackathon Attendance
- Check-in at hackathon start
- Time-slot based attendance marking
- Continuous participation tracking
- Project submission time tracking

### 5. QR-Based Check-In System

#### 5.1 Check-In Process
- Generate unique QR codes per event/hackathon instance
- QR code validity time window (15 minutes before event start)
- Student scans QR code using mobile/tablet
- Real-time check-in verification
- Server-side validation of QR code
- Timestamp recording

#### 5.2 Check-In Verification
- Student ID verification
- Event/Hackathon validity check
- Duplicate check-in prevention (same student, same event)
- Geolocation (optional v1, future enhancement)
- Network retry capability

#### 5.3 Check-In UI
- Mobile-responsive QR scanner
- Real-time feedback (success/error)
- Student name confirmation
- Checkpoint display (scanned count, total registered)

### 6. Attendance Management Engine

#### 6.1 Core Attendance Workflow
```
Event/Hackathon Check-In
  ↓ Verify Student
  ↓ Record Check-in Timestamp
  ↓ Lookup Student Timetable
  ↓ Detect Overlapping Classes
  ↓ Identify Faculty
  ↓ Group Students (Faculty + Subject + TimeSlot)
  ↓ Generate Attendance Request
  ↓ Send Telegram Notification (Faculty Only)
```

#### 6.2 Timetable Management
- Excel file upload (v1 timetable source)
- Timetable schema: Date, Time, Faculty, Subject, Room, Department, Year
- Timetable validation (conflict detection, duplicate entries)
- Timetable versioning
- Support for repeating time slots (weekly/semester)
- Soft delete for outdated timetables

#### 6.3 Conflict Detection
- Identify students with overlapping classes
- Attendance mark eligibility validation:
  - Student is registered for event
  - Check-in time is within event window
  - No class conflict at check-in time
- If conflict exists: Flag student, notify faculty separately
- Detailed conflict report

#### 6.4 Faculty Grouping
- Group students by Faculty + Subject + TimeSlot
- Generate grouped attendance request per faculty
- Include student list, department, event details
- Faculty-specific context only

#### 6.5 Attendance Request Notification
- Send via Telegram (v1)
- Recipients: Only relevant faculty members
- Message includes:
  - Event/Hackathon name
  - Check-in time
  - List of checked-in students
  - Department and subject context
  - Conflict flags (if any)
  - One-click approval/rejection (future)
- Telegram group/channel architecture
- Notification logging and delivery confirmation

#### 6.6 Attendance Approval
- Faculty receives notification
- Manual verification through portal/Telegram
- Approval/rejection of attendance
- Batch processing capability
- Attendance finalization

### 7. Points System

#### 7.1 Points Allocation
- Event attendance: Base points (configurable per event)
- Event category multiplier: Tech events +10%, Competition +20%, etc.
- Early registration bonus: +5 points
- Perfect attendance (no conflicts): Bonus points
- Hackathon participation: Base + submission bonus
- Faculty/Admin approval bonus

#### 7.2 Points Deduction
- No-show: Penalty points
- Violation: Suspension points
- Cancellation: Refund of half points

#### 7.3 Points History
- Detailed transaction log
- Timestamp, reason, points delta
- Approval status
- Auditable record

### 8. Leaderboard

#### 8.1 Overall Leaderboard
- Ranked by total points
- Filter by department, semester, year
- Monthly/semester/all-time views
- Display: Rank, Name, Department, Points, Events Attended
- Real-time updates
- Pagination (50 per page)

#### 8.2 Category Leaderboards
- By event type
- By department
- By time period
- Top 100 display

#### 8.3 Leaderboard Features
- Tie-breaker: Latest achievement date
- Privacy settings (optional anonymization)
- Export capability for awards ceremony

### 9. Analytics & Reporting

#### 9.1 Student Analytics
- Total events attended
- Points breakdown by category
- Attendance rate
- Preferred event types
- Peak registration times
- No-show pattern analysis

#### 9.2 Event Analytics
- Registration vs attendance rate
- Demographics of attendees
- Feedback scores
- Capacity utilization
- No-show rate by department/year

#### 9.3 Admin Analytics Dashboard
- System-wide statistics
- Active users count
- Total events, hackathons, check-ins
- Faculty notification success rate
- Conflict detection rate
- Report generation (PDF export)

### 10. Audit Logging

#### 10.1 Events to Log
- User registration and approval
- Role changes
- Event creation/modification
- Check-in events
- Attendance marking
- Points allocation/deduction
- Timetable uploads
- Admin actions
- Login/logout events
- Failed authorization attempts

#### 10.2 Audit Log Structure
- Timestamp (UTC)
- User ID and role
- Action type
- Resource affected
- Old value → New value
- IP address (optional)
- Status (success/failure)
- Reason (if failure)

#### 10.3 Audit Log Features
- Immutable records
- Searchable by user, date, action type
- 1-year retention policy (configurable)
- Export capability
- Integrity verification

### 11. Timetable Import

#### 11.1 Excel Format
- Columns: Date, Time, Faculty, Subject, Room, Department, Year
- Support for recurring entries (weekly schedules)
- Validation rules during import
- Error reporting with line numbers
- Preview before finalization

#### 11.2 Import Validation
- Date format validation
- Time format validation (24-hour)
- Faculty existence verification
- Room availability check
- Overlapping time slot detection
- Department/year validity check

#### 11.3 Import Processing
- Bulk insert with transaction support
- Conflict resolution strategy (update/skip/error)
- Versioning of timetable sets
- Audit log of import

### 12. Database Schema

#### 12.1 Core Tables
```
users
├── id (PK)
├── email (unique)
├── password_hash
├── first_name
├── last_name
├── phone
├── role (enum: student, faculty, mod, admin)
├── is_active
├── is_approved (for students)
├── created_at
├── updated_at

student_profiles
├── id (PK)
├── user_id (FK)
├── roll_number (unique)
├── department
├── semester
├── profile_picture_url
├── points_balance
├── created_at
├── updated_at

faculty_profiles
├── id (PK)
├── user_id (FK)
├── specialization
├── telegram_chat_id
├── department
├── created_at
├── updated_at

events
├── id (PK)
├── name
├── description
├── date
├── start_time
├── end_time
├── location
├── category
├── capacity
├── current_registrations
├── organizer_id (FK)
├── faculty_coordinator_id (FK)
├── base_points
├── registration_open_date
├── registration_close_date
├── is_active
├── created_at
├── updated_at

event_registrations
├── id (PK)
├── event_id (FK)
├── student_id (FK)
├── registered_at
├── is_checked_in
├── check_in_time
├── is_approved
├── approval_notes
├── created_at
├── updated_at

hackathons
├── id (PK)
├── name
├── description
├── theme
├── start_date
├── start_time
├── end_date
├── end_time
├── location
├── max_team_size
├── min_team_size
├── prize_pool
├── rules
├── organizer_id (FK)
├── created_at
├── updated_at

hackathon_teams
├── id (PK)
├── hackathon_id (FK)
├── team_name
├── leader_id (FK)
├── is_checked_in
├── check_in_time
├── created_at
├── updated_at

hackathon_team_members
├── id (PK)
├── team_id (FK)
├── student_id (FK)
├── role
├── joined_at

qr_codes
├── id (PK)
├── token (unique)
├── event_id OR hackathon_id
├── generated_at
├── expires_at
├── scan_count
├── is_active

check_ins
├── id (PK)
├── event_id OR hackathon_id
├── student_id
├── timestamp
├── qr_code_id (FK)
├── has_conflict
├── conflict_details
├── created_at

timetable_entries
├── id (PK)
├── date
├── start_time
├── end_time
├── faculty_id (FK)
├── subject
├── room
├── department
├── year
├── timetable_set_id (FK)
├── created_at

points_transactions
├── id (PK)
├── student_id (FK)
├── points_delta
├── reason
├── related_event_id
├── related_check_in_id
├── approved_by
├── status (pending/approved/rejected)
├── created_at

attendance_requests
├── id (PK)
├── event_id
├── faculty_id (FK)
├── grouped_students (JSON array)
├── status (pending/approved/rejected)
├── telegram_message_id
├── created_at
├── approved_at

audit_logs
├── id (PK)
├── user_id (FK)
├── action_type
├── resource_type
├── resource_id
├── old_value (JSON)
├── new_value (JSON)
├── ip_address
├── status
├── reason
├── created_at

otp_requests
├── id (PK)
├── email
├── otp_code (hashed)
├── attempts
├── expires_at
├── is_verified
├── created_at

leaderboard_cache
├── id (PK)
├── student_id (FK)
├── rank
├── total_points
├── events_attended
├── updated_at
```

### 13. API Endpoints

#### 13.1 Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password with OTP

#### 13.2 Admin Management
- `GET /api/admin/pending-registrations` - List pending approvals
- `POST /api/admin/approve-student/:id` - Approve student
- `POST /api/admin/reject-student/:id` - Reject student
- `GET /api/admin/audit-logs` - Audit log retrieval
- `POST /api/admin/timetable/import` - Excel timetable import

#### 13.3 Events
- `GET /api/events` - List events (paginated)
- `POST /api/events` - Create event (MOD/Admin)
- `GET /api/events/:id` - Event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration
- `GET /api/events/:id/registrations` - Event attendees (MOD/Admin)

#### 13.4 Check-In
- `POST /api/check-in/generate-qr` - Generate QR code
- `GET /api/check-in/qr/:token` - Verify QR code
- `POST /api/check-in/submit` - Submit check-in
- `GET /api/check-in/status/:event-id/:student-id` - Check-in status

#### 13.5 Attendance
- `GET /api/attendance/requests` - Faculty pending requests (Telegram/Portal)
- `POST /api/attendance/approve` - Approve attendance
- `POST /api/attendance/reject` - Reject attendance
- `GET /api/attendance/history/:student-id` - Student attendance history

#### 13.6 Points
- `GET /api/points/balance` - Current points
- `GET /api/points/history` - Points transaction history
- `GET /api/leaderboard` - Global leaderboard

#### 13.7 Hackathons
- `GET /api/hackathons` - List hackathons
- `POST /api/hackathons` - Create hackathon
- `GET /api/hackathons/:id` - Hackathon details
- `POST /api/hackathons/:id/register-team` - Register team
- `GET /api/hackathons/:id/teams` - Teams list

#### 13.8 Timetable
- `GET /api/timetable` - Get student's timetable
- `GET /api/timetable/conflicts/:event-id/:student-id` - Check conflicts

#### 13.9 Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/picture` - Upload profile picture

### 14. Security Requirements

#### 14.1 Authentication & Encryption
- JWT tokens with 24-hour expiry, 7-day refresh token expiry
- Password minimum 12 characters (enforced at registration)
- bcrypt password hashing (salt rounds: 12)
- HTTPS only (enforced in production)
- CORS configuration for frontend domain

#### 14.2 Authorization
- Role-based access control on all endpoints
- Backend permission validation
- No client-side authorization trust
- API key for timetable imports

#### 14.3 Database Security
- SQL injection prevention (parameterized queries via ORM)
- Transaction support for critical operations
- Soft deletes for audit trail
- Data encryption at rest (future)

#### 14.4 Audit & Compliance
- All user actions logged
- Failed login attempt tracking
- IP-based rate limiting (5 failures = 15-minute lockout)
- Sensitive data masking in logs

### 15. Performance Requirements

#### 15.1 Database Optimization
- Indexes on frequently queried fields:
  - users (email)
  - event_registrations (event_id, student_id)
  - check_ins (event_id, timestamp)
  - timetable_entries (date, time, faculty_id)
  - points_transactions (student_id, created_at)

#### 15.2 Pagination & Caching
- All list endpoints paginated (default 50 per page)
- Leaderboard cached (updated hourly)
- Response caching headers
- Gzip compression enabled

#### 15.3 Query Optimization
- Lazy loading for related data
- Batch queries where appropriate
- Connection pooling (min: 5, max: 20)

### 16. Development Setup

#### 16.1 Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Testing**: Jest + React Testing Library
- **Deployment**: Docker (future)

#### 16.2 Environment Variables
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
TELEGRAM_BOT_TOKEN=...
TELEGRAM_BOT_USERNAME=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...
```

#### 16.3 Development Workflow
1. Install dependencies: `npm install` (backend & frontend)
2. Setup database: `npm run db:migrate`
3. Seed data: `npm run db:seed`
4. Start backend: `npm run dev`
5. Start frontend: `npm run dev` (separate terminal)
6. Run tests: `npm test`

### 17. Integration Architecture

#### 17.1 Timetable Integration (v1: Excel → Future: ERP)
- **Current**: Excel file upload and parsing
- **Future**: College ERP API
- **Architecture**: Adapter pattern for data source
- Interface: `ITimetableSource`
- Implementation: `ExcelTimetableSource` → `ERPTimetableSource`

#### 17.2 Notification Integration (v1: Telegram → Future: Multiple)
- **Current**: Telegram Bot API
- **Future**: Email, In-app notifications, SMS
- **Architecture**: Strategy pattern for notification delivery
- Interface: `INotificationService`
- Implementation: `TelegramNotificationService` → `EmailNotificationService`

#### 17.3 Authentication Integration (Future: LDAP, OAuth)
- **Current**: Email + OTP
- **Future**: College LDAP, OAuth2 (Google, Microsoft)
- **Architecture**: Plugin-based auth providers
- Interface: `IAuthProvider`

### 18. Testing Strategy

#### 18.1 Unit Tests
- Auth service: Registration, OTP, login, token validation
- Points calculation: Allocation, deduction, history
- Conflict detection: Timetable overlap logic
- Permission checks: RBAC implementation

#### 18.2 Integration Tests
- User registration flow (complete)
- Event registration and check-in workflow
- Attendance request generation and notification
- Points transaction and leaderboard update

#### 18.3 API Tests
- All endpoint authentication
- Authorization for different roles
- Input validation and error handling
- Pagination and filtering

#### 18.4 Database Tests
- Migration integrity
- Constraint validation
- Transaction rollback
- Query performance

### 19. Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Test suite passing (100% critical paths)
- [ ] API endpoints documented (Swagger/OpenAPI)
- [ ] Frontend build successful
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Backup strategy established
- [ ] Monitoring/alerts configured

### 20. Future Enhancements

1. **Mobile App**: Native iOS/Android for streamlined check-in
2. **Geolocation**: GPS-based verification for check-in
3. **Analytics**: Advanced dashboards and predictive analytics
4. **Gamification**: Badges, achievements, streaks
5. **ERP Integration**: Direct college database sync
6. **Multi-channel Notifications**: Email, SMS, In-app
7. **Video Conferencing**: Virtual event support
8. **Payment Integration**: For ticketed events
9. **Machine Learning**: Attendance prediction, fraud detection
10. **Blockchain**: Certificate generation and verification

---

**Version**: 1.0
**Last Updated**: 2026-09-01
**Status**: Production Ready
