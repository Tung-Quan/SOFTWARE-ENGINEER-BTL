# Backend Models & Functions Specification

## 📋 Tổng quan

Tài liệu này định nghĩa **đầy đủ các Model classes** và **functions** cần implement cho Backend API, dựa trên phân tích toàn bộ frontend codebase. Mỗi model được thiết kế theo format giống **AuthToken** class diagram với đầy đủ attributes, types và methods.

---

## 🎯 Model Architecture

```
Models Layer (Database Entities)
    ↓
Services Layer (Business Logic)
    ↓
Controllers Layer (API Endpoints)
    ↓
DTOs (Data Transfer Objects)
```

---

## 📦 Core Models

### 1. **User Model**

```typescript
class User {
  // Primary Key
  userId: string

  // Authentication
  email: string
  passwordHash: string
  googleId: string | null
  appleId: string | null

  // Personal Information
  firstName: string | null
  lastName: string | null
  picture: string | null
  phone: string | null
  address: string | null
  dateOfBirth: Date | null
  highSchool: string | null

  // Role Flags (RBAC)
  isStudent: boolean
  isTutor: boolean
  isCoordinator: boolean
  isManager: boolean
  isChairman: boolean
  statisticalPermission: boolean

  // Social Media
  socialMedia: {
    facebookUrl?: string
    facebookName?: string
  } | null

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  // Methods
  + create(data: CreateUserDto): Promise<User>
  + findById(userId: string): Promise<User | null>
  + findByEmail(email: string): Promise<User | null>
  + findByGoogleId(googleId: string): Promise<User | null>
  + findAll(filter: UserFilterDto): Promise<User[]>
  + update(userId: string, data: UpdateUserDto): Promise<User>
  + softDelete(userId: string): Promise<void>
  + restore(userId: string): Promise<User>
  + updateRoles(userId: string, roles: UpdateRolesDto): Promise<User>
  + verifyPassword(plainPassword: string): Promise<boolean>
  + hashPassword(plainPassword: string): Promise<string>
  + hasRole(role: UserRole): boolean
  + getFullName(): string
}
```

**DTOs:**
```typescript
interface CreateUserDto {
  email: string
  password?: string
  googleId?: string
  appleId?: string
  firstName?: string
  lastName?: string
  picture?: string
  roles: {
    isStudent?: boolean
    isTutor?: boolean
    isCoordinator?: boolean
    isManager?: boolean
    isChairman?: boolean
  }
}

interface UpdateUserDto {
  firstName?: string
  lastName?: string
  picture?: string
  phone?: string
  address?: string
  dateOfBirth?: Date
  highSchool?: string
  socialMedia?: {
    facebookUrl?: string
    facebookName?: string
  }
}

interface UpdateRolesDto {
  isStudent?: boolean
  isTutor?: boolean
  isCoordinator?: boolean
  isManager?: boolean
  isChairman?: boolean
  statisticalPermission?: boolean
}

interface UserFilterDto {
  role?: UserRole
  search?: string
  page?: number
  limit?: number
}

enum UserRole {
  STUDENT = 'student',
  TUTOR = 'tutor',
  COORDINATOR = 'coordinator',
  MANAGER = 'manager',
  CHAIRMAN = 'chairman'
}
```

---

### 2. **AuthToken Model**

```typescript
class AuthToken {
  // Primary Key
  tokenId: string

  // Foreign Key
  userId: string

  // Token Data
  token: string
  refreshToken: string
  expiresAt: Date
  refreshTokenExpiresAt: Date

  // Token Type
  tokenType: TokenType

  // Audit Fields
  createdAt: Date
  isRevoked: boolean
  revokedAt: Date | null
  ipAddress: string | null
  userAgent: string | null

  // Methods
  + create(userId: string, tokenData: CreateTokenDto): Promise<AuthToken>
  + findByToken(token: string): Promise<AuthToken | null>
  + findByUserId(userId: string): Promise<AuthToken[]>
  + verifyToken(token: string): Promise<TokenPayload>
  + refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }>
  + revokeToken(tokenId: string): Promise<void>
  + revokeAllUserTokens(userId: string): Promise<void>
  + cleanupExpiredTokens(): Promise<number>
  + isValid(): boolean
  + isExpired(): boolean
}

enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'reset_password',
  EMAIL_VERIFICATION = 'email_verification'
}

interface CreateTokenDto {
  token: string
  refreshToken: string
  expiresAt: Date
  refreshTokenExpiresAt: Date
  tokenType: TokenType
  ipAddress?: string
  userAgent?: string
}

interface TokenPayload {
  userId: string
  email: string
  roles: string[]
  iat: number
  exp: number
}
```

---

### 3. **Registration Model**

```typescript
class Registration {
  // Primary Key
  registrationId: string

  // Foreign Keys
  userId: string
  courseId: string
  classroomId: string | null

  // Registration Details
  language: Language
  sessionMethod: SessionMethod
  location: string | null
  specialRequire: string

  // Status & Response
  status: RegistrationStatus
  declineReason: string | null
  coordinatorNote: string | null

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  approvedAt: Date | null
  approvedBy: string | null

  // Relations
  user: User
  course: Course
  classroom: Classroom | null

  // Methods
  + create(data: CreateRegistrationDto): Promise<Registration>
  + findById(registrationId: string): Promise<Registration | null>
  + findByUserId(userId: string, filter?: RegistrationFilterDto): Promise<Registration[]>
  + findByCourseId(courseId: string, filter?: RegistrationFilterDto): Promise<Registration[]>
  + findPending(): Promise<Registration[]>
  + update(registrationId: string, data: UpdateRegistrationDto): Promise<Registration>
  + approve(registrationId: string, data: ApproveRegistrationDto): Promise<Registration>
  + decline(registrationId: string, reason: string): Promise<Registration>
  + cancel(registrationId: string): Promise<Registration>
  + canEdit(): boolean
  + canApprove(userId: string): boolean
  + canCancel(userId: string): boolean
}

enum RegistrationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  CANCELLED = 'cancelled'
}

enum Language {
  VIETNAMESE = 'vietnamese',
  ENGLISH = 'english',
  CHINESE = 'chinese',
  THAI = 'thai'
}

enum SessionMethod {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid'
}

interface CreateRegistrationDto {
  userId: string
  courseId: string
  language: Language
  sessionMethod: SessionMethod
  location?: string
  specialRequire: string
}

interface UpdateRegistrationDto {
  language?: Language
  sessionMethod?: SessionMethod
  location?: string
  specialRequire?: string
}

interface ApproveRegistrationDto {
  tutorId?: string
  classroomId?: string
  coordinatorNote?: string
}

interface RegistrationFilterDto {
  status?: RegistrationStatus
  language?: Language
  sessionMethod?: SessionMethod
  startDate?: Date
  endDate?: Date
}
```

