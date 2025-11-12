import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef, useState } from 'react'

import { getMockSessions } from '@/components/data/~mock-session'
import StudyLayout from '@/components/study-layout'

import { ScheduleDetailPopup } from './components/schedule-detail-popup'

export const Route = createFileRoute('/schedule/')({
  component: RouteComponent,
})

// --- DỮ LIỆU GIẢ (MOCK DATA) ---

// Các ngày trong tuần, lấy chính xác từ ảnh của bạn
const CALENDAR_DAYS = [
  'Thứ hai (12/12/2025)',
  'Thứ ba (13/12/2025)',
  'Thứ tư (14/12/2025)',
  'Thứ năm (16/12/2025)', // Lưu ý: Ảnh của bạn nhảy từ 14 -> 16
  'Thứ sáu (17/12/2025)',
  'Thứ bảy (18/12/2025)',
  'Chủ nhật (19/12/2025)',
];

// Các mốc thời gian hiển thị (mỗi 1 giờ)
const TIME_SLOTS_DISPLAY = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00'
];

// Build calendar items from mock sessions
// session.start / session.end are ISO datetimes — convert to day index (Mon=0..Sun=6) and HH:mm
function toHHMM(iso: string) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function dayIndexFromISO(iso: string) {
  const d = new Date(iso)
  // JS: 0 = Sun, 1 = Mon, ... We want 0 = Mon, ..., 6 = Sun
  const jsDay = d.getDay()
  return (jsDay + 6) % 7
}

// --- COMPONENT CHÍNH CỦA TRANG ---

