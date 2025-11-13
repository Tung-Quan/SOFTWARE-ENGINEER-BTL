import { mockCourses } from './~mock-courses';
import { getRandomMembers } from './~mock-names';

export type SessionMember = { id: number; name: string; present: boolean };

export type Session = {
  id: string;
  courseId: string;
  title: string;
  desc?: string;
  instructor: string;
  method: 'hybrid' | 'online';
  link?: string;
  location?: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  members: SessionMember[];
  studentNames?: string[];
  declineReason?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
};

// A few deterministic-ish helper values to vary sessions
const now = new Date('2025-12-01T08:00:00.000Z');
const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 60 * 60_000);
const toISO = (d: Date) => d.toISOString();

// Return a random status for a session. Weighted so most are scheduled.
function randomStatus(): Session['status'] {
  const r = Math.random()
  if (r < 0.6) return 'scheduled'
  if (r < 0.9) return 'completed'
  return 'cancelled'
}

// When a session is cancelled, provide a short 1-2 line reason for the decline.
function randomDeclineReason(): string {
  const reasons = [
    'Giảng viên bận đột xuất. Buổi học bị huỷ.',
    'Phòng học được sử dụng cho sự kiện khác. Buổi học tạm hoãn.',
    'Số lượng học viên không đủ, buổi học được dời.',
    'Vấn đề kỹ thuật với hệ thống trực tuyến, buổi học hoãn lại.'
  ]
  return reasons[Math.floor(Math.random() * reasons.length)]
}

// Build some sample sessions using courses and names
export const mockSessions: Session[] = [
  {
    id: 's-1',
    courseId: mockCourses[0].id,
    title: `${mockCourses[0].title} - Buổi 1`,
    desc: 'Orient and setup. Giới thiệu syllabus và môi trường học tập.',
    instructor: mockCourses[0].instructor,
    method: 'hybrid',
    link: 'https://meet.example.com/abc-123',
    start: toISO(new Date('2025-12-17T09:00:00')),
    end: toISO(new Date('2025-12-17T10:00:00')),
    members: getRandomMembers(8),
    ...(() => {
      const s = randomStatus()
      return { status: s, declineReason: s === 'cancelled' ? randomDeclineReason() : undefined }
    })(),
    createdAt: toISO(addDays(now, -10)),
  },
  {
    id: 's-2',
    courseId: mockCourses[1].id,
    title: `${mockCourses[1].title} - Lab`,
    desc: 'Bài lab: Thiết kế schema và queries cơ bản',
    instructor: mockCourses[1].instructor,
    method: 'online',
    location: 'Phòng A-101',
    start: toISO(new Date('2025-12-17T13:00:00')),
    end: toISO(new Date('2025-12-17T15:00:00')),
    members: getRandomMembers(6),
    ...(() => {
      const s = randomStatus()
      return { status: s, declineReason: s === 'cancelled' ? randomDeclineReason() : undefined }
    })(),
    createdAt: toISO(addDays(now, -8)),
  },
  {
    id: 's-3',
    courseId: mockCourses[2].id,
    title: `${mockCourses[2].title} - Tổng hợp`,
    desc: 'Tổng hợp chương 1-3 và Q&A',
    instructor: mockCourses[2].instructor,
    method: 'online',
    link: 'https://meet.example.com/xyz-789',
    start: toISO(new Date('2025-12-18T10:00:00')),
    end: toISO(new Date('2025-12-18T11:30:00')),
    members: getRandomMembers(10),
    ...(() => {
      const s = randomStatus()
      return { status: s, declineReason: s === 'cancelled' ? randomDeclineReason() : undefined }
    })(),
    createdAt: toISO(addDays(now, -7)),
  },
  {
    id: 's-4',
    courseId: mockCourses[3].id,
    title: `${mockCourses[3].title} - Bài tập về nhà`,
    desc: 'Nộp bài tập về nhà và chấm điểm sơ bộ',
    instructor: mockCourses[3].instructor,
    method: 'hybrid',
    link: 'https://meet.example.com/homework-1',
    start: toISO(new Date('2025-12-20T14:00:00')),
    end: toISO(new Date('2025-12-20T15:00:00')),
    members: getRandomMembers(8),
    ...(() => {
      const s = randomStatus()
      return { status: s, declineReason: s === 'cancelled' ? randomDeclineReason() : undefined }
    })(),
    createdAt: toISO(addDays(now, -5)),
  },
  {
    id: 's-5',
    courseId: mockCourses[4].id,
    title: `${mockCourses[4].title} - Kiểm tra giữa kỳ`,
    desc: 'Midterm test; phòng thi được phân bổ',
    instructor: mockCourses[4].instructor,
    method: 'online',
    location: 'Hội trường 2',
    start: toISO(new Date('2025-12-22T08:00:00')),
    end: toISO(new Date('2025-12-22T10:00:00')),
    members: getRandomMembers(12),
    ...(() => {
      const s = randomStatus()
      return { status: s, declineReason: s === 'cancelled' ? randomDeclineReason() : undefined }
    })(),
    createdAt: toISO(addDays(now, -3)),
  },
  // Completed session example
  {
    id: 's-6',
    courseId: mockCourses[0].id,
    title: `${mockCourses[0].title} - Buổi thử nghiệm`,
    desc: 'Buổi thử nghiệm đã hoàn tất',
    instructor: mockCourses[0].instructor,
    method: 'hybrid',
    link: 'https://meet.example.com/done-1',
    start: toISO(new Date('2025-11-20T09:00:00')),
    end: toISO(new Date('2025-11-20T10:00:00')),
    members: getRandomMembers(7),
    ...(() => {
      const s = randomStatus()
      return { status: s, declineReason: s === 'cancelled' ? randomDeclineReason() : undefined }
    })(),
    createdAt: toISO(addDays(now, -40)),
  },
];

