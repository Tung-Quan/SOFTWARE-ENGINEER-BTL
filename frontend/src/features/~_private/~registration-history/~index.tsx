import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, SVGProps } from 'react';


import {
  mockPastRegistrations,
  type PastTutorRegistration,
  deletePastRegistration
} from '@/components/data/~mock-register';
import {
  mockTutorRegistrations,
  type PastTutorRegistration as TutorReg,
  deleteTutorRegistration
} from '@/components/data/~mock-tutor-register';
import StudyLayout from '@/components/study-layout';

// [THÊM] Định nghĩa kiểu dữ liệu cho user
interface UserProfile {
  firstName: string;
  // isManager: boolean;
  isTutor: boolean;
  isCoordinator: boolean;
}

// [THÊM] Gộp 2 kiểu registration lại
type AnyRegistration = (PastTutorRegistration | TutorReg) & {
  // Thêm 1 trường để phân biệt, vì studentName và tutorName khác nhau
  registrationType: 'Student' | 'Tutor';
};


export function RemoveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#EA4335" />
    </svg>

  )
}
export const Route = createFileRoute('/_private/registration-history/')({
  component: RouteComponent,
});

function RouteComponent() {
  // [SỬA] Dùng useState để lưu user, tránh lỗi khi render
  const [user, setUser] = useState<UserProfile | null>(null);
  const [registrations, setRegistrations] = useState<AnyRegistration[]>([]);

  // Tải lại danh sách đăng ký từ mock data, áp dụng cùng logic lọc theo user
  const loadRegistrations = () => {
    try {
      const rawUserStore = localStorage.getItem('userStore');
      const userStore = rawUserStore ? JSON.parse(rawUserStore as string) : null;
      const State = userStore?.state ?? null;
      const userLocalStore: UserProfile | null = State.user ?? null;

      setUser(userLocalStore);

      if (userLocalStore) {
        if (userLocalStore.isCoordinator) {
          const allRegs: AnyRegistration[] = [
            ...mockPastRegistrations.map(r => ({ ...r, registrationType: 'Student' as const })),
            ...mockTutorRegistrations.map(r => ({ ...r, registrationType: 'Tutor' as const })),
          ];
          setRegistrations(allRegs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else if (userLocalStore.isTutor) {
          const myTutorRegs = mockTutorRegistrations
            .filter(r => r.tutorName.includes(userLocalStore.firstName))
            .map(r => ({ ...r, registrationType: 'Tutor' as const }));
          setRegistrations(myTutorRegs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else {
          const name = userLocalStore.firstName;

          const myStudentRegs = mockPastRegistrations
            .filter(r => r.studentName.includes(name))
            .map(r => ({ ...r, registrationType: 'Student' as const }));

          const myTutorRegs = mockTutorRegistrations
            .filter(r => r.tutorName.includes(name))
            .map(r => ({ ...r, registrationType: 'Tutor' as const }));

          setRegistrations([...myStudentRegs, ...myTutorRegs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
      } else {
        // Nếu không có user (ví dụ lỗi parse), clear danh sách
        setRegistrations([]);
      }
    } catch (e) {
      console.error('Lỗi đọc localStorage khi loadRegistrations:', e);
      setUser(null);
      setRegistrations([]);
    }
  };

  // Dùng useEffect để load dữ liệu ban đầu và khi trang trở về visible
  useEffect(() => {
    loadRegistrations();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadRegistrations();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Xử lý xóa: confirm -> xóa trong mock -> reload danh sách
  const handleRemove = (id: string) => {
    const ok = window.confirm('Bạn có chắc muốn xóa đơn này: id ' + id);
    if (!ok) return;

    // Try deleting from student registrations first; if not found, try tutor registrations.
    let removed = deletePastRegistration(id);
    if (!removed) {
      removed = deleteTutorRegistration(id);
    }
    loadRegistrations();
  };

  // [SỬA] Thêm trạng thái Loading
  if (user === null) {
    return (
      <StudyLayout>
        <div className="rounded bg-white p-4 shadow">
          <p>Đang tải dữ liệu người dùng...</p>
        </div>
      </StudyLayout>
    );
  }

  return (
    <StudyLayout>
      {user.isCoordinator ? (
        // --- GIAO DIỆN MANAGER ---
        (<div className="rounded bg-white p-4 shadow">
          <h1 className="mb-4 text-2xl font-bold">Lịch sử đăng ký (Quản lý)</h1>
          <p className="mb-4">Tổng số: {registrations.length} đơn</p>
          <RegistrationTable registrations={registrations} isManager={true} onDelete={handleRemove} />
        </div>)
      ) : (
        // --- GIAO DIỆN USER ---
        (<div className="rounded bg-white p-4 shadow">
          <h1 className="mb-4 text-2xl font-bold">Lịch sử đăng ký của bạn</h1>
          {registrations.length > 0 ? (
            <RegistrationTable registrations={registrations} isManager={false} onDelete={handleRemove} />
          ) : (
            <p>Bạn chưa có lịch sử đăng ký nào.</p>
          )}
        </div>)
      )}
    </StudyLayout>
  )
}

// --- [THÊM] Component Bảng Lịch sử ---

function RegistrationTable({ registrations, isManager, onDelete }: { registrations: AnyRegistration[]; isManager: boolean; onDelete: (id: string) => void }) {
  const rawUserStore = localStorage.getItem('userStore');
  const userStore = rawUserStore ? JSON.parse(rawUserStore as string) : null;
  const State = userStore?.state ?? null;
  const userLocalStore = State?.user ?? null;
  const isCoordinator = userLocalStore?.isCoordinator ?? false;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {isManager && (
              <>
                <Th>Tên</Th>
                <Th>Loại</Th>
              </>
            )}
            <Th>Khóa học</Th>
            <Th>Ngôn ngữ</Th>
            <Th>Trạng thái</Th>
            <Th>Ngày tạo</Th>
            {!isCoordinator && (
              <Th>
                Xóa
              </Th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {registrations.map((reg) => {
            // Lấy tên/email tùy thuộc vào loại
            const name = (reg as PastTutorRegistration).studentName || (reg as TutorReg).tutorName;

            const isStudent = reg.registrationType === 'Student';

            // For Student registrations we have `course` and `language` fields.
            // For Tutor registrations we have `subjects` and `languages` arrays.
            const courseDisplay = isStudent
              ? ((reg as PastTutorRegistration).course?.name?.split(' (')[0] ?? '')
              : ((reg as TutorReg).subjects?.map(s => s.name.split(' (')[0]).join(', ') ?? '');

            const languageDisplay = isStudent
              ? ((reg as PastTutorRegistration).language?.name ?? '')
              : ((reg as TutorReg).languages?.map(l => l.name).join(', ') ?? '');

            return (
              <tr key={reg.id}>
                {isManager && (
                  <>
                    <Td>{name}</Td>
                    <Td>{reg.registrationType}</Td>
                  </>
                )}
                <Td>{courseDisplay}</Td>
                <Td>{languageDisplay}</Td>
                <Td><StatusBadge status={reg.status} /></Td>
                <Td>{new Date(reg.createdAt).toLocaleDateString('vi-VN')}</Td>
                {!isCoordinator && (
                    <Td>
                    <button
                      onClick={() => onDelete(reg.id)}
                      aria-label="Xóa đăng ký"
                      title="Xóa đăng ký"
                    >
                      <RemoveIcon />
                    </button>
                  </Td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --- [THÊM] Component Helper cho Bảng ---
const Th = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
    {children}
  </td>
);

const StatusBadge = ({ status }: { status: 'Pending' | 'Approved' | 'Declined' }) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Declined: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
};