function RouteComponent() {
  // Filter and map sessions to calendar items, only showing those within visible hours (07:00-22:00)
  // Computed inside component so it re-runs on every render and picks up changes from mockSessions
  const calendarItems = getMockSessions()
    .filter((s) => {
      const startHour = new Date(s.start).getHours()
      const endHour = new Date(s.end).getHours()
      // Only show sessions that start between 07:00-21:59 or end between 07:01-22:00
      return (startHour >= 7 && startHour < 22) || (endHour > 7 && endHour <= 22)
    })
    .map((s) => ({
      id: s.id,
      dayIndex: dayIndexFromISO(s.start),
      startTime: toHHMM(s.start),
      endTime: toHHMM(s.end),
      title: s.title,
      desc: s.desc ?? '',
    }))

  return (
    <StudyLayout>
      <div className="flex flex-1 flex-col">

        {/* 1. Header "Quay lại" */}
        <Link
          to="/dashboard"
          className="mb-6 flex items-center gap-2 text-[#3D4863] transition hover:text-blue-700"
        >
          <ArrowLeftIcon className="size-5" />
          <span className="font-medium">Quay lại</span>
        </Link>


        {/* 2. Banner Tiêu đề với Sóng */}
        <div className="relative bg-white pb-12 pt-6">
          <div className=" px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Calendar - Tutor System
            </h1>
          </div>
          {/* Component sóng trang trí */}
          <BannerWave />
        </div>

        {/* 3. Nội dung chính của Lịch */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="relative rounded-lg bg-white pb-4">

            {/* 3.1. Header của Lịch (Thời khóa biểu + Controls) */}
            <ScheduleHeader />

            {/* 3.2. Grid Lịch */}
            <CalendarGrid items={calendarItems} />
          </div>

          {/* 4. Nút "Yêu cầu buổi học" và liên kết Lịch sử */}
          <div className="mt-6 flex items-center justify-end gap-3">


            <Link
              to="/schedule/history"
              className="rounded-md bg-blue-800 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Yêu cầu buổi học
            </Link>

          </div>
        </main>
      </div>
    </StudyLayout>
  )
}

// --- CÁC COMPONENT CON ---

/**
 * Component sóng trang trí (Blue & Yellow)
 */
function BannerWave() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-[960px]"
      viewBox="0 0 960 227"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <mask id="mask0_1144_864" maskUnits="userSpaceOnUse" x="0" y="0" width="960" height="227">
        <rect x="960" y="227" width="960" height="227" rx="8" transform="rotate(180 960 227)" fill="#1E40AF" />
      </mask>
      <g mask="url(#mask0_1144_864)">
        <g filter="url(#filter0_i_1144_864)">
          <path d="M960 204.301V0.000778198H80C80 0.000778198 410 9.6149 520 102.151C630 194.687 960 204.301 960 204.301Z" fill="#D97706" />
        </g>
        <g filter="url(#filter1_i_1144_864)">
          <path d="M960 204.301V0.000762939H320C320 0.000762939 560 9.6149 640 102.151C720 194.687 960 204.301 960 204.301Z" fill="#1E40AF" />
        </g>
      </g>
      <defs>
        <filter id="filter0_i_1144_864" x="80" y="0" width="880" height="208.301" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1144_864" />
        </filter>
        <filter id="filter1_i_1144_864" x="320" y="0" width="640" height="208.301" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1144_864" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Header của Lịch (Thời khóa biểu, Filter, Pagination)
 */
function ScheduleHeader() {
  return (
    <div className="flex flex-col items-center justify-between border-gray-200 p-4 md:flex-row">
      <h2 className="text-xl font-semibold text-gray-800">Thời khóa biểu</h2>
      <div className="mt-4 flex items-center gap-4 md:mt-0">
        <div>
          <div className="flex items-center gap-2">
            <svg
              className="inline-block w-40"
              viewBox="0 0 180 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <mask id="mask0_1144_1246" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_1144_1246)">
                <rect x="12.8945" y="5.82031" width="30" height="10" transform="rotate(45 12.8945 5.82031)" fill="#F59E0B" />
                <rect x="34.1055" y="12.8906" width="30" height="10" transform="rotate(135 34.1055 12.8906)" fill="#F59E0B" />
              </g>
              <path d="M67.998 4C76.8346 4 83.998 11.1634 83.998 20C83.998 28.8366 76.8346 36 67.998 36C59.1615 36 51.998 28.8366 51.998 20C51.998 11.1634 59.1615 4 67.998 4ZM67.999 13C64.133 13 60.999 16.134 60.999 20C60.9991 23.8659 64.1331 27 67.999 27C71.8648 26.9998 74.9989 23.8658 74.999 20C74.999 16.1341 71.8649 13.0002 67.999 13Z" fill="#1E40AF" />
              <mask id="mask1_1144_1246" maskUnits="userSpaceOnUse" x="96" y="0" width="40" height="40">
                <rect x="96" width="40" height="40" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask1_1144_1246)">
                <rect x="108.894" y="5.82031" width="30" height="10" transform="rotate(45 108.894 5.82031)" fill="#F59E0B" />
                <rect x="130.104" y="12.8906" width="30" height="10" transform="rotate(135 130.104 12.8906)" fill="#F59E0B" />
              </g>
              <path d="M164.002 4C172.839 4 180.002 11.1634 180.002 20C180.002 28.8366 172.839 36 164.002 36C155.165 36 148.002 28.8366 148.002 20C148.002 11.1634 155.165 4 164.002 4ZM164.003 13C160.137 13 157.003 16.134 157.003 20C157.003 23.8659 160.137 27 164.003 27C167.869 26.9998 171.003 23.8658 171.003 20C171.003 16.1341 167.869 13.0002 164.003 13Z" fill="#1E40AF" />
            </svg>
          </div>
          <div className="flex items-center justify-end">
            <button aria-label='Chuyển tuần' className="rounded-md border border-black bg-white p-1 text-gray-400 shadow-sm hover:bg-gray-50 hover:text-gray-600">
              <ChevronLeftIcon className="size-5" />
            </button>
            <button className="ml-2 rounded-md border border-black bg-white p-1 text-gray-400 shadow-sm hover:bg-gray-50 hover:text-gray-600">
              <ChevronRightIcon className="size-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * Grid Lịch chính (Giờ, Ngày, Các ô, và Item)
 */
interface CalendarGridProps {
  items: Array<{
    id: string;
    dayIndex: number;
    startTime: string;
    endTime: string;
    title: string;
    desc: string;
  }>;
}

function CalendarGrid({ items }: CalendarGridProps) {
  // Grid được chia thành 15 hàng (1 giờ mỗi hàng), từ 07:00 đến 22:00 (15 giờ)
  const totalRows = 22 - 7; // = 15 rows (1 row per hour)

  return (
    <div className="relative overflow-x-auto">
      <div
        className="grid"
        // Cột 1 cho thời gian, 7 cột cho các ngày
        // 1 hàng = 1 giờ (2rem chiều cao)
        style={{
          gridTemplateColumns: 'auto repeat(7, minmax(140px, 1fr))',
          gridTemplateRows: `auto repeat(${totalRows}, 2rem)`, // 'auto' cho header
          gap: 0, // Đảm bảo không có khoảng cách giữa các ô
        }}
      >
        {/* Ô trống góc trên bên trái */}
        <div className="sticky left-0 z-10 col-start-1 row-start-1 border-b border-r border-gray-200 bg-white"></div>

        {/* Header các ngày trong tuần */}
        {CALENDAR_DAYS.map((day) => (
          <div
            key={day}
            className="row-start-1 bg-[#3D4863] p-3 text-center font-semibold text-white"
          >
            {day}
          </div>
        ))}

        {/* Cột mốc thời gian (bên trái) */}
        {TIME_SLOTS_DISPLAY.map((time) => {
          const hour = parseInt(time.split(':')[0], 10);
          const isOddHour = hour % 2 === 1;
          const textColor = isOddHour ? '#F9BA08' : '#0329E9';

          return (
            <div
              key={time}
              className="sticky left-0 z-10 col-start-1 row-start-auto border-r-2 border-black bg-white text-right"
              // Mỗi label giờ chiếm 1 hàng (vì 1 hàng = 1 giờ)
              style={{ gridRow: `span 1 / span 1` }}
            >
              <span
                className="-mt-3.5 inline-block p-2 text-sm font-semibold"
                style={{ color: textColor }}
              >
                {time}
              </span>
            </div>
          );
        })}

        {/* Các ô lưới (background) */}
        {Array.from({ length: totalRows * 7 }).map((_, i) => (
          <div
            key={i}
            className=""
            style={{
              borderLeftWidth: i % 7 === 0 ? '1px' : '0',
              borderTopWidth: Math.floor(i / 7) === 0 ? '1px' : '0',
            }}
          ></div>
        ))}

        {/* Các mục lịch (đè lên trên grid) */}
        {items.map((item) => (
          <CalendarItem key={item.id} item={item} />
        ))}
      </div>

      {/* Đường viền vàng (nằm trên cùng) */}
      {/* <div className="pointer-events-none absolute inset-0 rounded-b-lg border-b-4 border-r-4 shadow-custom-yellow"></div> */}
    </div>
  );
}

/**
 * Component cho một mục lịch (VD: "Operating System")
 */
interface CalendarItemProps {
  item: {
    id: string;
    dayIndex: number; // 0-6
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    title: string;
    desc: string;
  }
}

function CalendarItem({ item }: CalendarItemProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const baseHour = 7; // Lịch bắt đầu lúc 07:00

  // Tính toán vị trí hàng bắt đầu (1 row = 1 giờ)
  const getRowStart = (time: string) => {
    const [h] = time.split(':').map(Number);
    const hoursFromStart = h - baseHour;
    // Vị trí hàng = hoursFromStart + 2 (hàng 1 là header, hàng 2 là 07:00)
    // Nếu có phút (m > 0), cần tính phần lẻ nhưng vì 1 row = 1 giờ, 
    // ta sẽ để item bắt đầu từ giờ đó và dùng CSS để offset nếu cần
    return hoursFromStart + 2;
  };

  // Tính toán số hàng mà item chiếm (row span) - 1 row = 1 giờ
  const getRowSpan = (startTime: string, endTime: string) => {
    const start = new Date(`2025-01-01T${startTime}:00`);
    const end = new Date(`2025-01-01T${endTime}:00`);
    const hours = (end.getTime() - start.getTime()) / 3600000;
    return Math.ceil(hours); // Làm tròn lên để đảm bảo đủ không gian
  };

  const handleClick = () => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      // Đặt popup bên phải item, canh giữa theo chiều dọc
      setPopupPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 16, // 16px khoảng cách
      });
    }
    setIsPopupOpen(true);
  };

  const gridColumn = item.dayIndex + 2; // +2 vì cột 1 là Time
  const gridRowStart = getRowStart(item.startTime);
  const gridRowSpan = getRowSpan(item.startTime, item.endTime);

  return (
    <>
      <div
        ref={itemRef}
        className="relative z-10 m-0.5 cursor-pointer overflow-hidden rounded-lg border-2 border-blue-600 bg-blue-50 p-2 transition-all hover:border-blue-700 hover:shadow-lg"
        style={{
          gridColumn: gridColumn,
          gridRow: `${gridRowStart} / span ${gridRowSpan}`,
        }}
        onClick={handleClick}
        title={item.title}
      >
        {/* Show only title, single-line ellipsis */}
        <div className="truncate text-sm font-bold text-blue-800">{item.title}</div>
      </div>

      {/* Popup chi tiết */}
      {isPopupOpen && (
        <ScheduleDetailPopup
          onClose={() => setIsPopupOpen(false)}
          position={popupPosition}
          title={item.title}
          desc={item.desc}
          id={item.id}
        />
      )}
    </>
  );
}