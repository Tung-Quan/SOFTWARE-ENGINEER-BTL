import { createFileRoute } from '@tanstack/react-router'

import StudyLayout from '@/components/study-layout'

export const Route = createFileRoute('/register-session/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <StudyLayout>
      <div>Hello "/register-session/"!</div>
    </StudyLayout>
  )
}
