import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/course/')({
  component: RouteComponent,
})

function RouteComponent() {
  throw redirect({ to: '/course/$id', params: { id: '1' } });
}
