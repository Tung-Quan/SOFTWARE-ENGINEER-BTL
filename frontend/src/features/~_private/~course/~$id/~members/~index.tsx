import { 
  ArrowLeftIcon, 
  ClockIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/solid'
import { 
  createFileRoute, 
  useParams, 
  Link 
} from '@tanstack/react-router'
import React from 'react'

// Giả sử đường dẫn đến file mock data
import { mockSessions } from '@/components/data/~mock-session' 
import StudyLayout from '@/components/study-layout' // Import layout

/**
 * Định nghĩa route
 * (File này nên được đặt tại: 
 * src/routes/_private/course/$id/submissions/index.tsx)
 */
export const Route = createFileRoute('/_private/course/$id/members/')({
  component: RouteComponent,
})

// === COMPONENT CHÍNH CỦA TRANG ===
function RouteComponent() {
  // Lấy $id (courseId) từ URL
  const { id: courseId } = useParams({ from: Route.id });

  // Lấy tất cả "lượt nộp bài" (mỗi thành viên trong mỗi session)
  const allSubmissions = React.useMemo(() => {
    // 1. Lọc các session thuộc khóa học này
    const courseSessions = mockSessions.filter(
      (s) => s.courseId === courseId,
    );

    // 2. Biến đổi thành danh sách phẳng: 
    // [memberA-session1, memberB-session1, memberA-session2, ...]
    const submissions = courseSessions.flatMap((session) => 
      session.members.map((member) => ({
        id: `${session.id}-${member.id}`, // Tạo key duy nhất
        name: member.name,
        // Mock-session không có email, tạo email giả
        email: `${member.name.toLowerCase().replace(/\s/g, `.`)}@gmail.com`,
        timestamp: session.start, // Dùng thời gian bắt đầu session
      }))
    );
    
    return submissions;
  }, [courseId]);

  return (
    <StudyLayout>
      {/* 1. Header (chứa nút Quay lại) */}
      <header className="sticky top-0 z-20 bg-white p-4 shadow-sm">
        <Link 
          // Link về route cha
          to="/course/$id" 
          params={{ id: courseId }}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Quay lại
        </Link>
      </header>

      {/* 2. Nội dung chính */}
      <main className="p-4 md:p-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Danh sách bài nộp
        </h1>
        
        {/* 3. Danh sách các item */}
        <div className="space-y-6">
          {allSubmissions.length > 0 ? (
            allSubmissions.map((submission) => (
              <SubmissionItem key={submission.id} submission={submission} courseId={courseId} />
            ))
          ) : (
            <p className="text-gray-600">Không có bài nộp nào cho khóa học này.</p>
          )}
        </div>
      </main>
    </StudyLayout>
  )
}

// === COMPONENT CON: THANH NGANG (ITEM) ===

// Định nghĩa kiểu dữ liệu cho props
interface Submission {
  id: string;
  name: string;
  email: string;
  timestamp: string;
}

function SubmissionItem({ submission, courseId }: { submission: Submission; courseId: string }) {
  // Format thời gian
  const formattedTimestamp = new Date(submission.timestamp).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    // Card item với viền vàng
    <div className="rounded-lg border border-gray-600 bg-white p-5 shadow-custom-yellow">
      {/* Hàng trên: Thông tin user và (chỗ trống của điểm) */}
      <div className="flex items-start justify-between">
        {/* Bên trái: Avatar + Tên + Email */}
        <div className="flex items-center">
          <UserCircleIcon className="size-12 text-gray-400" />
          <div className="ml-3">
            <h2 className="text-lg font-bold text-gray-900">{submission.name}</h2>
            <p className="text-sm text-gray-500">{submission.email}</p>
          </div>
        </div>
        
        {/* Bên phải: Bỏ trống (theo yêu cầu "bỏ số điểm đi") */}
        <div>
          {/* Bỏ trống */}
        </div>
      </div>
      {/* Hàng dưới: Timestamp và Nút bấm */}
      <div className="mt-4 flex items-center justify-between">
        {/* Bên trái: Timestamp */}
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="mr-1.5 size-5 text-gray-500" />
          <span>{formattedTimestamp}</span>
        </div>

        {/* Bên phải: Nút "Xem bài nộp" */}
          <Link
            to="/course/$id/submissions"
            params={{ id: courseId }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
          Xem bài nộp
        </Link>
      </div>
    </div>
  )
}