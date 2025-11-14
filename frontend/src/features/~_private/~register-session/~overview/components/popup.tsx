// Import icons
import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { useState, type SVGProps } from 'react';

/**
 * Props cho component MatchingPopup
 */
interface MatchingPopupProps {
  onClose: () => void;
  // Hàm onMatch sẽ trả về ID của person được chọn (tutor hoặc student)
  onMatch: (selectedPersonId: string) => void;
  // Danh sách người có thể match (filtered)
  availablePeople: Array<{ id: string; name: string }>;
  // Label cho tab (Tutor hoặc Student)
  tabLabel: string;
}

// --- Component Avatar Mới ---
// Avatar tròn, nền tối, icon sáng
const TutorAvatar = (props: SVGProps<SVGSVGElement>) => (
  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-800">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="size-6 text-gray-300"
      {...props}
    >
      <path 
        fillRule="evenodd" 
        d="M12 12a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H5z" 
        clipRule="evenodd" 
      />
    </svg>
  </div>
);


/**
 * Component Popup để "Match" (ghép) một Student với một Tutor hoặc ngược lại
 */
export function MatchingPopup({ onClose, onMatch, availablePeople, tabLabel }: MatchingPopupProps) {
  
  // State để lưu ID của person được chọn
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(
    availablePeople[0]?.id ?? null // Tự động check cái đầu tiên
  );

  // Ngăn việc click vào nội dung card làm đóng popup
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Xử lý khi bấm nút "Match"
  const handleMatchClick = () => {
    if (selectedPersonId) {
      onMatch(selectedPersonId);
      onClose();
    }
  };

  return (
    // Lớp phủ (Overlay) - removed for positioning next to button
    <div
      className="rounded-2xl bg-white shadow-2xl"
      onClick={handleCardClick}
    >
      {/* Container của Popup (Card) */}
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        
        {/* Header: "Matching" và nút X */}
        <div className="flex items-center justify-between p-8">
          <h2 className="text-4xl font-bold text-gray-900">Matching</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-200 p-2 text-gray-600 transition hover:bg-gray-300"
            aria-label="Đóng popup"
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        {/* Vùng nội dung (Tab + Danh sách) */}
        <div className="flex flex-col px-8 pb-8">
          {/* Tab */}
          <div>
            <button
              className="z-10 -mb-px rounded-t-lg border border-b-0 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-blue-600"
            >
              {tabLabel}
            </button>
          </div>

          {/* Danh sách People (scrollable) */}
          <div className="h-64 overflow-y-auto rounded-r-lg border-2 border-blue-600 p-5">
            <div className="space-y-3">
              {availablePeople.length === 0 ? (
                <div className="p-4 text-sm text-gray-600">Không có kết quả phù hợp</div>
              ) : (
                availablePeople.map((person) => (
                  <label
                    key={person.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        setSelectedPersonId((s) => (s === person.id ? null : person.id));
                      }
                    }}
                    className={selectedPersonId === person.id
                      ? 'flex cursor-pointer items-center space-x-4 rounded-lg border border-blue-200 bg-blue-50 p-3'
                      : 'flex cursor-pointer items-center space-x-4 rounded-lg p-3 hover:bg-gray-50'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPersonId === person.id}
                      onChange={() => setSelectedPersonId((s) => (s === person.id ? null : person.id))}
                      className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <TutorAvatar />
                    <span className="text-base font-medium text-gray-800">
                      {person.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>


        {/* Nút Match (Footer) */}
        <div className="rounded-b-2xl bg-gray-50 p-8">
          <button
            onClick={handleMatchClick}
            disabled={!selectedPersonId}
            className="w-full rounded-lg bg-blue-800 px-6 py-4 text-lg font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Match
          </button>
        </div>

      </div>
    </div>
  );
} 