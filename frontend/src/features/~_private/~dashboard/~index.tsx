import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';

import boxSvg from '@/assets/box.svg';
import { mockCourses, type Course } from '@/components/data/~mock-courses';
import ChevronLeft from '@/components/icons/arrow-left';
import ChevronRight from '@/components/icons/arrow-right';
import ChevronDown from '@/components/icons/chevron';
import ChevronsLeft from '@/components/icons/double-chevron';
import ChevronsRight from '@/components/icons/double-chevron';
import Search from '@/components/icons/search';
import StudyLayout from '@/components/study-layout';

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const navigate = useNavigate();  

  return (
    <div
      className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}
      onClick={() =>
        navigate({ to: '/course/$id', params: { id: course.id } })
      }
    >
      <div
        className="relative flex h-48 flex-col justify-between bg-black p-4 text-white"
        style={{
          backgroundImage: `url(${course.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div>
          <p className="text-xs font-medium text-gray-200">{course.code}</p>
          <h3 className="text-xl font-bold leading-tight text-white">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-gray-100">{course.instructor}</p>
        </div>
        <button
          aria-label="Mở khóa học"
          title="Mở khóa học"
          className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-white text-blue-700 shadow-md transition duration-300 hover:scale-110"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="bg-white p-4">
        <div className="flex justify-around text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-800">
              {course.stats.documents}
            </span>
            <span className="text-xs text-gray-500">Tài liệu</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-800">
              {course.stats.links}
            </span>
            <span className="text-xs text-gray-500">Đường dẫn</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-800">
              {course.stats.assignments}
            </span>
            <span className="text-xs text-gray-500">Bài tập</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  children,
  ...props
}) => {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 leading-tight text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="size-4" />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_private/dashboard/')({
  component: DashboardComponent,
});

function DashboardComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortOrder, setSortOrder] = useState('newest');

  const isFirstDisabled = currentPage === 1;
  const totalPages = Math.max(1, Math.ceil(mockCourses.length / itemsPerPage));
  const isLastDisabled = currentPage === totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCourses = mockCourses.slice(startIndex, endIndex);

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <StudyLayout>
      <h1
        className="mb-8 text-4xl font-bold text-gray-800"
        style={{ fontFamily: 'Archivo' }}
      >
        Khóa học
      </h1>

      <div
        className="rounded-lg border border-gray-500 bg-white p-6 shadow-sm"
        style={{ fontFamily: 'Archivo' }}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Danh sách khóa học của bạn
        </h2>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative min-w-0 flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="size-5" />
            </span>
            <input
              type="text"
              placeholder="Nhập tên khóa học để tìm kiếm..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </Select>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="nameAZ">Tên A-Z</option>
            </Select>
          </div>
        </div>

        {mockCourses.length === 0 ? (
          <div className="mb-8 flex flex-col items-center justify-center py-12">
            <img
              src={boxSvg}
              alt="Không có khóa học"
              className="mb-6 size-28 opacity-90"
            />
            <p className="text-gray-500">Hiện không có khóa học nào</p>
          </div>
        ) : (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {displayedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <nav className="flex items-center justify-center gap-1 text-sm">
          <button
            aria-label="Trang trước nhất"
            title="Trang trước nhất"
            className={`rounded-md p-2 shadow-sm transition-colors ${
              isFirstDisabled
                ? 'bg-white text-blue-700 disabled:cursor-not-allowed disabled:opacity-30'
                : 'bg-[#0329E9] text-white hover:bg-blue-700'
            }`}
            disabled={isFirstDisabled}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronsLeft className="size-4" />
          </button>
          <button
            aria-label="Trang trước"
            title="Trang trước"
            className={`rounded-md p-2 shadow-sm transition-colors ${
              isPrevDisabled
                ? 'bg-white text-blue-700 disabled:cursor-not-allowed disabled:opacity-30'
                : 'bg-[#0329E9] text-white hover:bg-blue-700'
            }`}
            disabled={isPrevDisabled}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <ChevronLeft className="size-4" />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`size-8 rounded-full transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-[#0329E9] font-semibold text-white shadow'
                    : 'bg-white text-gray-800 shadow-sm hover:bg-blue-50'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            aria-label="Trang tiếp"
            title="Trang tiếp"
            className={`rounded-md p-2 shadow-sm transition-colors ${
              isNextDisabled
                ? 'bg-white text-blue-700 disabled:cursor-not-allowed disabled:opacity-30'
                : 'bg-[#0329E9] text-white hover:bg-blue-700'
            }`}
            disabled={isNextDisabled}
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            aria-label="Trang cuối"
            title="Trang cuối"
            className={`rounded-md p-2 shadow-sm transition-colors ${
              isLastDisabled
                ? 'bg-white text-blue-700 disabled:cursor-not-allowed disabled:opacity-30'
                : 'bg-[#0329E9] text-white hover:bg-blue-700'
            }`}
            disabled={isLastDisabled}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronsRight className="size-4" />
          </button>
        </nav>
      </div>
    </StudyLayout>
  );
}
