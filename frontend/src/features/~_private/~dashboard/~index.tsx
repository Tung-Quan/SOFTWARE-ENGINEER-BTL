import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';

import ArrowLeft from '@/components/icons/arrow-left';
// Giả lập các icon để làm ví dụ, bạn có thể thay bằng icon thật
import DocumentIcon from '@/components/icons/document'; // Giả lập
import AssignmentIcon from '@/components/icons/assignment'; // Giả lập
import LinkIcon from '@/components/icons/link'; // Giả lập

import StudyLayout from '@/components/study-layout';
import { mockCourses } from '@/data/~mockCourses';

export const Route = createFileRoute('/_private/dashboard/')({
  component: CourseDetailsComponent,
});

// --- Mock Data Chi Tiết ---
// Thêm mock data chi tiết cho khóa học
// Thường thì bạn sẽ muốn thêm cái này vào file `~mockCourses.ts`
// nhưng tôi sẽ thêm trực tiếp ở đây để bạn dễ hình dung.
const courseDetailsMock = {
  description:
    'Khóa học này cung cấp kiến thức nền tảng và thực hành chuyên sâu về {TITLE}. Sinh viên sẽ được học tập qua các tài liệu, bài giảng video, và hoàn thành các bài tập thực hành để củng cố kỹ năng. Mục tiêu của khóa học là giúp sinh viên tự tin áp dụng kiến thức vào các dự án thực tế.',
  documents: [
    { id: 'doc1', title: 'Chương 1: Giới thiệu về React.pdf', type: 'pdf' },
    { id: 'doc2', title: 'Chương 2: Cài đặt môi trường.pdf', type: 'pdf' },
    { id: 'doc3', title: 'Bài giảng tuần 1.pptx', type: 'slide' },
  ],
  links: [
    { id: 'link1', title: 'Tài liệu React chính thức', url: 'https://react.dev' },
    {
      id: 'link2',
      title: 'Tài liệu TanStack Router',
      url: 'https://tanstack.com/router',
    },
  ],
  assignments: [
    {
      id: 'as1',
      title: 'Bài tập 1: Cài đặt môi trường và tạo Project',
      dueDate: '2025-11-10',
    },
    {
      id: 'as2',
      title: 'Bài tập 2: Xây dựng Component cơ bản',
      dueDate: '2025-11-17',
    },
  ],
};

// --- Mock Components (Icon) ---
// Vì tôi không có file icon của bạn, tôi sẽ tạo mock component cho chúng
// Bạn hãy thay thế bằng các component icon thật của bạn nhé.
const MockIcon: React.FC<{ className?: string; type: string }> = ({
  className,
  type,
}) => {
  const iconText =
    type === 'pdf'
      ? 'PDF'
      : type === 'slide'
        ? 'SLD'
        : type === 'link'
          ? 'URL'
          : 'BT';
  const colorClass =
    type === 'pdf'
      ? 'bg-red-100 text-red-700'
      : type === 'slide'
        ? 'bg-yellow-100 text-yellow-700'
        : type === 'link'
          ? 'bg-green-100 text-green-700'
          : 'bg-orange-100 text-orange-700';

  return (
    <span
      className={`flex size-10 items-center justify-center rounded-full text-xs font-semibold ${colorClass} ${className}`}
    >
      {iconText}
    </span>
  );
};

function CourseDetailsComponent() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const course = mockCourses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <StudyLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Không tìm thấy khóa học
          </h1>
          <p className="mb-8 text-gray-600">
            Khóa học với ID "{courseId}" không tồn tại.
          </p>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Quay lại Dashboard
          </button>
        </div>
      </StudyLayout>
    );
  }

  // Lấy mô tả và thay thế {TITLE} bằng tên khóa học thật
  const description = courseDetailsMock.description.replace(
    '{TITLE}',
    course.title,
  );

  return (
    <StudyLayout>
      <div style={{ fontFamily: 'Archivo' }}>
        {/* Back button */}
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="mb-6 flex items-center gap-2 text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="size-5" />
          <span className="font-medium">Quay lại Dashboard</span>
        </button>

        {/* Course header with background */}
        <div
          className="relative mb-8 overflow-hidden rounded-lg p-8 text-white shadow-lg"
          style={{
            minHeight: '250px',
          }}
        >
          {/* Lớp phủ mờ + ảnh nền */}
          <div
            className="absolute inset-0 z-0 bg-black/50"
            style={{
              backgroundImage: `url(${course.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(4px)', // Thêm hiệu ứng blur cho ảnh nền
            }}
          />
          <div className="relative z-10">
            <p className="mb-2 text-sm font-medium text-gray-200">
              {course.code}
            </p>
            <h1 className="mb-3 text-4xl font-bold">{course.title}</h1>
            <p className="text-lg text-gray-100">
              Giảng viên: {course.instructor}
            </p>
          </div>
        </div>

        {/* Course statistics (Không thay đổi) */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {course.stats.documents}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Tài liệu học tập
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {course.stats.links}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Đường dẫn tham khảo
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl font-bold text-orange-600">
              {course.stats.assignments}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Bài tập được giao
            </div>
          </div>
        </div>

        {/* Course content sections (Đã cập nhật với mock data) */}
        <div className="space-y-6">
          {/* Cập nhật: Mô tả khóa học */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Mô tả khóa học
            </h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Cập nhật: Tài liệu học tập (hiển thị danh sách) */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Tài liệu học tập
            </h2>
            <ul className="space-y-3">
              {courseDetailsMock.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:bg-gray-100"
                >
                  <MockIcon type={doc.type} />
                  <span className="flex-1 font-medium text-gray-700">
                    {doc.title}
                  </span>
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    Tải về
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cập nhật: Đường dẫn tham khảo (hiển thị danh sách) */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Đường dẫn tham khảo
            </h2>
            <ul className="space-y-3">
              {courseDetailsMock.links.map((link) => (
                <li
                  key={link.id}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:bg-gray-100"
                >
                  <MockIcon type="link" />
                  <span className="flex-1 font-medium text-gray-700">
                    {link.title}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Truy cập
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cập nhật: Bài tập (hiển thị danh sách) */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Bài tập được giao
            </h2>
            <ul className="space-y-3">
              {courseDetailsMock.assignments.map((asm) => (
                <li
                  key={asm.id}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:bg-gray-100"
                >
                  <MockIcon type="assignment" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">
                      {asm.title}
                    </span>
                    <p className="text-sm text-gray-500">
                      Hạn nộp: {asm.dueDate}
                    </p>
                  </div>
                  <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
                    Nộp bài
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </StudyLayout>
  );
}