---

### 4. **Course Model**

```typescript
class Course {
  // Primary Key
  courseId: string

  // Course Information
  courseCode: string
  courseName: string
  description: string

  // Foreign Keys
  coordinatorId: string

  // Settings
  languages: Language[]
  bgImage: string | null

  // Statistics (Aggregated)
  stats: {
    documents: number
    links: number
    assignments: number
    sessionsOrganized: number
  }

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null

  // Relations
  coordinator: User
  classrooms: Classroom[]
  registrations: Registration[]

  // Methods
  + create(data: CreateCourseDto): Promise<Course>
  + findById(courseId: string): Promise<Course | null>
  + findByCode(courseCode: string): Promise<Course | null>
  + findAll(filter?: CourseFilterDto): Promise<Course[]>
  + findByCoordinator(coordinatorId: string): Promise<Course[]>
  + update(courseId: string, data: UpdateCourseDto): Promise<Course>
  + delete(courseId: string): Promise<void>
  + archive(courseId: string): Promise<Course>
  + restore(courseId: string): Promise<Course>
  + getStatistics(courseId: string): Promise<CourseStatistics>
  + updateStatistics(courseId: string): Promise<void>
  + canEdit(userId: string): boolean
  + canDelete(userId: string): boolean
}

interface CreateCourseDto {
  courseCode: string
  courseName: string
  description: string
  coordinatorId: string
  languages: Language[]
  bgImage?: string
}

interface UpdateCourseDto {
  courseName?: string
  description?: string
  languages?: Language[]
  bgImage?: string
}

interface CourseFilterDto {
  search?: string
  coordinatorId?: string
  language?: Language
  archived?: boolean
  page?: number
  limit?: number
}

interface CourseStatistics {
  totalStudents: number
  activeClassrooms: number
  completedClassrooms: number
  totalMaterials: number
  totalAssignments: number
  totalSessions: number
  averageRating: number
}
```

---

### 5. **Classroom Model**

```typescript
class Classroom {
  // Primary Key
  classroomId: string

  // Foreign Keys
  courseId: string
  tutorId: string

  // Classroom Info
  classroomName: string | null
  description: string | null

  // Participants
  studentIds: string[]
  maxStudents: number

  // Status & Timeline
  status: ClassroomStatus
  startDate: Date
  endDate: Date

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null

  // Relations
  course: Course
  tutor: User
  students: User[]
  materials: Material[]
  assignments: Assignment[]
  sessions: Session[]

  // Methods
  + create(data: CreateClassroomDto): Promise<Classroom>
  + findById(classroomId: string): Promise<Classroom | null>
  + findByCourseId(courseId: string, filter?: ClassroomFilterDto): Promise<Classroom[]>
  + findByTutorId(tutorId: string): Promise<Classroom[]>
  + findByStudentId(studentId: string): Promise<Classroom[]>
  + update(classroomId: string, data: UpdateClassroomDto): Promise<Classroom>
  + enrollStudent(classroomId: string, studentId: string): Promise<void>
  + removeStudent(classroomId: string, studentId: string): Promise<void>
  + close(classroomId: string): Promise<Classroom>
  + archive(classroomId: string): Promise<Classroom>
  + getProgress(classroomId: string): Promise<ClassroomProgress>
  + canEnroll(): boolean
  + isFull(): boolean
  + canEdit(userId: string): boolean
}

enum ClassroomStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  CANCELLED = 'cancelled'
}

interface CreateClassroomDto {
  courseId: string
  tutorId: string
  classroomName?: string
  description?: string
  studentIds?: string[]
  maxStudents?: number
  startDate: Date
  endDate: Date
}

interface UpdateClassroomDto {
  classroomName?: string
  description?: string
  maxStudents?: number
  endDate?: Date
  status?: ClassroomStatus
}

interface ClassroomFilterDto {
  status?: ClassroomStatus
  tutorId?: string
  startDate?: Date
  endDate?: Date
}

interface ClassroomProgress {
  totalSessions: number
  completedSessions: number
  totalAssignments: number
  completedAssignments: number
  averageAttendanceRate: number
  progressPercentage: number
}
```

---

### 6. **Material Model**

```typescript
class Material {
  // Primary Key
  materialId: string

  // Foreign Keys
  classroomId: string
  uploaderId: string

  // File Information
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  description: string

  // Metadata
  downloadCount: number

  // Audit Fields
  uploadedAt: Date
  updatedAt: Date
  deletedAt: Date | null

  // Relations
  classroom: Classroom
  uploader: User

  // Methods
  + create(data: CreateMaterialDto, file: Express.Multer.File): Promise<Material>
  + findById(materialId: string): Promise<Material | null>
  + findByClassroomId(classroomId: string): Promise<Material[]>
  + update(materialId: string, data: UpdateMaterialDto): Promise<Material>
  + delete(materialId: string): Promise<void>
  + getDownloadUrl(materialId: string): Promise<string>
  + incrementDownloadCount(materialId: string): Promise<void>
  + canEdit(userId: string): boolean
  + canDelete(userId: string): boolean
}

interface CreateMaterialDto {
  classroomId: string
  uploaderId: string
  description: string
}

interface UpdateMaterialDto {
  description?: string
}
```

