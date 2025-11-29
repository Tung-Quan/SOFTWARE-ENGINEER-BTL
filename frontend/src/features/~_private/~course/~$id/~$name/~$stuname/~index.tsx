import { ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import React, { useState, type SVGProps, useMemo } from 'react';

import { mockCourses } from '@/components/data/~mock-courses';
import { mockSessions } from '@/components/data/~mock-session';
import { getSubmissionBySubmissionId, updateSubmission } from '@/components/data/~mock-submissions';
import { ArrowLeft } from '@/components/icons';
import StudyLayout from '@/components/study-layout';
import filePDF from '/group07_report 02.pdf';


/**
 * Format một chuỗi ISO date thành "HH:mm DD/MM/YYYY"
 */
function formatISODate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${time} ${day}`;
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Tạo email giả từ tên
 */
function createFakeEmail(name: string): string {
  const noDiacritics = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
  const emailPrefix = noDiacritics.replace(/\s+/g, '.');
  return `${emailPrefix}@gmail.com`;
}


// --- Icons (Giữ nguyên) ---
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

// --- Hàm Helper (Giữ nguyên) ---
const getScoreColor = (score?: number) => {
  if (score === undefined) return 'text-gray-500';
  if (score >= 7) return 'text-green-600';
  if (score >= 5) return 'text-[#F9BA08]';
  return 'text-[#EA4335]';
};

// --- Định nghĩa Route (Giữ nguyên) ---
export const Route = createFileRoute('/_private/course/$id/$name/$stuname/' as any)({
  component: RouteComponent,
});

// --- Component Chính Của Trang ---
function RouteComponent() {
  const { id, name, stuname } = useParams({ from: Route.id });

  const matchingEntry = useMemo(() => {
    // Normalize stuname (chuyển về lowercase và xóa khoảng trắng)
    const normalizedStuname = stuname.toLowerCase().replace(/\s+/g, '.');
    
    // 1. Lấy tất cả submissions cho submissionId này (name là submissionId như s1, s2, s3)
    const submissions = getSubmissionBySubmissionId(name);
    
    if (submissions.length === 0) {
      return null;
    }

    // 2. Lấy tất cả members từ tất cả sessions (chỉ lấy 1 lần)
    const allMembers = mockSessions.flatMap(s => s.members);

    // 3. Tìm tất cả members có tên khớp với stuname
    const matchingMembers = allMembers.filter(m => {
      const email = createFakeEmail(m.name);
      const emailSlug = email.split('@')[0];
      return emailSlug === normalizedStuname;
    });

    // 4. Duyệt qua submissions để tìm member có trong matchingMembers
    for (const sub of submissions) {
      // Tìm member trong danh sách matching
      const member = matchingMembers.find(m => m.id === sub.memberId);
      
      if (member && sub.submittedAt) {
        const email = createFakeEmail(member.name);
        
        return {
          submissionId: name,
          memberId: sub.memberId,
          name: member.name,
          email: email,
          submittedAt: formatISODate(sub.submittedAt),
          score: sub.score,
          comment: sub.comment ?? '',
          fileUrl: sub.file ?? filePDF,
        };
      }
    }

    return null;
  }, [name, stuname, id]);


  // [THAY ĐỔI] Khởi tạo state từ dữ liệu động
  const [activeTab, setActiveTab] = useState<'baiLam' | 'nhanXet'>('baiLam');
  const [comment, setComment] = useState(matchingEntry?.comment || '');
  const [score, setScore] = useState<number | undefined>(matchingEntry?.score);

  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  // Update state when matchingEntry changes
  React.useEffect(() => {
    if (matchingEntry) {
      setComment(matchingEntry.comment || '');
      setScore(matchingEntry.score);
      setHasChanges(false);
    }
  }, [matchingEntry]);

  // Mark as changed when score or comment changes
  React.useEffect(() => {
    if (matchingEntry) {
      const scoreChanged = score !== matchingEntry.score;
      const commentChanged = comment !== matchingEntry.comment;
      setHasChanges(scoreChanged || commentChanged);
    }
  }, [score, comment, matchingEntry]);

  // Handler to save score and comment
  const handleSave = () => {
    if (!matchingEntry) return;

    updateSubmission(matchingEntry.submissionId, matchingEntry.memberId, {
      score,
      comment,
    });

    setHasChanges(false);
    alert('Đã lưu thành công!');
  };

  const course = useMemo(() => {
    return mockCourses.find((c) => c.id === id) ?? mockCourses[0];

  }, [id]);
  // [THAY ĐỔI] Xử lý trường hợp không tìm thấy
  if (!matchingEntry) {
    return (
      <StudyLayout>
        <div className="w-full font-['Archivo']">
          {/* Back button */}
          <Link
            // onClick={() => navigate({ to: '/dashboard' })}
            to={`/course/${id}/${name}` as string}
            className="mb-6 flex items-center gap-2 text-[#3D4863] transition hover:text-blue-700"
          >
            <ArrowLeft className="size-5" />
            <span className="font-medium">Quay lại</span>
          </Link>
          {/* Course header */}
          <div
            className="relative rounded-lg p-8 text-white shadow-lg"
            style={{
              backgroundImage: `url(${course.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '250px',
            }}
          >
            <div className="relative z-10">
              <p className="mb-2 text-sm font-medium text-gray-200">
                {course.code}
              </p>
              <h1 className="mb-3 text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-gray-100">
                Giảng viên: {course.instructor}
              </p>

              {/* Button "tổng quan" + "Đánh giá" */}
              <div className="mt-6 flex gap-4">
                <Link
                  to={`/course/${id}` as any}
                  className="rounded-lg bg-white px-4 py-2 font-medium text-[#0329E9] backdrop-blur-sm transition hover:bg-white/80"
                >
                  Tổng quan
                </Link>

                <button className="rounded-lg bg-[#0329E9] px-4 py-2 font-medium backdrop-blur-sm transition hover:bg-[#0329E9]/80">
                  Đánh giá
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-8 text-center text-gray-700 shadow-md">
            <h1 className="text-xl font-bold">Không tìm thấy bài nộp</h1>
            <p>Không tìm thấy dữ liệu cho sinh viên "{stuname}".</p>
          </div>
        </div>
      </StudyLayout>
    );
  }

  // Nếu tìm thấy, render component
  const scoreColor = getScoreColor(score);

  return (
    <StudyLayout>
      <div className="w-full font-['Archivo']">
        {/* 1. Nút quay lại (Giữ nguyên) */}
        <Link
          to="/course/$id/$name"
          params={{ id, name } as any}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#3D4863] transition hover:text-blue-700"
        >
          <ArrowLeftIcon className="size-5" />
          <span>Quay lại</span>
        </Link>

        {/* 2. Header thông tin bài nộp [Dùng matchingEntry] */}
        <header className="flex items-center gap-4">
          <UserCircleIcon className="size-20 shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{matchingEntry.name}</h1>
            <p className="text-sm text-gray-500">{matchingEntry.email}</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="size-4" />
              <span>{matchingEntry.submittedAt}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Điểm: </span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value))}
                aria-label="Điểm số"
                className={`w-20 rounded-md border-gray-300 px-2 py-1 text-sm font-bold ${scoreColor} shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </header>

        {/* 3. Thanh điều hướng Tab (Giữ nguyên) */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap items-center gap-x-2 gap-y-1">
            <button
              onClick={() => setActiveTab('baiLam')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === 'baiLam'
                ? 'bg-[#0329E9] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Bài làm
            </button>
            <button
              onClick={() => setActiveTab('nhanXet')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === 'nhanXet'
                ? 'bg-[#0329E9] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Nhận xét
            </button>

            <a
              href={matchingEntry.fileUrl} // [Dùng matchingEntry]
              download
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#0329E9] transition hover:bg-blue-50"
            >
              <ArrowDownTrayIcon className="size-5" />
              Tải bài làm
            </a>

            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${hasChanges
                ? 'text-[#0329E9] hover:bg-blue-50'
                : 'cursor-not-allowed text-gray-400'
                }`}
            >
              Cập nhật
            </button>

            <span className={`rounded-lg px-4 py-2 text-sm font-medium ${hasChanges ? 'text-orange-600' : 'text-gray-400'
              }`}>
              {hasChanges ? 'Có thay đổi chưa lưu' : 'Đã lưu'}
            </span>
          </nav>
        </div>

        {/* 4. Vùng nội dung (Render có điều kiện) [Dùng matchingEntry] */}
        <div className="mt-6">
          {activeTab === 'baiLam' && (
            <div className="rounded-lg bg-white p-4 shadow-xl md:p-6">
              <div className="aspect-[3/4] max-h-[1000px] w-full overflow-hidden rounded-md border border-gray-200">
                <iframe
                  src={filePDF} // [Dùng matchingEntry]
                  className="size-full"
                  title={`Bài nộp của ${matchingEntry.name}`}
                />
              </div>
            </div>
          )}

          {activeTab === 'nhanXet' && (
            <div className="rounded-lg border border-gray-300 bg-white p-4 md:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Nhận xét:
              </h2>
              <div className="mt-4">
                <textarea
                  rows={10}
                  name="comment"
                  id="comment"
                  className="block w-full rounded-md border-black p-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nhập nhận xét..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white transition ${hasChanges
                    ? 'bg-[#0329E9] hover:bg-blue-700'
                    : 'cursor-not-allowed bg-gray-400'
                    }`}
                >
                  Lưu nhận xét
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudyLayout>
  );
}