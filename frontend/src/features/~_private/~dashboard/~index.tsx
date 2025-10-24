import { createFileRoute } from '@tanstack/react-router'

import StudyLayout from '@/components/study-layout'

export const Route = createFileRoute('/_private/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <StudyLayout>
      <div>Hello "/dashboard"</div>
    </StudyLayout>
  )
}