---

### 7. **Assignment Model**

```typescript
class Assignment {
  // Primary Key
  assignmentId: string

  // Foreign Keys
  classroomId: string
  tutorId: string

  // Assignment Details
  title: string
  description: string
  instructions: string
  deadline: Date
  maxScore: number
  status: AssignmentStatus

  // File Requirements
  maxFiles: number
  allowedFileTypes: string[]

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  closedAt: Date | null

  // Relations
  classroom: Classroom
  tutor: User
  submissions: Submission[]

  // Methods
  + create(data: CreateAssignmentDto): Promise<Assignment>
  + findById(assignmentId: string): Promise<Assignment | null>
  + findByClassroomId(classroomId: string, filter?: AssignmentFilterDto): Promise<Assignment[]>
  + update(assignmentId: string, data: UpdateAssignmentDto): Promise<Assignment>
  + delete(assignmentId: string): Promise<void>
  + publish(assignmentId: string): Promise<Assignment>
  + close(assignmentId: string): Promise<Assignment>
  + extendDeadline(assignmentId: string, newDeadline: Date): Promise<Assignment>
  + getSubmissions(assignmentId: string): Promise<Submission[]>
  + getSubmissionStats(assignmentId: string): Promise<AssignmentStats>
  + isLate(submittedAt: Date): boolean
  + canEdit(userId: string): boolean
  + canDelete(userId: string): boolean
}

enum AssignmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  EXTENDED = 'extended'
}

interface CreateAssignmentDto {
  classroomId: string
  tutorId: string
  title: string
  description: string
  instructions: string
  deadline: Date
  maxScore: number
  maxFiles?: number
  allowedFileTypes?: string[]
}

interface UpdateAssignmentDto {
  title?: string
  description?: string
  instructions?: string
  deadline?: Date
  maxScore?: number
  maxFiles?: number
  allowedFileTypes?: string[]
}

interface AssignmentFilterDto {
  status?: AssignmentStatus
  startDate?: Date
  endDate?: Date
}

interface AssignmentStats {
  totalSubmissions: number
  gradedSubmissions: number
  lateSubmissions: number
  averageGrade: number
  submissionRate: number
}
```

---

### 8. **Submission Model**

```typescript
class Submission {
  // Primary Key
  submissionId: string

  // Foreign Keys
  assignmentId: string
  studentId: string

  // Submission Details
  filePath: string
  fileName: string
  fileSize: number

  // Grading
  grade: number | null
  tutorComment: string | null
  status: SubmissionStatus

  // Audit Fields
  submittedAt: Date
  gradedAt: Date | null
  updatedAt: Date

  // Relations
  assignment: Assignment
  student: User

  // Methods
  + create(data: CreateSubmissionDto, file: Express.Multer.File): Promise<Submission>
  + findById(submissionId: string): Promise<Submission | null>
  + findByAssignmentId(assignmentId: string): Promise<Submission[]>
  + findByStudentId(studentId: string, filter?: SubmissionFilterDto): Promise<Submission[]>
  + findByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<Submission | null>
  + update(submissionId: string, file: Express.Multer.File): Promise<Submission>
  + grade(submissionId: string, data: GradeSubmissionDto): Promise<Submission>
  + addComment(submissionId: string, comment: string): Promise<Submission>
  + getDownloadUrl(submissionId: string): Promise<string>
  + isLate(): boolean
  + canResubmit(): boolean
  + canGrade(userId: string): boolean
}

enum SubmissionStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  LATE = 'late',
  RESUBMITTED = 'resubmitted'
}

interface CreateSubmissionDto {
  assignmentId: string
  studentId: string
}

interface GradeSubmissionDto {
  grade: number
  tutorComment?: string
}

interface SubmissionFilterDto {
  status?: SubmissionStatus
  graded?: boolean
  late?: boolean
}
```

---

### 9. **Session Model**

```typescript
class Session {
  // Primary Key
  sessionId: string

  // Foreign Keys
  classroomId: string
  tutorId: string

  // Session Details
  title: string
  description: string
  startTime: Date
  endTime: Date

  // Session Type
  sessionType: SessionType
  location: string | null
  meetingLink: string | null

  // Status
  status: SessionStatus
  cancelReason: string | null

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null

  // Relations
  classroom: Classroom
  tutor: User
  attendanceRecords: AttendanceRecord[]
  sessionNote: SessionNote | null
  sessionRequests: SessionRequest[]

  // Methods
  + create(data: CreateSessionDto): Promise<Session>
  + findById(sessionId: string): Promise<Session | null>
  + findByClassroomId(classroomId: string, filter?: SessionFilterDto): Promise<Session[]>
  + findByTutorId(tutorId: string, filter?: SessionFilterDto): Promise<Session[]>
  + update(sessionId: string, data: UpdateSessionDto): Promise<Session>
  + cancel(sessionId: string, reason: string): Promise<Session>
  + complete(sessionId: string): Promise<Session>
  + reschedule(sessionId: string, data: RescheduleSessionDto): Promise<Session>
  + markAttendance(sessionId: string, data: MarkAttendanceDto): Promise<AttendanceRecord>
  + getAttendanceRate(sessionId: string): Promise<number>
  + canEdit(userId: string): boolean
  + canCancel(userId: string): boolean
  + canComplete(userId: string): boolean
}

enum SessionType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid'
}

enum SessionStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

interface CreateSessionDto {
  classroomId: string
  tutorId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  sessionType: SessionType
  location?: string
  meetingLink?: string
}

interface UpdateSessionDto {
  title?: string
  description?: string
  startTime?: Date
  endTime?: Date
  location?: string
  meetingLink?: string
}

interface RescheduleSessionDto {
  newStartTime: Date
  newEndTime: Date
  reason?: string
}

interface MarkAttendanceDto {
  studentId: string
  isPresent: boolean
  reason?: string
}

interface SessionFilterDto {
  status?: SessionStatus
  sessionType?: SessionType
  startDate?: Date
  endDate?: Date
}
```

