import { createFileRoute, Link } from '@tanstack/react-router';
import { type SVGProps, useMemo } from 'react';

import { dataCourses, mockCourses } from '@/components/data/~mock-courses';
import { getSessionMember } from '@/components/data/~mock-session';
import { getSubmissionBySubmissionId, SubmissionData } from '@/components/data/~mock-submissions';
import ArrowLeft from '@/components/icons/arrow-left';
import StudyLayout from '@/components/study-layout';


// === ICONS ===
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

// === Định nghĩa Route ===
export const Route = createFileRoute('/_private/course/$id/$name/')({
  component: RouteComponent,
});

function formatISODate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${time} ${day}`; // Format: "19:00 10/10/2024"
  } catch {
    return 'Invalid Date';
  }
}



// === Các Component con (Giữ nguyên) ===

const getScoreColor = (score?: number) => {
  if (score === undefined) return 'text-gray-500';
  if (score >= 7) return 'text-green-600';
  if (score >= 5) return 'text-[#F9BA08]';
  return 'text-[#EA4335]';
};

const getSubmittedAtColor = (submittedAt?: string, dueDate?: string) => {
  if (!submittedAt || !dueDate) return 'text-gray-500';
  const submitted = new Date(submittedAt);
  const due = new Date(dueDate);
  if (submitted <= due) return 'text-green-600';
  return 'text-red-600';
};

function SubmissionRow({ entry, dueDate , id }: { entry: SubmissionData, dueDate?: string, id: string }) {
  const nameEntry = getSessionMember( 's-1', entry.memberId);
  console.log("id:", id);
  return (
    <tr className="border-b last-of-type:border-0">
      <td className="px-4 py-3">
        <Link to={`/profile/$id` as string} className="font-medium text-blue-600">{nameEntry ? nameEntry.name : 'Unknown'}</Link>
      </td>
      <td className="px-4 py-3">
        <div className={`font-medium ${getScoreColor(entry.score)}`}>
          {entry.score !== undefined ? entry.score.toFixed(1) : 'Chưa chấm'}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-gray-700">{entry.comment || 'Không có nhận xét'}</div>
      </td>
      <td className="px-4 py-3">
        {entry.submittedAt !== '' ? (
          <div className={`${getSubmittedAtColor(entry.submittedAt, dueDate)}`}>{formatISODate(entry.submittedAt as string)} 
        {dueDate && (<span> (Hạn: {formatISODate(dueDate)})</span>)}
        </div>
        ) : (
          <div className="text-gray-500">Chưa nộp</div>
        )}
      </td>
      <td className="px-4 py-3">
        <Link
          to={`/course/4/s1/${nameEntry?.name}` as any}
          className="text-blue-600 hover:underline"
        >
          Xem bài nộp
        </Link>
      </td>
    </tr>
  );
}

// === Component chính của Route ===
function RouteComponent() {
  const { id, name } = Route.useParams();
  const course = useMemo(() => {
    return mockCourses.find((c) => c.id === id) ?? mockCourses[0];

  }, [id]);
  const dataCourse = dataCourses.find((c) => c.id === id);

  if (!dataCourse) {
    return (
      <StudyLayout>
        <Link
          to={`/course/${id}/` as string}
          className='mb-4 inline-flex items-center gap-2 text-blue-600 hover:underline'
        >
          <ArrowLeft className='size-4' />
          Quay lại trang khóa học
        </Link>
        <div>Khóa học không tồn tại.</div>
      </StudyLayout>
    )
  }

  const submissions = getSubmissionBySubmissionId(name as string);


  if (!course) {
    return (
      <StudyLayout>
        <Link
          to={`/_private/course/${id}/` as string}
          className='mb-4 inline-flex items-center gap-2 text-blue-600 hover:underline'
        >
          <ArrowLeft className='size-4' />
          Quay lại trang khóa học
        </Link>
        <div>Khóa học không tồn tại.</div>
      </StudyLayout>
    );
  }

  if (!submissions) {
    return (
      <StudyLayout>
        <Link
          to={`/course/${id}/` as string}
          className='mb-4 inline-flex items-center gap-2 text-blue-600 hover:underline'
        >
          <ArrowLeft className='size-4' />
          Quay lại trang khóa học
        </Link>
        <div>Dữ liệu bài nộp không tồn tại.</div>
      </StudyLayout>
    )
  }


  const dataSubmission = dataCourse['content'].find((c) => c.id === name)?.data;
  return (
    <StudyLayout>
      <div className="w-full font-['Archivo']">
        {/* Back button */}
        <Link
          // onClick={() => navigate({ to: '/dashboard' })}
          to={`/course/${id}/` as string}
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
        <div>
          {/* Submission Table */}
          <div className="mt-8 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[600px] table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Tên sinh viên
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Điểm số
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Nhận xét
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Ngày nộp
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Xem bài nộp
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((entry, index) => (
                  <SubmissionRow key={index} entry={entry} dueDate={dataSubmission?.dueDate} id={id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StudyLayout>
  );
}