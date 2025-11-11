import { mockCourses } from './~mock-courses';
import { NAMES_POOL } from './~mock-names';

export const mockLanguages = [
  { id: 'vi', name: 'Vietnamese' },
  { id: 'en', name: 'English' },
  { id: 'cn', name: 'Chinese' },
  { id: 'th', name: 'Thailand' },
];

/**
 * Danh sách địa điểm (phường) cho dropdown
 */
export const mockLocations = [
  { id: 'p1', name: 'Phường 1' },
  { id: 'p2', name: 'Phường 2' },
  { id: 'p3', name: 'Phường 3' },
  { id: 'p4', name: 'Phường 4' },
];
// --- Định nghĩa Type ---

// Kiểu dữ liệu cho các tùy chọn dropdown
type DropdownOption = {
  id: string;
  name: string;
};

// Kiểu dữ liệu cho một đơn đăng ký đã gửi
export type PastTutorRegistration = {
  id: string;
  studentName: string;
  studentEmail: string;
  course: DropdownOption; // Từ mockCourses
  language: DropdownOption; // Từ mockLanguages
  sessionType: DropdownOption; // 'online' | 'offline'
  location?: DropdownOption; // Từ mockLocations (optional for online)
  specialRequest: string;
  status: 'Pending' | 'Approved' | 'Declined';
  declineReason?: string; // Lý do (nếu bị 'Declined')
  createdAt: string; // ISO date string
};

// --- Helpers ---

// Tạo email giả từ tên
const createFakeEmail = (name: string): string => {
  const noDiacritics = name
    .toLowerCase()
    .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
  const emailPrefix = noDiacritics.replace(/\s+/g, '.');
  return `${emailPrefix}@gmail.com`;
};

// Chuyển đổi courses thành định dạng dropdown
const courseOptions = mockCourses.map(c => ({
  id: c.id,
  name: `${c.title} (${c.code})`
}));

// Tùy chọn loại hình
const sessionTypeOptions = [
  { id: 'offline', name: 'Học trực tiếp' },
  { id: 'online', name: 'Học online' },
];

// --- Dữ liệu Mock ---

export const mockPastRegistrations: PastTutorRegistration[] = [
  {
    id: 'reg-1',
    studentName: NAMES_POOL[0].name,
    studentEmail: createFakeEmail(NAMES_POOL[0].name),
    course: courseOptions[2],
    language: mockLanguages[0],
    sessionType: sessionTypeOptions[1],
    location: mockLocations[0],
    specialRequest: 'Em muốn học sâu về phần quản lý bộ nhớ và virtual memory. Em chỉ rảnh vào cuối tuần.',
    status: 'Approved',
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 'reg-2',
    studentName: NAMES_POOL[1].name,
    studentEmail: createFakeEmail(NAMES_POOL[1].name),
    course: courseOptions[0],
    language: mockLanguages[1],
    sessionType: sessionTypeOptions[0],
    location: mockLocations[2],
    specialRequest: 'I need help with subnetting and routing protocols. My availability is flexible.',
    status: 'Pending',
    createdAt: '2025-11-05T14:30:00Z',
  },
  {
    id: 'reg-3',
    studentName: NAMES_POOL[2].name,
    studentEmail: createFakeEmail(NAMES_POOL[2].name),
    course: courseOptions[4],
    language: mockLanguages[0],
    sessionType: sessionTypeOptions[1],
    location: mockLocations[1],
    specialRequest: 'Em bị mất gốc thuật toán. Em cần học lại từ đầu, đặc biệt là Big O và các thuật toán sắp xếp.',
    status: 'Declined',
    declineReason: 'Yêu cầu của bạn quá rộng. Chương trình tutor chỉ hỗ trợ giải đáp thắc mắc hoặc ôn tập cho các chủ đề cụ thể, không phải dạy lại từ đầu. Vui lòng đăng ký lại với yêu cầu cụ thể hơn.',
    createdAt: '2025-11-02T09:15:00Z',
  }
  ,
  {
    id: 'reg-4',
    studentName: 'Student',
    studentEmail: createFakeEmail(NAMES_POOL[3].name),
    course: courseOptions[1],
    language: mockLanguages[1],
    sessionType: sessionTypeOptions[1],
    // Online registration; omit explicit location so code can default to Online when needed
    specialRequest: 'Muốn luyện kỹ năng giải đề và chấm bài mẫu trước kỳ thi cuối khoá.',
    status: 'Pending',
    createdAt: '2025-11-11T12:00:00Z',
  }
];

// --- Helpers to create new registrations ---
/**
 * Create and store a new PastTutorRegistration.
 * If studentName/email are not provided, a random name from NAMES_POOL is used
 * and an email generated.
 */
export function createPastRegistration(input: Partial<PastTutorRegistration> & {
  course: DropdownOption;
  language: DropdownOption;
  sessionType: DropdownOption;
  location?: DropdownOption;
  specialRequest: string;
}): PastTutorRegistration {
  const name = input.studentName ?? NAMES_POOL[Math.floor(Math.random() * NAMES_POOL.length)].name;
  const email = input.studentEmail ?? createFakeEmail(name);
  const id = `reg-${Date.now()}`;
  const record: PastTutorRegistration = {
    id,
    studentName: name,
    studentEmail: email,
    course: input.course,
    language: input.language,
    sessionType: input.sessionType,
    location: input.location ?? { id: 'online', name: 'Online' },
    specialRequest: input.specialRequest,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  mockPastRegistrations.unshift(record);
  return record;
}