---

### 10. **SessionRequest Model**

```typescript
class SessionRequest {
  // Primary Key
  requestId: string

  // Foreign Keys
  studentId: string
  classroomId: string
  sessionId: string | null

  // Request Details
  requestType: RequestType
  reason: string

  // Status & Response
  status: RequestStatus
  tutorResponse: string | null

  // Audit Fields
  requestedAt: Date
  respondedAt: Date | null
  updatedAt: Date

  // Relations
  student: User
  classroom: Classroom
  session: Session | null

  // Methods
  + create(data: CreateSessionRequestDto): Promise<SessionRequest>
  + findById(requestId: string): Promise<SessionRequest | null>
  + findByClassroomId(classroomId: string, filter?: SessionRequestFilterDto): Promise<SessionRequest[]>
  + findByStudentId(studentId: string): Promise<SessionRequest[]>
  + findPending(): Promise<SessionRequest[]>
  + approve(requestId: string, response: string): Promise<SessionRequest>
  + reject(requestId: string, response: string): Promise<SessionRequest>
  + cancel(requestId: string): Promise<SessionRequest>
  + canModify(userId: string): boolean
  + canRespond(userId: string): boolean
}

enum RequestType {
  NEW = 'new',
  MAKEUP = 'makeup',
  ABSENT = 'absent',
  RESCHEDULE = 'reschedule'
}

enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

interface CreateSessionRequestDto {
  studentId: string
  classroomId: string
  sessionId?: string
  requestType: RequestType
  reason: string
}

interface SessionRequestFilterDto {
  status?: RequestStatus
  requestType?: RequestType
  startDate?: Date
  endDate?: Date
}
```

---

### 11. **SessionNote Model**

```typescript
class SessionNote {
  // Primary Key
  noteId: string

  // Foreign Keys (Unique constraint on sessionId)
  sessionId: string
  tutorId: string

  // Content
  content: string
  filePath: string | null

  // Audit Fields
  createdAt: Date
  updatedAt: Date

  // Relations
  session: Session
  tutor: User
  attendanceRecords: AttendanceRecord[]

  // Methods
  + create(data: CreateSessionNoteDto): Promise<SessionNote>
  + findById(noteId: string): Promise<SessionNote | null>
  + findBySessionId(sessionId: string): Promise<SessionNote | null>
  + update(noteId: string, data: UpdateSessionNoteDto): Promise<SessionNote>
  + delete(noteId: string): Promise<void>
  + getAttendanceList(noteId: string): Promise<AttendanceRecord[]>
  + canEdit(userId: string): boolean
  + canDelete(userId: string): boolean
}

interface CreateSessionNoteDto {
  sessionId: string
  tutorId: string
  content: string
  filePath?: string
}

interface UpdateSessionNoteDto {
  content?: string
  filePath?: string
}
```

---

### 12. **AttendanceRecord Model**

```typescript
class AttendanceRecord {
  // Primary Key
  recordId: string

  // Foreign Keys
  studentId: string
  sessionId: string

  // Attendance Details
  isPresent: boolean
  reason: string | null

  // Audit Fields
  recordedAt: Date
  updatedAt: Date

  // Relations
  student: User
  session: Session

  // Methods
  + create(data: CreateAttendanceDto): Promise<AttendanceRecord>
  + findById(recordId: string): Promise<AttendanceRecord | null>
  + findBySessionId(sessionId: string): Promise<AttendanceRecord[]>
  + findByStudentId(studentId: string, filter?: AttendanceFilterDto): Promise<AttendanceRecord[]>
  + findBySessionAndStudent(sessionId: string, studentId: string): Promise<AttendanceRecord | null>
  + update(recordId: string, data: UpdateAttendanceDto): Promise<AttendanceRecord>
  + getAttendanceRate(studentId: string, classroomId: string): Promise<number>
}

interface CreateAttendanceDto {
  studentId: string
  sessionId: string
  isPresent: boolean
  reason?: string
}

interface UpdateAttendanceDto {
  isPresent?: boolean
  reason?: string
}

interface AttendanceFilterDto {
  classroomId?: string
  startDate?: Date
  endDate?: Date
}
```

---

### 13. **TutorRating Model**

