import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useRef, useEffect } from 'react';

// [SỬA] Import dữ liệu từ các file mock mới
import { mockCourses } from '@/components/data/~mock-courses'; // <-- Import mới
import {
  mockLanguages,
  mockLocations,
  createPastRegistration,
} from '@/components/data/~mock-register';


// --- BIẾN ĐỔI SVG THÀNH COMPONENT (Giữ nguyên) ---

// SVG cho icon đầu mỗi danh mục
const SectionIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15.8333 2.5H4.16667C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V4.16667C17.5 3.25 16.75 2.5 15.8333 2.5ZM14.1667 10.8333H10.8333V14.1667H9.16667V10.8333H5.83333V9.16667H9.16667V5.83333H10.8333V9.16667H14.1667V10.8333Z" fill="#3D4863" />
  </svg>
);

// SVG cho Môn học
const SubjectIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="33" height="28" viewBox="0 0 33 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19.0201 19.318H5.43359V21.5907H19.0201V19.318ZM27.1721 10.2271H5.43359V12.4998H27.1721V10.2271ZM5.43359 17.0453H27.1721V14.7726H5.43359V17.0453ZM5.43359 5.68164V7.95437H27.1721V5.68164H5.43359Z" fill="#A3ACC2" />
  </svg>
);

// SVG cho Ngôn ngữ
const LanguageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_1075_2849_lang)"><path d="M4 5H11" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 3V5C9 9.418 6.761 13 4 13" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 9C4.997 11.144 7.952 12.908 11.7 13" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 20L16 11L20 20" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M19.0984 18H12.8984" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
    <defs><clipPath id="clip0_1075_2849_lang"><rect width="24" height="24" fill="white" /></clipPath></defs>
  </svg>
);

// SVG cho Loại hình
const SessionTypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_1075_2849_type)"><path d="M4 5H11" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 3V5C9 9.418 6.761 13 4 13" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 9C4.997 11.144 7.952 12.908 11.7 13" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 20L16 11L20 20" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M19.0984 18H12.8984" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
    <defs><clipPath id="clip0_1075_2849_type"><rect width="24" height="24" fill="white" /></clipPath></defs>
  </svg>
);

// SVG cho Địa điểm
const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_1075_2875_loc)"><path d="M4 21V14" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 10V3" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21V12" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 8V3" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 21V16" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 12V3" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 14H7" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 8H15" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 16H23" stroke="#A3ACC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
    <defs><clipPath id="clip0_1075_2875_loc"><rect width="24" height="24" fill="white" /></clipPath></defs>
  </svg>
);

// --- [SỬA] Định nghĩa kiểu dữ liệu cho Dropdown ---
// (Dùng chung cho Môn học, Ngôn ngữ, Địa điểm...)
interface DropdownOption {
  id: string;
  name: string;
}

// [SỬA] Tùy chọn cho Loại hình
const sessionTypeOptions: DropdownOption[] = [
  { id: 'offline', name: 'Học trực tiếp' },
  { id: 'online', name: 'Học online' },
];

// === COMPONENT CHÍNH ===

