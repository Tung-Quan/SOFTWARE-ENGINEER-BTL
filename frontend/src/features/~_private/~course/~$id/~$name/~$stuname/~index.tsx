import { ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type SVGProps } from 'react'; // [THAY ĐỔI] Import thêm useState

import StudyLayout from '@/components/study-layout';

// --- Dữ liệu Mock cho trang này ---
const mockSubmissionData = {
  student: {
    name: 'Nguyễn Trần Văn AAA',
    email: 'nguyentranvanaaa123456789@gmail.com',
    submittedAt: '19:00 10/10/2024',
  },
  score: 2.5,
  // Đây là phần mấu chốt: đường dẫn đến file PDF hoặc ảnh của bài nộp
  fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  comment: '', // Dữ liệu mock cho nhận xét
};

// --- Icons (Giữ nguyên) ---
export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.99 0C4.47 0 0 4.48 0 10C0 15.52 4.47 20 9.99 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 9.99 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18ZM10.5 5H9V11L14.25 14.15L15 12.92L10.5 10.25V5Z" fill="#3D4863" />
    </svg>
  );
}
// [THAY ĐỔI] Icon UserCircle lớn hơn và màu đậm hơn để khớp với hình
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
  return 'text-[#EA4335]'; // 2.5 điểm (đỏ)
};

// --- Định nghĩa Route (Giữ nguyên) ---
export const Route = createFileRoute('/_private/course/$id/$name/$stuname/' as any)({
  component: RouteComponent,
});

// --- Component Chính Của Trang ---
function RouteComponent() {
  const { id, name } = Route.useParams() as { id: string; name: string };

  // [THAY ĐỔI] Thêm state để quản lý tab đang active
  const [activeTab, setActiveTab] = useState<'baiLam' | 'nhanXet'>('baiLam');
  // [THAY ĐỔI] Thêm state cho nội dung nhận xét
  const [comment, setComment] = useState(mockSubmissionData.comment);
  // [THAY ĐỔI] Thêm state cho điểm số
  const [score, setScore] = useState(mockSubmissionData.score);

  const data = mockSubmissionData;
  const scoreColor = getScoreColor(score);

  return (
    <StudyLayout>
      <div className="container mx-auto max-w-7xl p-4 py-8 md:p-8">
        {/* 1. Nút quay lại (Giữ nguyên) */}
        <Link
          to="/course/$id/$name"
          params={{ id, name } as any}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#3D4863] transition hover:text-blue-700"
        >
          <ArrowLeftIcon className="size-5" />
          <span>Quay lại</span>
        </Link>

        {/* 2. Header thông tin bài nộp [ĐÃ SỬA LẠI] */}
        <header className="flex items-center gap-4">
          {/* Avatar lớn hơn */}
          <UserCircleIcon className="size-20 shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.student.name}</h1>
            <p className="text-sm text-gray-500">{data.student.email}</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="size-4" />
              <span>{data.student.submittedAt}</span>
            </div>
            {/* Điểm được đưa xuống dưới thông tin */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Điểm: </span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                aria-label="Điểm số"
                className={`w-20 rounded-md border-gray-300 px-2 py-1 text-sm font-bold ${scoreColor} shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </header>

        {/* 3. Thanh điều hướng Tab [ĐÃ SỬA LẠI] */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap items-center gap-x-2 gap-y-1">
            {/* Tab 1: Bài làm (Stateful) */}
            <button
              onClick={() => setActiveTab('baiLam')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === 'baiLam'
                  ? 'bg-[#0329E9] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Bài làm
            </button>
            {/* Tab 2: Nhận xét (Stateful) */}
            <button
              onClick={() => setActiveTab('nhanXet')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === 'nhanXet'
                  ? 'bg-[#0329E9] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Nhận xét
            </button>

            {/* Nút 3: Tải bài làm (Mới) */}
            <a
              href={data.fileUrl}
              download
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#0329E9] transition hover:bg-blue-50"
            >
              <ArrowDownTrayIcon className="size-5" />
              Tải bài làm
            </a>

            {/* Nút 4: Cập nhật (Mới) */}
            <button className="rounded-lg px-4 py-2 text-sm font-medium text-[#0329E9] transition hover:bg-blue-50">
              Cập nhật
            </button>

            {/* Nút 5: Trạng thái lưu (Mới) */}
            <span className="cursor-not-allowed rounded-lg px-4 py-2 text-sm font-medium text-gray-400">
              Có thay đổi/chưa lưu
            </span>
          </nav>
        </div>

        {/* 4. Vùng nội dung (Render có điều kiện) [ĐÃ SỬA LẠI] */}
        <div className="mt-6">
          {/* --- Hiển thị NỘI DUNG BÀI LÀM (PDF/Ảnh) --- */}
          {activeTab === 'baiLam' && (
            <div className="rounded-lg bg-white p-4 shadow-xl md:p-6">
              <div className="aspect-[3/4] max-h-[1000px] w-full overflow-hidden rounded-md border border-gray-200">
                <iframe
                  src={data.fileUrl}
                  className="size-full"
                  title={`Bài nộp của ${data.student.name}`}
                  frameBorder="0"
                />
              </div>
            </div>
          )}

          {/* --- Hiển thị NỘI DUNG NHẬN XÉT --- */}
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
              {/* Bạn có thể thêm nút "Lưu nhận xét" ở đây */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="rounded-lg bg-[#0329E9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
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