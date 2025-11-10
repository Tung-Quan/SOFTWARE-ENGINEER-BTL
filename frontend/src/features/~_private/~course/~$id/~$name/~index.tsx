import { createFileRoute, Link } from '@tanstack/react-router';
import type { SVGProps } from 'react';

import { mockSubmissionEntries } from '@/components/data/~mockCourses'; // Import mock data
import ArrowLeft from '@/components/icons/arrow-left';
import Search from '@/components/icons/search';
import StudyLayout from '@/components/study-layout';


// Small SVG icon components used by this page
export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.99 0C4.47 0 0 4.48 0 10C0 15.52 4.47 20 9.99 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 9.99 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18ZM10.5 5H9V11L14.25 14.15L15 12.92L10.5 10.25V5Z" fill="#3D4863" />
    </svg>
  );
}

export function UserCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M23.3333 0C10.4533 0 0 10.4533 0 23.3333C0 36.2133 10.4533 46.6667 23.3333 46.6667C36.2133 46.6667 46.6667 36.2133 46.6667 23.3333C46.6667 10.4533 36.2133 0 23.3333 0ZM23.3333 7C27.2067 7 30.3333 10.1267 30.3333 14C30.3333 17.8733 27.2067 21 23.3333 21C19.46 21 16.3333 17.8733 16.3333 14C16.3333 10.1267 19.46 7 23.3333 7ZM23.3333 40.1333C17.5 40.1333 12.3433 37.1467 9.33333 32.62C9.40333 27.9767 18.6667 25.4333 23.3333 25.4333C27.9767 25.4333 37.2633 27.9767 37.3333 32.62C34.3233 37.1467 29.1667 40.1333 23.3333 40.1333Z" fill="#3D4863" />
    </svg>
  );
}


// Định nghĩa Route
export const Route = createFileRoute('/_private/course/$id/$name/')({
  component: RouteComponent,
});

// === Các Component con ===

/**
 * Hiển thị màu sắc dựa trên điểm số
 */
const getScoreColor = (score?: number) => {
  if (score === undefined) return 'text-gray-500';
  if (score >= 7) return 'text-green-600'; // 7.5 điểm (xanh)
  if (score >= 5) return 'text-[#F9BA08]'; // 5 điểm (vàng)
  return 'text-[#EA4335]'; // 2.5 điểm (đỏ)
};

type SubmissionEntry = {
  name: string;
  email: string;
  submittedAt: string;
  score?: number;
};

/**
 * Component cho một hàng bài nộp của sinh viên
 */
function SubmissionItem({ entry, courseId, assignmentName }: { entry: SubmissionEntry; courseId: string; assignmentName: string }) {
  const { name, email, submittedAt, score } = entry;
  const scoreColor = getScoreColor(score);
  
  // Tạo slug từ email để dùng làm stuname trong URL
  const stuname = email.split('@')[0]; // Lấy phần trước @ của email làm slug đơn giản

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-white p-5 shadow-custom-yellow">
      {/* Thông tin sinh viên & thời gian */}
      <div className="flex items-center gap-4">
        <UserCircleIcon className="size-12 shrink-0 text-gray-500" />
        <div className="flex flex-col gap-1.5">
          {/* Tên & Email */}
          <div>
            <p className="text-xs font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          {/* Thời gian */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="size-4" />
            <span>{submittedAt}</span>
          </div>
        </div>
      </div>

      {/* Điểm & Nút bấm */}
      <div className="flex shrink-0 items-center gap-6">
        {score !== undefined && (
          <span className={`text-xl font-bold ${scoreColor}`}>
            {/* Dùng toLocaleString để hiển thị dấu phẩy 7,5 */}
            {score.toLocaleString('vi-VN')} điểm
          </span>
        )}
        <Link
          to={"/course/$id/$name/$stuname" as any}
          params={{ id: courseId, name: assignmentName, stuname } as any}
          className="rounded-lg bg-[#0329E9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Xem bài nộp
        </Link>
      </div>
    </div>
  );
}

// === Component chính của Route ===

function RouteComponent() {
  const { id, name } = Route.useParams();

  // Lấy data bài nộp dựa trên id (courseId) và name (submissionId)
  const submissions = mockSubmissionEntries[id]?.[name] ?? [];

  return (
    <StudyLayout>
      <div className="container mx-auto max-w-5xl rounded-2xl border border-[#3D4863] p-2 py-8">
        {/* Back button */}
        <Link
          to={'/course/$id' as any}
          className="mb-6 flex items-center gap-2 text-[#3D4863] transition hover:text-blue-700"
        >
          <ArrowLeft className="size-5" />
          <span className="font-medium">Quay lại</span>
        </Link>
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          {name}
        </h1>
        <div className="flex w-full items-center gap-4 bg-white pb-4">

          {/* ===== Thanh Tìm Kiếm 1 (Rỗng) ===== */}
          <div className="relative flex-1">
            {/* Icon tìm kiếm */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="size-5 text-gray-400" aria-hidden="true" />
            </div>

            {/* Ô input */}
            <input
              type="text"
              name="search1"
              id="search1"
              className="block w-full rounded-lg border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              placeholder="Tìm kiếm..."
            />
          </div>

          {/* ===== Thanh Tìm Kiếm 2 (Có placeholder) ===== */}
          <div className="relative flex-1">
            {/* Icon tìm kiếm */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="size-5 text-gray-400" aria-hidden="true" />
            </div>

            {/* Ô input */}
            <input
              type="text"
              name="search2"
              id="search2"
              className="block w-full rounded-lg border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              placeholder="Nhập email học sinh để tìm kiếm ..."
            />
          </div>

          {/* ===== Bộ lọc Dropdown (Cũ nhất) ===== */}
          <div>
            <select
              aria-label="Sắp xếp bài nộp theo"
              id="sort"
              name="sort"
              className="block w-full min-w-[120px] rounded-lg border-gray-300 py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              defaultValue="Cũ nhất"
            >
              <option>Cũ nhất</option>
              <option>Mới nhất</option>
            </select>
          </div>

        </div>
        <div className="space-y-6">
          {submissions.length > 0 ? (
            submissions.map((entry, index) => (
              <SubmissionItem key={index} entry={entry} courseId={id} assignmentName={name} />
            ))
          ) : (
            <div className="py-10 text-center text-gray-500">
              <p>Không tìm thấy bài nộp nào.</p>
            </div>
          )}
        </div>
      </div>
    </StudyLayout>
  );
}