```typescript
class TutorRating {
  // Primary Key
  ratingId: string

  // Foreign Keys
  studentId: string
  tutorId: string
  classroomId: string
  sessionId: string | null

  // Ratings (1-5 scale)
  criteriaRatings: {
    teaching: number
    communication: number
    punctuality: number
    helpfulness: number
    expertise: number
  }

  // Overall
  overallScore: number
  comment: string

  // Audit Fields
  createdAt: Date
  updatedAt: Date

  // Relations
  student: User
  tutor: User
  classroom: Classroom
  session: Session | null

  // Methods
  + create(data: CreateTutorRatingDto): Promise<TutorRating>
  + findById(ratingId: string): Promise<TutorRating | null>
  + findByTutorId(tutorId: string, filter?: RatingFilterDto): Promise<TutorRating[]>
  + findByClassroomId(classroomId: string): Promise<TutorRating[]>
  + findByStudentId(studentId: string): Promise<TutorRating[]>
  + update(ratingId: string, data: UpdateTutorRatingDto): Promise<TutorRating>
  + delete(ratingId: string): Promise<void>
  + calculateOverall(): number
  + getAverageRating(tutorId: string): Promise<number>
  + getTutorStatistics(tutorId: string): Promise<TutorRatingStats>
  + canEdit(userId: string): boolean
}

interface CreateTutorRatingDto {
  studentId: string
  tutorId: string
  classroomId: string
  sessionId?: string
  criteriaRatings: {
    teaching: number
    communication: number
    punctuality: number
    helpfulness: number
    expertise: number
  }
  comment: string
}

interface UpdateTutorRatingDto {
  criteriaRatings?: {
    teaching?: number
    communication?: number
    punctuality?: number
    helpfulness?: number
    expertise?: number
  }
  comment?: string
}

interface RatingFilterDto {
  minRating?: number
  maxRating?: number
  startDate?: Date
  endDate?: Date
}

interface TutorRatingStats {
  averageOverall: number
  totalRatings: number
  averageTeaching: number
  averageCommunication: number
  averagePunctuality: number
  averageHelpfulness: number
  averageExpertise: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}
```

---

### 14. **ClassFeedback Model**

```typescript
class ClassFeedback {
  // Primary Key
  feedbackId: string

  // Foreign Keys
  tutorId: string
  classroomId: string

  // Feedback Content
  overallPerformance: string
  strengths: string
  areasForImprovement: string
  suggestions: string
  performanceScore: number

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null

  // Relations
  tutor: User
  classroom: Classroom

  // Methods
  + create(data: CreateClassFeedbackDto): Promise<ClassFeedback>
  + findById(feedbackId: string): Promise<ClassFeedback | null>
  + findByClassroomId(classroomId: string): Promise<ClassFeedback[]>
  + findByTutorId(tutorId: string): Promise<ClassFeedback[]>
  + update(feedbackId: string, data: UpdateClassFeedbackDto): Promise<ClassFeedback>
  + archive(feedbackId: string): Promise<ClassFeedback>
  + canEdit(userId: string): boolean
}

interface CreateClassFeedbackDto {
  tutorId: string
  classroomId: string
  overallPerformance: string
  strengths: string
  areasForImprovement: string
  suggestions: string
  performanceScore: number
}

interface UpdateClassFeedbackDto {
  overallPerformance?: string
  strengths?: string
  areasForImprovement?: string
  suggestions?: string
  performanceScore?: number
}
```

---

### 15. **ChatChannel Model**

```typescript
class ChatChannel {
  // Primary Key
  channelId: string

  // Channel Information
  channelName: string
  classroomId: string | null
  channelType: ChannelType
  description: string
  isGroup: boolean

  // Participants
  participantIds: string[]

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null

  // Relations
  classroom: Classroom | null
  participants: User[]
  messages: Message[]

  // Methods
  + create(data: CreateChatChannelDto): Promise<ChatChannel>
  + findById(channelId: string): Promise<ChatChannel | null>
  + findByUserId(userId: string): Promise<ChatChannel[]>
  + findByClassroomId(classroomId: string): Promise<ChatChannel | null>
  + update(channelId: string, data: UpdateChatChannelDto): Promise<ChatChannel>
  + addParticipant(channelId: string, userId: string): Promise<void>
  + removeParticipant(channelId: string, userId: string): Promise<void>
  + archive(channelId: string): Promise<ChatChannel>
  + getMessages(channelId: string, limit: number, before?: Date): Promise<Message[]>
  + canEdit(userId: string): boolean
  + isParticipant(userId: string): boolean
}

enum ChannelType {
  DIRECT_MESSAGE = 'direct_message',
  GROUP_CHAT = 'group_chat',
  CLASSROOM_CHAT = 'classroom_chat',
  DEPARTMENT_CHAT = 'department_chat'
}

interface CreateChatChannelDto {
  channelName: string
  classroomId?: string
  channelType: ChannelType
  description?: string
  participantIds: string[]
  isGroup?: boolean
}

interface UpdateChatChannelDto {
  channelName?: string
  description?: string
}
```

---

### 16. **Message Model**

```typescript
class Message {
  // Primary Key
  messageId: string

  // Foreign Keys
  channelId: string
  senderId: string

  // Message Content
  content: string
  attachments: string[]
  messageType: MessageType

  // Status
  isEdited: boolean
  isDeleted: boolean

  // Audit Fields
  timestamp: Date
  editedAt: Date | null

  // Relations
  channel: ChatChannel
  sender: User

  // Methods
  + create(data: CreateMessageDto): Promise<Message>
  + findById(messageId: string): Promise<Message | null>
  + findByChannelId(channelId: string, filter?: MessageFilterDto): Promise<Message[]>
  + update(messageId: string, content: string): Promise<Message>
  + delete(messageId: string): Promise<Message>
  + react(messageId: string, emoji: string, userId: string): Promise<void>
  + getAttachments(messageId: string): Promise<string[]>
  + canEdit(userId: string): boolean
  + canDelete(userId: string): boolean
}

enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  LINK = 'link',
  SYSTEM = 'system'
}

interface CreateMessageDto {
  channelId: string
  senderId: string
  content: string
  attachments?: string[]
  messageType?: MessageType
}

interface MessageFilterDto {
  limit?: number
  before?: Date
  after?: Date
  senderId?: string
}
```

---

### 17. **Notification Model**

