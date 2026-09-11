# Database Schema Documentation

## Users Table
Stores all users in the system (students, faculty, admin, moderators).

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| email | String | Unique email address |
| passwordHash | String | Bcrypt hashed password |
| firstName | String | User's first name |
| lastName | String | User's last name |
| phone | String | Contact phone number |
| role | Enum | STUDENT, FACULTY, MOD, ADMIN |
| isActive | Boolean | Account active status |
| isApproved | Boolean | Admin approval status |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- email (UNIQUE)
- role
- isApproved

## StudentProfile Table
Extended profile information for students.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String (FK) | Reference to users |
| rollNumber | String | Unique roll number |
| department | String | Department code (CSE, ECE, etc.) |
| semester | Integer | Current semester (1-4) |
| profilePictureUrl | String | URL to profile picture |
| pointsBalance | Integer | Current points balance |
| createdAt | DateTime | Profile creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- rollNumber (UNIQUE)
- department
- userId (UNIQUE)

## FacultyProfile Table
Profile information for faculty members.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String (FK) | Reference to users |
| specialization | String | Area of specialization |
| telegramChatId | String | Telegram chat ID for notifications |
| department | String | Faculty department |
| createdAt | DateTime | Profile creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- userId (UNIQUE)
- telegramChatId

## Events Table
Stores event information.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Event name |
| description | String | Event description |
| date | DateTime | Event date |
| startTime | String | Start time (HH:MM) |
| endTime | String | End time (HH:MM) |
| location | String | Event location/room |
| category | String | Event category |
| capacity | Integer | Maximum attendees |
| currentRegistrations | Integer | Current registration count |
| organizerId | String (FK) | Event organizer |
| facultyCoordinatorId | String | Faculty coordinator |
| basePoints | Integer | Points awarded for attendance |
| registrationOpenDate | DateTime | Registration opens |
| registrationCloseDate | DateTime | Registration closes |
| isActive | Boolean | Event active status |
| createdAt | DateTime | Event creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- date
- category
- isActive

## CheckIn Table
Attendance check-in records.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| eventId | String (FK) | Reference to event |
| hackathonId | String (FK) | Reference to hackathon |
| studentId | String (FK) | Reference to student |
| timestamp | DateTime | Check-in timestamp |
| qrCodeId | String (FK) | QR code scanned |
| hasConflict | Boolean | Timetable conflict flag |
| conflictDetails | String | Conflict description |
| createdAt | DateTime | Record creation timestamp |

**Indexes:**
- eventId
- studentId
- timestamp
- Unique(eventId, studentId)

## AttendanceRequest Table
Faculty attendance approval requests.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| eventId | String (FK) | Reference to event |
| facultyId | String (FK) | Faculty member |
| groupedStudents | String (JSON) | Array of student data |
| status | Enum | PENDING, APPROVED, REJECTED |
| telegramMessageId | String | Telegram message reference |
| createdAt | DateTime | Request creation timestamp |
| approvedAt | DateTime | Approval timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- eventId
- facultyId
- status

## PointsTransaction Tableno
Points allocation history.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| studentId | String (FK) | Reference to student |
| pointsDelta | Integer | Points added/removed |
| reason | String | Transaction reason |
| relatedEventId | String (FK) | Related event |
| relatedCheckInId | String | Related check-in |
| approvedBy | String | Approved by admin |
| status | Enum | PENDING, APPROVED, REJECTED |
| createdAt | DateTime | Transaction timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- studentId
- status
- createdAt

## TimetableEntry Table
Student timetable entries.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| date | String | Class date (YYYY-MM-DD) |
| startTime | String | Start time (HH:MM) |
| endTime | String | End time (HH:MM) |
| facultyId | String (FK) | Faculty member |
| subject | String | Subject name |
| room | String | Room/classroom number |
| department | String | Department code |
| year | Integer | Year/semester |
| timetableSetId | String | Timetable version |
| createdAt | DateTime | Entry creation timestamp |

**Indexes:**
- date
- facultyId
- department
- year

## LeaderboardCache Table
Cached leaderboard rankings.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| studentId | String (UNIQUE) | Reference to student |
| rank | Integer | Leaderboard rank |
| totalPoints | Integer | Total points |
| eventsAttended | Integer | Events attended count |
| updatedAt | DateTime | Last update timestamp |

## AuditLog Table
System audit trail.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String (FK) | User performing action |
| actionType | String | Action type |
| resourceType | String | Resource affected |
| resourceId | String | Resource ID |
| oldValue | String (JSON) | Previous value |
| newValue | String (JSON) | New value |
| ipAddress | String | Request IP |
| status | String | SUCCESS/FAILURE |
| reason | String | Failure reason |
| createdAt | DateTime | Log timestamp |

**Indexes:**
- userId
- actionType
- createdAt

## Relationships

```
User (1) ---> (0..*) EventRegistration
User (1) ---> (0..*) CheckIn
User (1) ---> (0..*) PointsTransaction
User (1) ---> (1) StudentProfile
User (1) ---> (1) FacultyProfile

Event (1) ---> (0..*) EventRegistration
Event (1) ---> (0..*) CheckIn
Event (1) ---> (0..*) AttendanceRequest
Event (1) ---> (0..*) PointsTransaction

Hackathon (1) ---> (0..*) HackathonTeam
Hackathon (1) ---> (0..*) CheckIn

TimetableEntry (*) ---> (1) FacultyProfile

AttendanceRequest (1) ---> (1) Event
AttendanceRequest (1) ---> (1) User (Faculty)
```

---

**Database Version:** 1.0
**Last Updated:** 2026-09-01