export function StudentRegister() {

  // [SỬA] Chuyển đổi mockCourses thành định dạng DropdownOption
  const subjectOptions: DropdownOption[] = mockCourses.map(course => ({
    id: course.id,
    name: `${course.title} (${course.code})`, // Hiển thị cả tên và code
  }));

  // State cho form
  const [subject, setSubject] = useState(subjectOptions[0]); // [SỬA] Dùng dropdown
  const [language, setLanguage] = useState(mockLanguages[0]);
  const [sessionType, setSessionType] = useState(sessionTypeOptions[0]); // [SỬA] Dùng dropdown
  const [location, setLocation] = useState(mockLocations[1]);
  const [specialRequest, setSpecialRequest] = useState(
    ``
  );

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Read current user from localStorage (if present) and include studentName
    let studentName: string | undefined;
    try {
      const rawUserStore = localStorage.getItem('userStore');
      const userStore = rawUserStore ? JSON.parse(rawUserStore as string) : null;
      const State = userStore?.state ?? null;
      const userLocalStore = State?.user ?? null;
      studentName = userLocalStore?.firstName ?? undefined;
    } catch {
      // If parsing fails, continue without studentName
      studentName = undefined;
    }

    // create a new registration in the mock store
    createPastRegistration({
      course: subject,
      language,
      sessionType,
      // only include location when session is offline; for online we'll omit it
      ...(sessionType.id !== 'online' ? { location } : {}),
      specialRequest,
      ...(studentName ? { studentName } : {}),
    });
    setSubmitted(true);
    setTimeout(() => navigate({ to: '/registration-history' }), 1500);
  };

  return (
    <div className="bg-gray-100">
      {/* Header (Giữ nguyên) */}
      <div className=" bg-blue-800 p-6 text-white">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100">
          <ArrowLeftIcon className="size-5" />
          Quay lại
        </Link>
        <h1 className="mt-4 text-3xl font-bold">
          Register Tutor Program - Student
        </h1>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form
          className="relative mx-auto mt-8 rounded-lg bg-white shadow-lg"
          onSubmit={handleSubmit}
        >
          {submitted && (
            <div className="absolute bottom-0 left-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-md bg-green-600 px-4 py-2 text-sm text-white shadow">
              Đăng ký thành công
            </div>
          )}
          {/* Container cho các trường */}
          <div className="space-y-8 p-8">

            {/* [SỬA] Môn học (thành Dropdown) */}
            <FormSection title="Môn học">
              <FormDropdown
                icon={<SubjectIcon className="size-5" />}
                options={subjectOptions}
                selected={subject}
                onSelect={setSubject}
              />
            </FormSection>

            {/* Ngôn ngữ (Giữ nguyên) */}
            <FormSection title="Ngôn ngữ">
              <FormDropdown
                icon={<LanguageIcon className="size-5" />}
                options={mockLanguages}
                selected={language}
                onSelect={setLanguage}
              />
            </FormSection>

            {/* [SỬA] Loại hình (thành Dropdown) */}
            <FormSection title="Loại hình">
              <FormDropdown
                icon={<SessionTypeIcon className="size-5" />}
                options={sessionTypeOptions}
                selected={sessionType}
                onSelect={setSessionType}
              />
            </FormSection>

            {/* Địa điểm (chỉ hiển thị khi chọn offline) */}
            {sessionType.id !== 'online' && (
              <FormSection title="Địa điểm">
                <FormDropdown
                  icon={<LocationIcon className="size-5" />}
                  options={mockLocations}
                  selected={location}
                  onSelect={setLocation}
                />
              </FormSection>
            )}

            {/* Yêu cầu đặc biệt (Giữ nguyên) */}
            <FormSection title="Yêu cầu đặc biệt">
              <FormTextArea
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                rows={8}
              />
            </FormSection>
          </div>

          {/* Footer Nút bấm (GigetY nguyên) */}
          <div className="flex justify-end gap-4 rounded-b-lg border-t border-gray-200 bg-gray-50 p-6">
            <Link
              to='/dashboard'
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-blue-700 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- CÁC COMPONENT FORM HELPER (Giữ nguyên và tái sử dụng) ---

// Helper: FormSection
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}
function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-base font-semibold text-gray-800">
        <SectionIcon />
        {title}
      </label>
      {children}
    </div>
  );
}

// Helper: FormTextArea
function FormTextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 shadow-custom-yellow focus:border-blue-500 focus:ring-blue-500"
      {...props}
    />
  );
}

// Helper: FormDropdown
interface FormDropdownProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  options: DropdownOption[];
  selected: DropdownOption;
  onSelect: (option: DropdownOption) => void;
}
function FormDropdown({ icon, options, selected, onSelect }: FormDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="relative w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-12 pr-10 text-left text-gray-900 shadow-custom-yellow focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {React.cloneElement(icon, { className: "h-5 w-5 text-gray-400" })}
        </span>
        <span className="block truncate">{selected.name}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <ChevronDownIcon className={`size-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.id}
                className={`cursor-pointer px-4 py-2 text-gray-900 ${option.id === selected.id
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-50'
                  }`}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}