import { createFileRoute, Link } from '@tanstack/react-router';
import { type SVGProps, useState, useMemo } from 'react'; // << [THAY ĐỔI] Import thêm useState, useMemo

import { mockCourses, dataCourses } from '@/components/data/~mock-courses';
import { mockSessions } from '@/components/data/~mock-session';
import { getAllSubmissions } from '@/components/data/~mock-submissions';
import ArrowLeft from '@/components/icons/arrow-left';
import Search from '@/components/icons/search';
import StudyLayout from '@/components/study-layout';


// === ICONS (Giữ nguyên) ===
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

// === Định nghĩa Route (Giữ nguyên) ===
export const Route = createFileRoute('/_private/course/$id/submissions/')({
  component: RouteComponent,
});

// === Component SubmissionItem (Giữ nguyên) ===

const getScoreColor = (score?: number) => {
  if (score === undefined) return 'text-gray-500';
  if (score >= 7) return 'text-green-600';
  if (score >= 5) return 'text-[#F9BA08]';
  return 'text-[#EA4335]';
};

type SubmissionEntry = {
  name: string;
  email: string;
  submittedAt: string;
  score?: number;
  submissionName?: string; 
  submissionId?: string;
};

function SubmissionItem({ entry, courseId }: { entry: SubmissionEntry; courseId: string }) {
  const { name, email, submittedAt, score, submissionName, submissionId } = entry;
  const scoreColor = getScoreColor(score);

  const stuname = email.split('@')[0];

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-white p-5 shadow-custom-yellow">
      {/* Thông tin sinh viên & thời gian và tên bài nộp*/}
      <div className="flex items-center gap-4">
        <UserCircleIcon className="size-12 shrink-0 text-gray-500" />
        <div className="flex flex-col gap-1.5">
          <div>
            <Link to={`/profile/$id` as string} className="text-xs font-semibold text-blue-600">{name}</Link>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="size-4" />
            <span>{submittedAt}</span>
          </div>
          <div className="text-sm text-gray-600">
            Bài nộp: <span className="font-medium text-gray-900">{submissionName}</span>
          </div>
        </div>
      </div>

      {/* Điểm & Nút bấm */}
      <div className="flex shrink-0 items-center gap-6">
        {score !== undefined ? (
          <span className={`text-xl font-bold ${scoreColor}`}>
            {score.toLocaleString('vi-VN')} điểm
          </span>
        ) : (
          <span className="text-sm font-medium text-gray-500">Chưa chấm</span>
        )}
        <Link
          to={"/course/$id/$name/$stuname" as any}
          params={{ id: courseId, name: submissionId || 'submission1', stuname } as any}
          className="rounded-lg bg-[#0329E9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Xem bài nộp
        </Link>
      </div>
    </div>
  );
}


function parseSubmissionDate(dateString: string): Date {
  try {
    const parts = dateString.split(' '); // ['19:00', '10/10/2024']
    const timeParts = parts[0].split(':'); // ['19', '00']
    const dateParts = parts[1].split('/'); // ['10', '10', '2024'] (DD, MM, YYYY)

    return new Date(
      +dateParts[2],       // year
      +dateParts[1] - 1,   // month (0-indexed)
      +dateParts[0],       // day
      +timeParts[0],       // hours
      +timeParts[1]        // minutes
    );
  } catch (e: string | any) {
    console.error('Lỗi parse ngày tháng:', e);
    return new Date(0);
  }
}

