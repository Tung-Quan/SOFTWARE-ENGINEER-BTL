import { createFileRoute } from '@tanstack/react-router'

import StudyLayout from '@/components/study-layout'

export const Route = createFileRoute('/registration-history/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <StudyLayout>

      <div>Hello "/registration-history/"!</div>
    </StudyLayout>
  )
}
