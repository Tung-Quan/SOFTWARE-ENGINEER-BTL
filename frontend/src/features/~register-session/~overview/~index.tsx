import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid'
import {
  createFileRoute,
  Link
} from '@tanstack/react-router'
import React, { useState, useMemo } from 'react'

// --- Import Mock Data ---
import {
  mockPastRegistrations,
  mockLocations,
  mockLanguages,
} from '@/components/data/~mock-register'
import {
  mockTutorRegistrations,
} from '@/components/data/~mock-tutor-register'
import StudyLayout from '@/components/study-layout'
import useLockBodyScroll from '@/hooks/use-lock-body-scroll'

import { FilterPopup, type FilterState } from './components/filter-popup'
import { MatchingPopup } from './components/popup'

// --- BIẾN ĐỔI SVG THÀNH COMPONENT ---

// SVG cho nút Filter
const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6.66512 13.3333C6.66507 13.4572 6.69953 13.5787 6.76465 13.6841C6.82977 13.7895 6.92297 13.8746 7.03379 13.93L8.36712 14.5967C8.46879 14.6475 8.58175 14.6714 8.69529 14.6663C8.80882 14.6612 8.91916 14.6271 9.01581 14.5673C9.11247 14.5075 9.19224 14.424 9.24754 14.3247C9.30284 14.2254 9.33184 14.1137 9.33179 14V9.33333C9.33194 9.00292 9.45477 8.68433 9.67646 8.43933L14.4918 3.11333C14.5781 3.01771 14.6349 2.89912 14.6552 2.77192C14.6755 2.64472 14.6586 2.51435 14.6064 2.39658C14.5542 2.27881 14.469 2.17868 14.3611 2.1083C14.2532 2.03792 14.1273 2.0003 13.9985 2H1.99846C1.86953 2.00005 1.74338 2.03748 1.63529 2.10776C1.5272 2.17804 1.44181 2.27815 1.38946 2.39598C1.33711 2.5138 1.32005 2.64427 1.34034 2.77159C1.36063 2.89892 1.41741 3.01762 1.50379 3.11333L6.32046 8.43933C6.54215 8.68433 6.66497 9.00292 6.66512 9.33333V13.3333Z" stroke="#3D4863" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


// Fixed: User + (avatar with plus) icon converted to React component with proper attribute names
const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1 14C1 14 0 14 0 13C0 12 1 9 6 9C11 9 12 12 12 13C12 14 11 14 11 14H1Z" fill="#3D4863" />
    <path d="M6 8C6.79565 8 7.55871 7.68393 8.12132 7.12132C8.68393 6.55871 9 5.79565 9 5C9 4.20435 8.68393 3.44129 8.12132 2.87868C7.55871 2.31607 6.79565 2 6 2C5.20435 2 4.44129 2.31607 3.87868 2.87868C3.31607 3.44129 3 4.20435 3 5C3 5.79565 3.31607 6.55871 3.87868 7.12132C4.44129 7.68393 5.20435 8 6 8Z" fill="#3D4863" />
    <path fillRule="evenodd" clipRule="evenodd" d="M13.5 5C13.6326 5 13.7598 5.05268 13.8536 5.14645C13.9473 5.24021 14 5.36739 14 5.5V7H15.5C15.6326 7 15.7598 7.05268 15.8536 7.14645C15.9473 7.24021 16 7.36739 16 7.5C16 7.63261 15.9473 7.75979 15.8536 7.85355C15.7598 7.94732 15.6326 8 15.5 8H14V9.5C14 9.63261 13.9473 9.75979 13.8536 9.85355C13.7598 9.94732 13.6326 10 13.5 10C13.3674 10 13.2402 9.94732 13.1464 9.85355C13.0527 9.75979 13 9.63261 13 9.5V8H11.5C11.3674 8 11.2402 7.94732 11.1464 7.85355C11.0527 7.75979 11 7.63261 11 7.5C11 7.36739 11.0527 7.24021 11.1464 7.14645C11.2402 7.05268 11.3674 7 11.5 7H13V5.5C13 5.36739 13.0527 5.24021 13.1464 5.14645C13.2402 5.05268 13.3674 5 13.5 5Z" fill="#3D4863" />
  </svg>
);

