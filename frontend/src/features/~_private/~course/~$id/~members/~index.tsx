import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/course/$id/members/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/course/$id/members/"!</div>
}
