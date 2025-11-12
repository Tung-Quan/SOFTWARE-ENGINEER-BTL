import { mockCourses } from './~mock-courses';
import { mockLanguages, mockLocations } from './~mock-register';

// --- Định nghĩa Type ---

// Kiểu dữ liệu cho các tùy chọn dropdown
type DropdownOption = {
  id: string;
  name: string;
};

// Kiểu dữ liệu cho một đơn đăng ký của GIA SƯ
export type PastTutorRegistration = {
  id: string;
  tutorName: string;
  tutorEmail: string;
  subjects: DropdownOption[]; // Danh sách các môn học (từ mockCourses)
  languages: DropdownOption[]; // Danh sách ngôn ngữ
  sessionTypes: DropdownOption[]; // 'online' | 'offline'
  locations: DropdownOption[]; // Danh sách địa điểm
  meetLink?: string; // Optional meet link for online sessions
  specialRequest: string;
  status: 'Pending' | 'Approved' | 'Declined';
  createdAt: string; // ISO date string
};

// --- Helpers ---
// Lấy tên các giảng viên từ mockCourses để làm gia sư
const tutorNames = [
  ...new Set(mockCourses.map(c => c.instructor)),
].slice(0, 3); // Lấy 3 giảng viên đầu tiên

// Tạo email giả
const createFakeEmail = (name: string): string => {
  const noDiacritics = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
  const emailPrefix = noDiacritics.replace(/\s+/g, '.');
  return `${emailPrefix}@tutor.example.com`;
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

export const mockTutorRegistrations: PastTutorRegistration[] = [
  {
    id: 'tutor-reg-1',
    tutorName: tutorNames[0], // Nguyễn Lê Duy Lai
    tutorEmail: createFakeEmail(tutorNames[0]),
    subjects: [courseOptions[0], courseOptions[10]], // Computer Network, Networks II
    languages: [mockLanguages[0], mockLanguages[1]], // Vietnamese, English
    sessionTypes: [sessionTypeOptions[0], sessionTypeOptions[1]], // Cả hai
    locations: [mockLocations[0], mockLocations[11]], // Phường 1, Phường 2
    specialRequest: 'Tôi có kinh nghiệm dạy chuyên sâu về TCP/IP và định tuyến. Có thể dạy cả online và offline.',
    status: 'Approved',
    createdAt: '2025-10-28T09:00:00Z',
  },
  {
    id: 'tutor-reg-2',
    tutorName: tutorNames[1], // Nguyễn Thị Ái Thảo
    tutorEmail: createFakeEmail(tutorNames[1]),
    subjects: [courseOptions[1], courseOptions[11]], // Database System, Database II
    languages: [mockLanguages[0]], // Vietnamese
    sessionTypes: [sessionTypeOptions[1]], // Chỉ Online
    locations: [mockLocations[2]], // Phường 3
    specialRequest: 'Chuyên dạy về SQL, tối ưu hóa truy vấn và NoSQL. Chỉ nhận dạy online vào buổi tối.',
    status: 'Pending',
    createdAt: '2025-11-10T11:20:00Z',
  },
  {
    id: 'tutor-reg-3',
    tutorName: tutorNames[2], // Ngô Thị Vân
    tutorEmail: createFakeEmail(tutorNames[2]),
    subjects: [courseOptions[2]], // Operating System
    languages: [mockLanguages[1]], // English
    sessionTypes: [sessionTypeOptions[0]], // Chỉ Offline
    locations: [mockLocations[0], mockLocations[2], mockLocations[3]], // P1, P3, P4
    specialRequest: 'Kinh nghiệm dạy OS, tập trung vào process scheduling và memory management. Chỉ dạy offline.',
    status: 'Approved',
    createdAt: '2025-11-05T16:05:00Z',
  },
];