// --- Định nghĩa Type ---
// Gộp 2 loại đăng ký làm 1
type UnifiedRegistration = {
  id: string;
  courseCode: string;
  name: string;
  language: string;
  type: string;
  role: 'Student' | 'Tutor';
  location: string;
  request: string;
  status: 'Pending' | 'Approved' | 'Declined';
};

const ITEMS_PER_PAGE = 10;

// === Component Route ===
export const Route = createFileRoute('/register-session/overview/')({
  component: RouteComponent,
})

function RouteComponent() {
  // State
  const [activeTab, setActiveTab] = useState<'data' | 'results'>('data');
  const [searchName, setSearchName] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Assign popup state
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<UnifiedRegistration | null>(null);

  // Filter popup state
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  // Parent `filters` holds only *applied* filters. Empty values mean "no filter applied".
  const [filters, setFilters] = useState<FilterState>({
    locations: {},
    language: '',
    role: '',
    sessionType: '',
  });

  // Whether parent currently has any applied filters. If false, the popup will
  // show its own default staged values instead of reflecting applied filters.
  const hasActiveFilters = useMemo(() => {
    const selectedLocations = Object.values(filters.locations || {}).filter(Boolean).length > 0;
    return (
      selectedLocations || Boolean(filters.language) || Boolean(filters.role) || Boolean(filters.sessionType)
    );
  }, [filters]);

  // Lock body scroll when any popup is open
  useLockBodyScroll(isAssignPopupOpen || isFilterPopupOpen);

  // Gộp và chuẩn hóa dữ liệu từ 2 file mock
  const allRequests = useMemo((): UnifiedRegistration[] => {
    // 1. Xử lý Student Registrations
    const studentRequests: UnifiedRegistration[] = mockPastRegistrations.map(r => ({
      id: r.id,
      courseCode: r.course.name.split('(')[1]?.replace(')', '') ?? 'N/A',
      name: r.studentName,
      language: r.language.name,
      type: r.sessionType.name,
      role: 'Student',
      location: r.location?.name ?? 'Online',
      request: r.specialRequest,
      status: r.status,
    }));

    // 2. Xử lý Tutor Registrations
    const tutorRequests: UnifiedRegistration[] = mockTutorRegistrations.map(r => ({
      id: r.id,
      // Lấy môn đầu tiên làm đại diện
      courseCode: r.subjects[0]?.name.split('(')[1]?.replace(')', '') ?? 'N/A',
      name: r.tutorName,
      // Lấy ngôn ngữ đầu tiên làm đại diện
      language: r.languages[0]?.name ?? 'N/A',
      // Lấy loại hình đầu tiên
      type: r.sessionTypes[0]?.name ?? 'N/A',
      role: 'Tutor',
      // Lấy địa điểm đầu tiên
      location: r.locations[0]?.name ?? 'N/A',
      request: r.specialRequest,
      status: r.status,
    }));

    // 3. Gộp lại
    return [...studentRequests, ...tutorRequests];
  }, []);

  // Lọc dữ liệu dựa trên state
  // Apply filters and search
  const filteredRequests = useMemo(() => {
    return allRequests
      // Apply filter popup filters first
      .filter((req) => {
        // Apply location filter (check if any location is selected)
        const selectedLocations = Object.entries(filters.locations)
          .filter(([, isSelected]) => isSelected)
          .map(([locationId]) => locationId);
        
        // If there are selected locations, filter by them
        if (selectedLocations.length > 0) {
          // Match by location ID or name (you may need to adjust this based on your data structure)
          const reqLocationMatches = selectedLocations.some(locId => {
            // Try to match with location data
            const matchingLocation = mockLocations.find(loc => loc.id === locId);
            return matchingLocation && req.location === matchingLocation.name;
          });
          if (!reqLocationMatches) return false;
        }
        
        // Apply language filter
        if (filters.language) {
          const matchingLanguage = mockLanguages.find(lang => lang.id === filters.language);
          if (matchingLanguage && req.language !== matchingLanguage.name) {
            return false;
          }
        }
        
        // Apply role filter
        if (filters.role) {
          const roleMap: Record<string, string> = {
            student: 'Student',
            tutor: 'Tutor',
          };
          if (req.role !== roleMap[filters.role]) {
            return false;
          }
        }
        
        // Apply session type filter
        if (filters.sessionType) {
          const sessionTypeMap: Record<string, string> = {
            hybrid: 'Hybrid',
            online: 'Online',
          };
          if (req.type !== sessionTypeMap[filters.sessionType]) {
            return false;
          }
        }
        
        return true;
      })
      // Then apply search filters
      .filter(req =>
        req.name.toLowerCase().includes(searchName.toLowerCase())
      )
      .filter(req =>
        req.courseCode.toLowerCase().includes(searchSubject.toLowerCase())
      );
  }, [allRequests, filters, searchName, searchSubject]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredRequests.slice(start, end);
  }, [filteredRequests, currentPage]);

  // Handle opening assign popup
  const handleOpenAssignPopup = (registration: UnifiedRegistration) => {
    setSelectedRegistration(registration);
    setIsAssignPopupOpen(true);
  };

  // Get filtered list of people to match based on selected registration
  const getAvailablePeople = () => {
    if (!selectedRegistration) return { people: [], label: '' };

    const courseCode = selectedRegistration.courseCode;

    if (selectedRegistration.role === 'Student') {
      // Show tutors with the same course
      const matchingTutors = mockTutorRegistrations
        .filter(tutor => {
          // Check if tutor has the same course
          return tutor.subjects.some(subject => 
            subject.name.includes(courseCode)
          );
        })
        .map(tutor => ({
          id: tutor.id,
          name: tutor.tutorName,
        }));
      return { people: matchingTutors, label: 'Tutor' };
    } else {
      // Show students with the same course
      const matchingStudents = mockPastRegistrations
        .filter(student => {
          const studentCourseCode = student.course.name.split('(')[1]?.replace(')', '') ?? '';
          return studentCourseCode === courseCode;
        })
        .map(student => ({
          id: student.id,
          name: student.studentName,
        }));
      return { people: matchingStudents, label: 'Student' };
    }
  };

  const availableMatches = getAvailablePeople();

  // Handle submit assign
  const handleMatchTutor = (tutorId: string) => {
    if (!selectedRegistration) return;

    // Find the data array and update the registration
    // Use role (Student/Tutor) to decide which mock array to update
    if (selectedRegistration.role === 'Student') {
      const regIndex = mockPastRegistrations.findIndex(r => r.id === selectedRegistration.id);
      if (regIndex !== -1) {
        mockPastRegistrations[regIndex].status = 'Approved';
        // Optionally store assignment info on the mock (not present in mock schema)
        console.log('Assigned tutor:', tutorId, 'to student:', selectedRegistration.name);
      }
    } else if (selectedRegistration.role === 'Tutor') {
      const regIndex = mockTutorRegistrations.findIndex(r => r.id === selectedRegistration.id);
      if (regIndex !== -1) {
        mockTutorRegistrations[regIndex].status = 'Approved';
        console.log('Assigned tutor:', tutorId, 'to tutor registration:', selectedRegistration.name);
      }
    }

    // Show success message
    alert('Đã phân công thành công!');

    // Close popup and reset
    setIsAssignPopupOpen(false);
    setSelectedRegistration(null);
  };

  const handleClosePopup = () => {
    setIsAssignPopupOpen(false);
    setSelectedRegistration(null);
  };

  // Filter handlers
  const handleOpenFilterPopup = () => {
    setIsFilterPopupOpen(true);
  };

  const handleCloseFilterPopup = () => {
    setIsFilterPopupOpen(false);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };  return (
    <StudyLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">

        {/* 1. Header: Nút quay lại, Tabs, Nút Matching */}
        <header className="mb-6 flex items-center justify-between">
          {/* Nút quay lại */}
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
            <ArrowLeftIcon className="size-5" />
            Quay lại
          </Link>

          {/* Tabs */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-200 p-1">
            <button
              onClick={() => setActiveTab('data')}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${activeTab === 'data'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-300'
                }`}
            >
              Dữ liệu
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${activeTab === 'results'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-300'
                }`}
            >
              Kết quả
            </button>
          </div>

          {/* Nút Matching */}
          <button className="rounded-lg border border-blue-600 bg-white px-5 py-2.5 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50">
            Matching
          </button>
        </header>

        {/* 2. Thanh Filter/Search */}
        <div className="mb-4 flex items-center gap-4">
          {/* Search Tên */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="size-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Nhập tên để tìm kiếm..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full rounded-lg border-gray-300 py-2 pl-10 shadow-sm"
            />
          </div>

          {/* Search Mã môn học */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="size-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Nhập mã môn học..."
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              className="w-full rounded-lg border-gray-300 py-2 pl-10 shadow-sm"
            />
          </div>

          {/* Nút Filter */}
          <button
            onClick={handleOpenFilterPopup}
            className="shrink-0 rounded-lg border border-gray-300 bg-white p-2.5 shadow-sm hover:bg-gray-50"
          >
            <FilterIcon className="size-5" />
          </button>
        </div>

        {/* 3. Bảng dữ liệu */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <Th>Mã môn học</Th>
                  <Th>Họ tên</Th>
                  <Th>Ngôn ngữ</Th>
                  <Th>Hình thức</Th>
                  <Th>Role</Th>
                  <Th>Địa điểm</Th>
                  <Th>Yêu cầu đặc biệt</Th>
                  <Th>Trạng thái</Th>
                  <Th>
                    <span className="sr-only">Assign</span>
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedRequests.map((req) => (
                  <tr key={req.id}>
                    <Td>{req.courseCode}</Td>
                    <Td>{req.name}</Td>
                    <Td>{req.language}</Td>
                    <Td>{req.type}</Td>
                    <Td>{req.role}</Td>
                    <Td>{req.location}</Td>
                    <Td>
                      <span className="block w-32 truncate" title={req.request}>
                        {req.request.substring(0, 20)}...
                      </span>
                    </Td>
                    <Td>
                      <StatusBadge status={req.status} />
                    </Td>
                    <Td>
                      <button 
                        onClick={() => handleOpenAssignPopup(req)}
                        className="rounded-lg border border-gray-600 p-2 text-gray-500 hover:text-blue-600"
                      >
                        <UserPlusIcon className="size-5" />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Phân trang */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Assign Popup Modal - use MatchingPopup component */}
        {isAssignPopupOpen && selectedRegistration && (
          <>
            {/* Overlay to dim background and prevent clicks */}
            <div 
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
              onClick={handleClosePopup}
            >
              {/* Popup centered on screen */}
              <div onClick={(e) => e.stopPropagation()}>
                <MatchingPopup
                  onClose={handleClosePopup}
                  onMatch={handleMatchTutor}
                  availablePeople={availableMatches.people}
                  tabLabel={availableMatches.label}
                />
              </div>
            </div>
          </>
        )}

        {/* Filter Popup Modal */}
        {isFilterPopupOpen && (
          <>
            {/* Overlay to dim background and prevent clicks */}
            <div 
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
              onClick={handleCloseFilterPopup}
            >
              {/* Popup centered on screen */}
              <div onClick={(e) => e.stopPropagation()}>
                <FilterPopup
                  onClose={handleCloseFilterPopup}
                  onApply={handleApplyFilters}
                  initialState={hasActiveFilters ? filters : undefined}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </StudyLayout>
  )
}

// --- Component Helper ---

// Helper: Header Bảng
const Th = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
    {children}
  </th>
);

// Helper: Ô Bảng
const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
    {children}
  </td>
);

// Helper: Trạng thái
const StatusBadge = ({ status }: { status: 'Pending' | 'Approved' | 'Declined' }) => {
  const statusMap = {
    Pending: { text: 'Đang xử lý', class: 'bg-yellow-100 text-yellow-800' },
    Approved: { text: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
    Declined: { text: 'Từ chối', class: 'bg-red-100 text-red-800' },
  };
  const { text, class: className } = statusMap[status];
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {text}
    </span>
  );
};

// Helper: Phân trang
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} >
          Previous
        </button>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronDoubleLeftIcon className="size-5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeftIcon className="size-5" />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage
                    ? 'z-10 bg-blue-600 text-white focus:z-20'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRightIcon className="size-5" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronDoubleRightIcon className="size-5" />
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}