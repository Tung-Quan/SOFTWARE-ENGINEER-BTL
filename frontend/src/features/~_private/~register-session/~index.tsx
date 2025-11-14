import { createFileRoute } from '@tanstack/react-router'

import StudyLayout from '@/components/study-layout'

import { CoordinatorRegister } from './components/coordinator-register';
import { StudentRegister } from './components/student-register';
import { TutorRegister } from './components/tutor-register';

export const Route = createFileRoute('/_private/register-session/')({
  component: RouteComponent,
})

function RouteComponent() {
  const rawUserStore = localStorage.getItem('userStore');
  const userStore = rawUserStore ? JSON.parse(rawUserStore as string) : null;
  const State = userStore?.state ?? null;
  const userLocalStore = State.user ?? null;
  return (
    <StudyLayout>
      {userLocalStore.isTutor && (
        <TutorRegister />
      )}

      {!userLocalStore.isManager && (
        <div className="rounded bg-white p-4 shadow">
          <StudentRegister />
        </div>
      )}
      {userLocalStore.isCoordinator && (
        <CoordinatorRegister />
      )}
    </StudyLayout>
  )
}
