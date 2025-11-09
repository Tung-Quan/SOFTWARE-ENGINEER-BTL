import { createFileRoute } from '@tanstack/react-router'

import StudyLayout from '@/components/study-layout'

export const Route = createFileRoute('/schedule/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <StudyLayout>

      <div>Hello "/schedule/"!</div>
    </StudyLayout>
  )
}