```typescript
class Notification {
  // Primary Key
  notificationId: string

  // Foreign Keys
  recipientId: string
  senderId: string | null

  // Notification Content
  title: string
  content: string
  notificationType: NotificationType
  link: string | null
  metadata: Record<string, any> | null

  // Status
  isRead: boolean

  // Audit Fields
  createdAt: Date
  readAt: Date | null

  // Relations
  recipient: User
  sender: User | null

  // Methods
  + create(data: CreateNotificationDto): Promise<Notification>
  + findById(notificationId: string): Promise<Notification | null>
  + findByRecipientId(recipientId: string, filter?: NotificationFilterDto): Promise<Notification[]>
  + markAsRead(notificationId: string): Promise<Notification>
  + markAllAsRead(recipientId: string): Promise<number>
  + delete(notificationId: string): Promise<void>
  + getUnreadCount(recipientId: string): Promise<number>
  + sendBulk(data: BulkNotificationDto): Promise<Notification[]>
}

enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
  ASSIGNMENT = 'assignment',
  SESSION = 'session',
  RATING = 'rating',
  MESSAGE = 'message',
  REGISTRATION = 'registration'
}

interface CreateNotificationDto {
  recipientId: string
  senderId?: string
  title: string
  content: string
  notificationType: NotificationType
  link?: string
  metadata?: Record<string, any>
}

interface BulkNotificationDto {
  recipientIds: string[]
  title: string
  content: string
  notificationType: NotificationType
  link?: string
  metadata?: Record<string, any>
}

interface NotificationFilterDto {
  isRead?: boolean
  notificationType?: NotificationType
  limit?: number
  startDate?: Date
  endDate?: Date
}
```

---

### 18. **Book Model** (Library Integration)

```typescript
class Book {
  // Primary Key
  bookId: string

  // Book Information
  title: string
  author: string
  publisher: string | null
  year: string | null
  isbn: string | null

  // Media
  coverImage: string | null
  description: string | null

  // Availability
  availability: BookAvailability
  location: string | null
  callNumber: string | null

  // External Source
  ebscoId: string | null

  // Audit Fields
  createdAt: Date
  updatedAt: Date

  // Methods
  + create(data: CreateBookDto): Promise<Book>
  + findById(bookId: string): Promise<Book | null>
  + findByIsbn(isbn: string): Promise<Book | null>
  + search(query: string, page: number, limit: number): Promise<BookSearchResponse>
  + update(bookId: string, data: UpdateBookDto): Promise<Book>
  + syncFromEBSCO(ebscoData: any): Promise<Book>
}

enum BookAvailability {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  RESERVED = 'reserved'
}

interface CreateBookDto {
  title: string
  author: string
  publisher?: string
  year?: string
  isbn?: string
  coverImage?: string
  description?: string
  availability?: BookAvailability
  location?: string
  callNumber?: string
  ebscoId?: string
}

interface UpdateBookDto {
  title?: string
  author?: string
  publisher?: string
  year?: string
  coverImage?: string
  description?: string
  availability?: BookAvailability
  location?: string
}

interface BookSearchResponse {
  books: Book[]
  total: number
  page: number
  hasMore: boolean
}
```

---

### 19. **CourseCreationRequest Model** (Coordinator)

```typescript
class CourseCreationRequest {
  // Primary Key
  requestId: string

  // Foreign Keys
  coordinatorId: string

  // Course Information
  courseName: string
  courseCode: string
  description: string

  // Settings
  languages: Language[]
  sessionTypes: SessionMethod[]
  locations: string[]
  meetLink: string | null

  // Time Slots
  timeSlots: Array<{
    id: string
    date: string
    time: string
  }>

  // Status
  status: CourseRequestStatus
  reviewNote: string | null

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  reviewedAt: Date | null
  reviewedBy: string | null

  // Relations
  coordinator: User
  reviewer: User | null

  // Methods
  + create(data: CreateCourseRequestDto): Promise<CourseCreationRequest>
  + findById(requestId: string): Promise<CourseCreationRequest | null>
  + findByCoordinatorId(coordinatorId: string): Promise<CourseCreationRequest[]>
  + findPending(): Promise<CourseCreationRequest[]>
  + update(requestId: string, data: UpdateCourseRequestDto): Promise<CourseCreationRequest>
  + approve(requestId: string, reviewNote?: string): Promise<CourseCreationRequest>
  + reject(requestId: string, reviewNote: string): Promise<CourseCreationRequest>
  + canEdit(userId: string): boolean
  + canReview(userId: string): boolean
}

enum CourseRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

interface CreateCourseRequestDto {
  coordinatorId: string
  courseName: string
  courseCode: string
  description: string
  languages: Language[]
  sessionTypes: SessionMethod[]
  locations: string[]
  meetLink?: string
  timeSlots?: Array<{
    id: string
    date: string
    time: string
  }>
}

interface UpdateCourseRequestDto {
  courseName?: string
  courseCode?: string
  description?: string
  languages?: Language[]
  sessionTypes?: SessionMethod[]
  locations?: string[]
  meetLink?: string
  timeSlots?: Array<{
    id: string
    date: string
    time: string
  }>
}
```

---

### 20. **TutorRegistration Model**