// Populate studentNames for convenience so UI can render name lists easily
mockSessions.forEach((s) => {
  s.studentNames = s.members?.map((m) => m.name) ?? []
})

export function getMockSessions(count?: number) {
  if (!count) return mockSessions;
  return mockSessions.slice(0, count);
}

export function getSessionById(id: string) {
  return mockSessions.find((s) => s.id === id);
}

export default mockSessions;

// Update a session by id with a partial patch. Returns the updated session or undefined if not found.
export function updateSession(id: string, patch: Partial<Session>): Session | undefined {
  const idx = mockSessions.findIndex((s) => s.id === id)
  if (idx === -1) return undefined
  const updated: Session = { ...mockSessions[idx], ...patch }
  // Ensure studentNames stay in sync when members changed
  if (patch.members) {
    updated.studentNames = patch.members.map((m) => m.name)
  } else {
    updated.studentNames = updated.members?.map((m) => m.name) ?? []
  }
  mockSessions[idx] = updated
  return updated
}

// Save a full session: if id exists replace, otherwise push new session with generated id
export function saveSession(session: Session): Session {
  const idx = mockSessions.findIndex((s) => s.id === session.id)
  const copy = { ...session, studentNames: session.members?.map((m) => m.name) ?? [] }
  if (idx === -1) {
    mockSessions.push(copy)
  } else {
    mockSessions[idx] = copy
  }
  return copy
}

/**
 * Create a session from a request form and persist it to mockSessions.
 * This is a convenience for the "request new session" page in dev.
 */
export function createRequestSession(request: Partial<Session> & { courseId: string; title: string; start: string; end: string }) {
  // generate a compact id based on timestamp
  const id = `s-${Date.now().toString(36)}`
  const newSession: Session = {
    id,
    courseId: request.courseId,
    title: request.title,
    desc: request.desc ?? '',
    instructor: request.instructor ?? 'TBD',
    method: request.method ?? 'hybrid',
    link: request.link,
    location: request.location,
    start: request.start,
    end: request.end,
    members: request.members ?? getRandomMembers(8),
    status: request.status ?? 'scheduled',
    createdAt: new Date().toISOString(),
  }

  return saveSession(newSession)
}