function formatISODate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${time} ${day}`; // Format: "19:00 10/10/2024"
  } catch (e) {
    console.error('Lỗi format ngày:', e);
    return 'Invalid Date';
  }
}

function createFakeEmail(name: string): string {
  const noDiacritics = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
  const emailPrefix = noDiacritics.replace(/\s+/g, '.');
  return `${emailPrefix}@gmail.com`;
}


function RouteComponent() {
  const { id } = Route.useParams() as { id: string }; // 'id' này là courseId

  const [searchEmail, setSearchEmail] = useState('');
  const [sortOrder, setSortOrder] = useState('Cũ nhất');
  const navigate = Route.useNavigate();
  const course = mockCourses.find(c => c.id === id)!;

  const allSubmissions: SubmissionEntry[] = useMemo(() => {
    // // 1. Lọc các session thuộc khóa học này
    // const courseSessions = mockSessions.filter(
    //   (s) => s.courseId === id,
    // );

    // return courseSessions.flatMap((session) =>
    //   session.members.map(member => {
    //     // 3. Tạo dữ liệu 'SubmissionEntry'
    //     const score = generateRandomScore(); // Tạo điểm ngẫu nhiên
    //     return {
    //       name: member.name,
    //       email: createFakeEmail(member.name), // Tạo email giả
    //       submittedAt: formatISODate(session.start), // Dùng ngày bắt đầu session
    //       score: score,
    //       submissionName: session.title, // Dùng tiêu đề session làm "submissionName"
    //     };
    //   })
    // );
    const submission = getAllSubmissions();
    const courseData = dataCourses.find(c => c.id === id);
    
    return submission
      .filter(sub => sub.submittedAt) 
      .map((sub) => {
        const member = mockSessions
          .flatMap(s => s.members)
          .find(m => m.id === sub.memberId);
        
        // Tìm submission content từ dataCourses
        const submissionContent = courseData?.content.find(
          item => item.id === sub.submissionId && item.type === 'submission'
        );
        
        return {
          name: member ? member.name : 'Unknown',
          email: createFakeEmail(member ? member.name : 'unknown'),
          submittedAt: formatISODate(sub.submittedAt!),
          score: sub.score,
          submissionName: submissionContent?.title || 'Submission',
          submissionId: sub.submissionId,
        };
      });
  }, [id]); 

  const displayedSubmissions = allSubmissions
    .filter(entry =>
      entry.email.toLowerCase().includes(searchEmail.toLowerCase())
    )
    .sort((a, b) => {
      // 4. Sắp xếp dựa trên state `sortOrder`
      const dateA = parseSubmissionDate(a.submittedAt);
      const dateB = parseSubmissionDate(b.submittedAt);

      if (sortOrder === 'Mới nhất') {
        return dateB.getTime() - dateA.getTime(); // Mới nhất lên đầu
      }
      return dateA.getTime() - dateB.getTime(); // Cũ nhất lên đầu (mặc định)
    });

  return (
    <StudyLayout>
      {/* Back button (vẫn hoạt động) */}
      {/* <Link
          to={'/course/$id' as any}
          className="mb-6 flex items-center gap-2 text-[#3D4863] transition hover:text-blue-700"
        >
          <ArrowLeft className="size-5" />
          <span className="font-medium">Quay lại</span>
        </Link> */}
      <div>
        {/* Back button */}
        <button
          onClick={() => navigate({ to: `/course/${id}` })}
          className="mb-6 flex items-center gap-2 text-[#3D4863] transition hover:text-blue-700"
        >
          <ArrowLeft className="size-5" />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Course header with background */}
        <div
          className="relative mb-8 rounded-lg p-8 text-white shadow-lg"
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
              <button
                onClick={() => {
                  navigate({ to: `/course/${id}` });
                }}
                className="rounded-lg bg-white px-4 py-2 font-medium text-[#0329E9] backdrop-blur-sm transition hover:bg-white/80">
                Tổng quan
              </button>
              <button
                onClick={() => {
                  navigate({ to: `/course/${id}/rating` });
                }}
                className="rounded-lg bg-white px-4 py-2 font-medium text-[#0329E9] backdrop-blur-sm transition hover:bg-white/80"
              >
                Đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tiêu đề trang (giữ nguyên) */}
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Tất cả bài nộp
      </h1>

      {/* Thanh filter và search (giữ nguyên) */}
      <div className="flex w-full items-center gap-4 bg-white pb-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search1"
            id="search1"
            className="block w-full rounded-lg border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            placeholder="Tìm kiếm..."
          />
        </div>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search2"
            id="search2"
            className="block w-full rounded-lg border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            placeholder="Nhập email học sinh để tìm kiếm ..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>

        <div>
          <select
            aria-label="Sắp xếp bài nộp theo"
            id="sort"
            name="sort"
            className="block w-full min-w-[120px] rounded-lg border-gray-300 py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option>Cũ nhất</option>
            <option>Mới nhất</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {displayedSubmissions.length > 0 ? (
          displayedSubmissions.map((entry) => (
            (<SubmissionItem key={`${entry.email}-${entry.submittedAt}`} entry={entry} courseId={id} />)
          ))
        ) : (
          <div className="py-10 text-center text-gray-500">
            <p>Không tìm thấy bài nộp nào.</p>
          </div>
        )}
      </div>
    </StudyLayout>
  )
}