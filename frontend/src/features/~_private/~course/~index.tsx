import { createFileRoute } from '@tanstack/react-router';

import StudyLayout from '@/components/study-layout';

export const Route = createFileRoute('/_private/course/')({
  component: CourseIndexComponent,
});

function CourseIndexComponent() {
  return (
    <StudyLayout>
      <div>
        <h1>Course Index</h1>
        <p>This is a test to see if routes are being picked up.</p>
      </div>
    </StudyLayout>
  );
}