```typescript
class TutorRegistration {
  // Primary Key
  registrationId: string

  // Foreign Keys
  tutorId: string

  // Registration Details
  subjects: string[]
  languages: Language[]
  sessionTypes: SessionMethod[]
  locations: string[]
  meetLink: string | null
  specialRequest: string

  // Status
  status: TutorRegistrationStatus
  reviewNote: string | null

  // Audit Fields
  createdAt: Date
  updatedAt: Date
  reviewedAt: Date | null

  // Relations
  tutor: User

  // Methods
  + create(data: CreateTutorRegistrationDto): Promise<TutorRegistration>
  + findById(registrationId: string): Promise<TutorRegistration | null>
  + findByTutorId(tutorId: string): Promise<TutorRegistration[]>
  + findPending(): Promise<TutorRegistration[]>
  + update(registrationId: string, data: UpdateTutorRegistrationDto): Promise<TutorRegistration>
  + approve(registrationId: string, reviewNote?: string): Promise<TutorRegistration>
  + decline(registrationId: string, reviewNote: string): Promise<TutorRegistration>
  + canEdit(userId: string): boolean
}

enum TutorRegistrationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined'
}

interface CreateTutorRegistrationDto {
  tutorId: string
  subjects: string[]
  languages: Language[]
  sessionTypes: SessionMethod[]
  locations: string[]
  meetLink?: string
  specialRequest: string
}

interface UpdateTutorRegistrationDto {
  subjects?: string[]
  languages?: Language[]
  sessionTypes?: SessionMethod[]
  locations?: string[]
  meetLink?: string
  specialRequest?: string
}
```

---

## 🔧 Utility Models

### 21. **SystemMetrics Model** (Python Backend)

```python
class SystemMetrics:
    # Primary Key
    metric_id: str

    # Metrics Data
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    swap_usage: float

    # Detailed CPU
    cpu_detail: dict  # {"user": float, "system": float}

    # Detailed Memory (GB)
    mem_detail: dict  # {"totalGB": float, "usedGB": float}

    # Timestamp
    timestamp: datetime
    created_at: datetime

    # Methods
    def create(data: CreateSystemMetricsDto) -> SystemMetrics:
        """Create new metrics record"""
        pass

    def find_latest() -> SystemMetrics:
        """Get latest metrics"""
        pass

    def find_by_timerange(start: datetime, end: datetime) -> List[SystemMetrics]:
        """Get metrics in time range"""
        pass

    def get_current_stats() -> dict:
        """Get real-time system stats using psutil"""
        pass

    def cleanup_old_metrics(days: int = 7) -> int:
        """Delete metrics older than X days"""
        pass
```

---

## 📊 Service Layer Functions

### **AuthService**

```typescript
class AuthService {
  + register(data: RegisterDto): Promise<{ user: User; accessToken: string; refreshToken: string }>
  + login(data: LoginDto): Promise<{ user: User; accessToken: string; refreshToken: string }>
  + loginWithGoogle(credential: string): Promise<{ user: User; accessToken: string; refreshToken: string }>
  + loginWithApple(credential: string): Promise<{ user: User; accessToken: string; refreshToken: string }>
  + refreshToken(refreshToken: string): Promise<{ accessToken: string }>
  + logout(userId: string): Promise<void>
  + getCurrentUser(userId: string): Promise<User>
  + forgotPassword(email: string): Promise<void>
  + resetPassword(token: string, newPassword: string): Promise<void>
  + verifyEmail(token: string): Promise<User>
  + changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>
}

interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

interface LoginDto {
  email: string
  password: string
}
```

---

### **NotificationService**

```typescript
class NotificationService {
  + createNotification(data: CreateNotificationDto): Promise<Notification>
  + sendBulkNotification(data: BulkNotificationDto): Promise<Notification[]>
  + markAsRead(notificationId: string): Promise<Notification>
  + markAllAsRead(userId: string): Promise<number>
  + deleteNotification(notificationId: string): Promise<void>
  + getUnreadCount(userId: string): Promise<number>
  + getUserNotifications(userId: string, filter?: NotificationFilterDto): Promise<Notification[]>

  // Event Handlers (Automatic notifications)
  + onAssignmentPublished(assignment: Assignment): Promise<void>
  + onAssignmentDeadlineReminder(assignment: Assignment): Promise<void>
  + onSessionScheduled(session: Session): Promise<void>
  + onSessionCancelled(session: Session): Promise<void>
  + onNewRating(rating: TutorRating): Promise<void>
  + onRegistrationApproved(registration: Registration): Promise<void>
  + onRegistrationDeclined(registration: Registration): Promise<void>
  + onNewMessage(message: Message): Promise<void>
}
```

---

### **StatisticsService**

```typescript
class StatisticsService {
  + getOverviewStatistics(): Promise<OverviewStatistics>
  + getCourseStatistics(courseId: string): Promise<CourseStatistics>
  + getTutorStatistics(tutorId: string): Promise<TutorStatistics>
  + getStudentStatistics(studentId: string): Promise<StudentStatistics>
  + getClassroomStatistics(classroomId: string): Promise<ClassroomStatistics>
  + exportStatisticsReport(filter: StatisticsFilterDto): Promise<string>
}

interface OverviewStatistics {
  totalUsers: number
  totalCourses: number
  totalClassrooms: number
  activeSessions: number
  totalRegistrations: number
  activeStudents: number
  activeTutors: number
  pendingRequests: number
  averageRating: number
}

interface TutorStatistics {
  totalSessions: number
  completedSessions: number
  totalStudents: number
  averageRating: number
  totalRatings: number
  ratingBreakdown: TutorRatingStats
  totalClassrooms: number
  activeClassrooms: number
}

interface StudentStatistics {
  coursesEnrolled: number
  sessionsAttended: number
  attendanceRate: number
  assignmentsCompleted: number
  averageGrade: number
  totalSubmissions: number
}
```

---

### **FileStorageService**

```typescript
class FileStorageService {
  + uploadFile(file: Express.Multer.File, folder: string): Promise<FileUploadResult>
  + uploadMultipleFiles(files: Express.Multer.File[], folder: string): Promise<FileUploadResult[]>
  + deleteFile(filePath: string): Promise<void>
  + getFileUrl(filePath: string): Promise<string>
  + getSignedUrl(filePath: string, expiresIn: number): Promise<string>
  + validateFile(file: Express.Multer.File, options: FileValidationOptions): boolean
}

interface FileUploadResult {
  fileName: string
  filePath: string
  fileUrl: string
  fileSize: number
  fileType: string
}

interface FileValidationOptions {
  maxSize?: number
  allowedTypes?: string[]
  minSize?: number
}
```

