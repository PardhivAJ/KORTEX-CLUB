# API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://api.kortex.local/api`

## Authentication
All endpoints except `/auth/login` and `/auth/register/*` require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All responses are in JSON format with consistent structure:
```json
{
  "data": {},
  "error": null,
  "message": "Success"
}
```

## Error Responses
```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Endpoints

### Authentication

#### POST /auth/register/send-otp
Send OTP to email for registration.

**Request:**
```json
{
  "email": "student@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "OTP sent to email",
  "otp": "123456" // Only in development
}
```

#### POST /auth/register/verify-otp
Verify OTP and create account.

**Request:**
```json
{
  "email": "student@example.com",
  "otp": "123456",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9999999999",
  "password": "SecurePassword123456",
  "rollNumber": "CS001",
  "department": "CSE",
  "semester": 3
}
```

**Response:** `200 OK`
```json
{
  "message": "Registration successful. Awaiting admin approval.",
  "userId": "clx..."
}
```

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "student@example.com",
  "password": "SecurePassword123456"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx...",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  },
  "accessToken": "eyJ0eXAi...",
  "refreshToken": "eyJ0eXAi..."
}
```

#### GET /auth/me
Get current user profile.

**Response:** `200 OK`
```json
{
  "id": "clx...",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "studentProfile": {
    "id": "clx...",
    "rollNumber": "CS001",
    "department": "CSE",
    "semester": 3,
    "pointsBalance": 150
  }
}
```

---

### Events

#### GET /events
List all active events with pagination.

**Query Parameters:**
- `page` (int, default: 1)
- `pageSize` (int, default: 50, max: 100)

**Response:** `200 OK`
```json
{
  "events": [
    {
      "id": "clx...",
      "name": "Tech Fest 2026",
      "description": "Annual technology festival",
      "date": "2026-09-15T00:00:00Z",
      "startTime": "09:00",
      "endTime": "17:00",
      "location": "Auditorium",
      "category": "Tech",
      "capacity": 100,
      "currentRegistrations": 45,
      "basePoints": 10
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 120,
    "pages": 3
  }
}
```

#### POST /events/:id/register
Register student for event.

**Response:** `201 Created`
```json
{
  "id": "clx...",
  "eventId": "clx...",
  "studentId": "clx...",
  "registeredAt": "2026-09-01T10:30:00Z",
  "isCheckedIn": false
}
```

---

### Check-In

#### POST /check-in/generate-qr
Generate QR code for event (MOD/Admin only).

**Request:**
```json
{
  "eventId": "clx..."
}
```

**Response:** `201 Created`
```json
{
  "id": "clx...",
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "dataUrl": "data:image/png;base64,iVBORw0K...",
  "expiresAt": "2026-09-15T08:45:00Z"
}
```

#### POST /check-in/submit
Submit check-in for event.

**Request:**
```json
{
  "qrCodeId": "clx...",
  "eventId": "clx..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Check-in successful",
  "checkInId": "clx...",
  "hasConflict": false,
  "conflictDetails": null
}
```

---

### Points & Leaderboard

#### GET /points/balance
Get current user's points balance.

**Response:** `200 OK`
```json
{
  "pointsBalance": 150
}
```

#### GET /points/leaderboard
Get global leaderboard.

**Query Parameters:**
- `page` (int, default: 1)
- `pageSize` (int, default: 50)

**Response:** `200 OK`
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "studentId": "clx...",
      "name": "Jane Smith",
      "totalPoints": 500,
      "eventsAttended": 15,
      "department": "CSE"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 250,
    "pages": 5
  }
}
```

---

### Admin

#### GET /admin/pending-registrations
Get pending student registrations (ADMIN only).

**Response:** `200 OK`
```json
{
  "students": [
    {
      "id": "clx...",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isApproved": false,
      "studentProfile": {
        "rollNumber": "CS001",
        "department": "CSE",
        "semester": 3
      }
    }
  ],
  "pagination": { ... }
}
```

#### POST /admin/approve-student/:id
Approve student registration (ADMIN only).

**Response:** `200 OK`
```json
{
  "message": "Student approved",
  "student": { ... }
}
```

#### POST /admin/timetable/import
Import timetable from Excel file (ADMIN only).

**Request:** multipart/form-data
- `file`: Excel file

**Response:** `200 OK`
```json
{
  "message": "Timetable imported successfully",
  "imported": 45,
  "skipped": 2,
  "total": 47
}
```

---

## Rate Limiting

All endpoints are rate-limited:
- Window: 15 minutes
- Limit: 100 requests
- Lockout: 15 minutes after exceeding limit

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Server Error |

---

**Version:** 1.0
**Last Updated:** 2026-09-01
