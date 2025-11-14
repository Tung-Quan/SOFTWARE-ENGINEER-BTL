import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

import { ArrowLeft } from '@/components/icons';
import StudyLayout from '@/components/study-layout';

import { RatingItem, StarRating } from '../~index';

export const Route = createFileRoute('/_private/course/$id/rating/$id/$index')({
  component: RouteComponent,
});

function RouteComponent() {
  const [ratings, setRatings] = useState<RatingItem[]>(() => {
    const saved = localStorage.getItem(`course-ratings-${1}`);
    if (saved) {
      return JSON.parse(saved);
    }
    // Default data
    return Array.from({ length: 11 }, (_, i) => ({
      id: `rating-${i + 1}`,
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ipsum magna, rutrum tempus urna quis, cursus porttitor neque. Aliquam commodo enim sit.',
      rating: 3,
    }));
  });
  void setRatings;
  useEffect(() => {
    localStorage.setItem(`course-ratings-${1}`, JSON.stringify(ratings));
  }, [ratings]);

  return (
    <StudyLayout>
      <div className="w-full font-['Archivo']">
        {/* Back button */}
        <button
          onClick={() => {
            window.history.go(-1);
          }}
          className="mb-6 flex items-center gap-2 text-[#3D4863] transition hover:text-blue-700"
        >
          <ArrowLeft className="size-5" />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* User Info Card */}
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex size-24 items-center justify-center rounded-full bg-[#4A5568]">
            <svg
              className="size-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* User Details */}
          <div>
            <h2 className="mb-1 text-xl font-semibold text-[#4A5568]">
              Nguyễn Trần Văn AAA
            </h2>
            <p className="mb-3 text-sm text-gray-500">
              nguyentranvanaaa123456789@gmail.com
            </p>
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">19:00 10/10/2024</span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-start gap-6">
          {/* Rating Table */}
          <div className="mt-8 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <div className="bg-[#4A5568] px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Đánh giá môn học
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {ratings.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-6 px-6 py-4 transition hover:bg-gray-50"
                >
                  <p className="flex-1 text-sm text-gray-700">{item.title}</p>
                  <StarRating
                    rating={item.rating}
                    onRate={(newRating) => {
                      void newRating;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Information Box */}
        <div
          className="mt-4 h-fit w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm focus:outline-none"
          style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}
        >
          <p className="mb-4 text-gray-800">
            In MiniGo, an identifier is the name used to identify variables,
            constants, types, functions, or other user-defined elements within a
            program. Identifiers must adhere to the following rules:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-gray-800">
            <li>
              Composition: An identifier must start with a letter (A-Z or a-z)
              or an underscore (_). Subsequent characters can include letters,
              digits (0-9), or underscores.
            </li>
            <li>
              Case Sensitivity: Identifiers are case-sensitive, meaning
              myVariable and MyVariable are treated as distinct identifiers.
            </li>
            <li>
              Length: There is no explicit limit on the length of an identifier,
              but it is recommended to use concise yet descriptive names for
              clarity.
            </li>
            <li>
              Keywords Restriction: Identifiers cannot be the same as any
              reserved keyword in MiniGo.
            </li>
            <li>
              Composition: An identifier must start with a letter (A-Z or a-z)
              or an underscore (_). Subsequent characters can include letters,
              digits (0-9), or underscores.
            </li>
            <li>
              Case Sensitivity: Identifiers are case-sensitive, meaning
              myVariable and MyVariable are treated as distinct identifiers.
            </li>
          </ul>
        </div>
      </div>
    </StudyLayout>
  );
}