---

### **WebSocketService**

```typescript
class WebSocketService {
  + broadcastToChannel(channelId: string, event: string, data: any): void
  + sendToUser(userId: string, event: string, data: any): void
  + sendToMultipleUsers(userIds: string[], event: string, data: any): void
  + joinRoom(socketId: string, roomId: string): void
  + leaveRoom(socketId: string, roomId: string): void
  + broadcastTypingIndicator(channelId: string, userId: string): void
  + broadcastNewMessage(channelId: string, message: Message): void
  + broadcastNewNotification(userId: string, notification: Notification): void
}
```

---

## 🔒 Security & Validation

### **Input Validation DTOs**

All DTOs should use class-validator decorators:

```typescript
import { IsString, IsEmail, IsOptional, IsBoolean, IsArray, IsNumber, Min, Max, Length, IsEnum } from 'class-validator';

// Example
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 100)
  password: string;

  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsBoolean()
  @IsOptional()
  isStudent?: boolean;

  @IsBoolean()
  @IsOptional()
  isTutor?: boolean;
}
```

---

## 📝 Implementation Notes

### **Database Indexes**

```sql
-- User indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_roles ON users(is_student, is_tutor, is_coordinator);
CREATE INDEX idx_user_deleted ON users(deleted_at);

-- Registration indexes
CREATE INDEX idx_registration_user ON registrations(user_id);
CREATE INDEX idx_registration_course ON registrations(course_id);
CREATE INDEX idx_registration_status ON registrations(status);

-- Classroom indexes
CREATE INDEX idx_classroom_course ON classrooms(course_id);
CREATE INDEX idx_classroom_tutor ON classrooms(tutor_id);
CREATE INDEX idx_classroom_status ON classrooms(status);

-- Session indexes
CREATE INDEX idx_session_classroom ON sessions(classroom_id);
CREATE INDEX idx_session_tutor ON sessions(tutor_id);
CREATE INDEX idx_session_time ON sessions(start_time, end_time);
CREATE INDEX idx_session_status ON sessions(status);

-- Message indexes
CREATE INDEX idx_message_channel ON messages(channel_id);
CREATE INDEX idx_message_timestamp ON messages(timestamp DESC);

-- Notification indexes
CREATE INDEX idx_notification_recipient ON notifications(recipient_id);
CREATE INDEX idx_notification_read ON notifications(is_read);
CREATE INDEX idx_notification_created ON notifications(created_at DESC);
```

---

## 🚀 Usage Example

### Complete Flow Example

```typescript
// 1. User Registration
const authService = new AuthService();
const result = await authService.register({
  email: 'student@hcmut.edu.vn',
  password: 'SecurePass123!',
  firstName: 'Nguyen',
  lastName: 'Van A',
  role: UserRole.STUDENT
});

// 2. Create Registration
const registration = await Registration.create({
  userId: result.user.userId,
  courseId: 'course-123',
  language: Language.VIETNAMESE,
  sessionMethod: SessionMethod.HYBRID,
  location: 'District 1, HCMC',
  specialRequire: 'Need evening classes'
});

// 3. Coordinator Approves
const approvedRegistration = await registration.approve(registration.registrationId, {
  tutorId: 'tutor-456',
  classroomId: 'classroom-789',
  coordinatorNote: 'Approved. Tutor assigned.'
});

// 4. Send Notification
await notificationService.onRegistrationApproved(approvedRegistration);

// 5. Tutor Creates Session
const session = await Session.create({
  classroomId: 'classroom-789',
  tutorId: 'tutor-456',
  title: 'Computer Network - Session 1',
  startTime: new Date('2025-12-17T09:00:00'),
  endTime: new Date('2025-12-17T11:00:00'),
  sessionType: SessionType.HYBRID,
  location: 'Room A-101',
  meetingLink: 'https://meet.google.com/abc-xyz'
});

// 6. Mark Attendance
await session.markAttendance(session.sessionId, {
  studentId: result.user.userId,
  isPresent: true
});

// 7. Student Rates Tutor
await TutorRating.create({
  studentId: result.user.userId,
  tutorId: 'tutor-456',
  classroomId: 'classroom-789',
  sessionId: session.sessionId,
  criteriaRatings: {
    teaching: 4.5,
    communication: 5.0,
    punctuality: 4.0,
    helpfulness: 5.0,
    expertise: 4.5
  },
  comment: 'Excellent tutor!'
});
```

---

## ✅ Implementation Checklist

### Phase 1: Core Models
- [ ] User Model + AuthToken Model
- [ ] Registration Model
- [ ] Course Model
- [ ] Classroom Model

### Phase 2: Learning Content
- [ ] Material Model
- [ ] Assignment Model
- [ ] Submission Model

### Phase 3: Sessions
- [ ] Session Model
- [ ] SessionRequest Model
- [ ] SessionNote Model
- [ ] AttendanceRecord Model

### Phase 4: Feedback & Communication
- [ ] TutorRating Model
- [ ] ClassFeedback Model
- [ ] ChatChannel Model
- [ ] Message Model
- [ ] Notification Model

### Phase 5: Additional
- [ ] Book Model (Library)
- [ ] CourseCreationRequest Model
- [ ] TutorRegistration Model
- [ ] SystemMetrics Model (Python)

### Phase 6: Services
- [ ] AuthService
- [ ] NotificationService
- [ ] StatisticsService
- [ ] FileStorageService
- [ ] WebSocketService

---

**Document Version:** 1.0  
**Last Updated:** November 15, 2025  
**Author:** HCMUT Development Team  
**Total Models:** 21  
**Total Methods:** 350+  
**Total DTOs:** 80+
