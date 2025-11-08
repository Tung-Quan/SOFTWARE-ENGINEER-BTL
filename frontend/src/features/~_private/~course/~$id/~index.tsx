import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';

import { mockCourses, dataCourses } from '@/components/data/~mockCourses';
import { Play as PlayIcon } from '@/components/icons';
import { Paper as PaperIcon } from '@/components/icons';
import ArrowLeft from '@/components/icons/arrow-left';
import BookIcon from '@/components/icons/book';
import CalendarIcon from '@/components/icons/calendar';
import LinkIcon from '@/components/icons/link';
import StudyLayout from '@/components/study-layout';

export const Route = createFileRoute('/_private/course/$id/')({
  component: CourseDetailsComponent,
});

function CourseDetailsComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const course = mockCourses.find((c) => c.id === id);
  const courseDetail = dataCourses.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState<string>('');

  // Refs for scroll spy - now using string keys from content types
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Map content types to icon components
  const typeToIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    introduction: BookIcon,
    material: PaperIcon,
    movie: PlayIcon,
    note: CalendarIcon,
    reference: LinkIcon,
    submission: CalendarIcon,
  };

  // Set initial active tab when courseDetail loads
  useEffect(() => {
    if (courseDetail?.content && courseDetail.content.length > 0 && !activeTab) {
      setActiveTab(`${courseDetail.content[0].type}-0`);
    }
  }, [courseDetail, activeTab]);

  // Scroll spy effect
  useEffect(() => {
    const container = contentContainerRef.current;
    if (!container || !courseDetail?.content) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop + 100; // offset for better UX

      // Find which section is currently visible based on content array
      for (let i = courseDetail.content.length - 1; i >= 0; i--) {
        const sectionKey = `${courseDetail.content[i].type}-${i}`;
        const section = sectionRefs.current[sectionKey];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(sectionKey);
          break;
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [courseDetail]);

  // Scroll to section when clicking sidebar item
  const scrollToSection = (sectionKey: string) => {
    const section = sectionRefs.current[sectionKey];
    if (section && contentContainerRef.current) {
      contentContainerRef.current.scrollTo({
        top: section.offsetTop - 20,
        behavior: 'smooth',
      });
    }
  };

  // Render content for each section
  // helper: convert youtube url -> embed url
  const toEmbed = (url?: string) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      // youtube watch?v= or youtu.be short link
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}` : url;
      }
      if (u.hostname === 'youtu.be') {
        const id = u.pathname.slice(1);
        return `https://www.youtube.com/embed/${id}`;
      }
      return url;
    } catch {
      return url ?? '';
    }
  };

  // Map PDFs placed in `src/data/` to URLs (Vite)
  // If your PDF files are in `frontend/src/data/`, this will resolve them to URLs at build time.
  const pdfModules = import.meta.glob('../../../data/*', { as: 'url', eager: true }) as Record<string, string>;
  const getAssetUrl = (filename?: string) => {
    if (!filename) return '';
    const found = Object.entries(pdfModules).find(([k]) => k.endsWith(filename));
    return found ? found[1] : `@/src/data/${filename}`;
  };

  const renderSectionContent = (item: any) => {
    switch (item.type) {
      case 'introduction':
        return (
          <>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              {item.title}
            </h2>
            <p className="text-gray-600">
              {item.data.text}
            </p>
          </>
        );
      case 'material':
        return (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {item.title}
              </h2>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                Tải tất cả
              </button>
            </div>
            <div className="space-y-4">
              {item.data.documents && item.data.documents.length > 0 ? (
                item.data.documents.map((doc: any) => {
                  const fileUrl = (doc as any).url ?? getAssetUrl(doc.source);
                  return (
                    <div key={doc.id} className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-blue-50 p-3">
                          <PaperIcon className="size-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-gray-800">
                            {doc.title}
                          </h3>
                          <p className="mb-2 text-sm text-gray-600">
                            {doc.description}
                          </p>
                          <p className="text-xs text-gray-500">File: {doc.source}</p>
                        </div>
                        <div className="shrink-0">
                          <a
                            href={fileUrl}
                            download
                            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            Tải về
                          </a>
                        </div>
                      </div>

                      {/* Inline PDF viewer - falls back to link if browser can't render */}
                      <div className="overflow-hidden rounded-md border">
                        <iframe
                          src={fileUrl}
                          title={doc.title}
                          className="h-[600px] w-full bg-white"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">Chưa có tài liệu nào.</p>
              )}
            </div>
          </>
        );
      case 'movie': {
        return (
          <>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">{item.title}</h2>
            {item.data.videos && item.data.videos.length > 0 ? (
              item.data.videos.map((m: any) => {
                const embed = toEmbed(m.url);
                return (
                  <div key={m.id} className="mb-6">
                    <h3 className="mb-2 font-semibold text-gray-800">{m.title}</h3>
                    <p className="mb-3 text-sm text-gray-600">{m.description}</p>
                    <div className="aspect-video w-full overflow-hidden rounded-md border">
                      <iframe src={embed} title={m.title} className="size-full" allowFullScreen />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Chưa có video bài giảng nào.</p>
            )}
          </>
        );
      }
      case 'note':
        return (
          <>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">{item.title}</h2>
            <div className="space-y-4">
              {item.data.assignments && item.data.assignments.length > 0 ? (
                item.data.assignments.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className=""
                  >
                    <h3 className="mb-2 font-semibold text-gray-800">
                      {assignment.title}
                    </h3>
                    <p className="mb-2 text-sm text-gray-600">
                      {assignment.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Hạn nộp: {assignment.dueDate}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Chưa có bài tập nào.</p>
              )}
            </div>
          </>
        );
      case 'reference':
        return (
          <>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">{item.title}</h2>
            <div className="space-y-3">
              {item.data.links && item.data.links.length > 0 ? (
                item.data.links.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg p-4 transition hover:bg-blue-50"
                  >
                    <LinkIcon className="size-5 text-blue-600" />
                    <span className="font-medium text-blue-600">
                      {link.title}
                    </span>
                  </a>
                ))
              ) : (
                <p className="text-gray-500">
                  Chưa có đường dẫn tham khảo nào.
                </p>
              )}
            </div>
          </>
        );
      case 'submission':
        return (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                {item.title}
              </h2>
              {item.data.status === 'graded' && (
                <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-2">
                  <span className="font-medium text-green-700">
                    Điểm: {item.data.grade}
                  </span>
                </div>
              )}

              {item.data.status === 'submitted' && (
                <div className="flex items-center gap-3 rounded-lg bg-yellow-50 px-4 py-2">
                  <span className="font-medium text-yellow-700">
                    Chưa chấm điểm
                  </span>
                </div>
              )}
            </div>

            {item.data.status === 'submitted' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex size-10 items-center justify-center rounded bg-red-50">
                    <PaperIcon className="size-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.data.submittedFile.name}</p>
                    <p className="text-sm text-red-600">Submitted at {item.data.submittedFile.submittedAt}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="size-4" />
                    <span>
                      Hạn chót: <span className="font-semibold text-red-600">{item.data.dueDate}</span>
                    </span>
                  </div>
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    Chỉnh sửa bài nộp
                  </button>
                </div>
              </div>
            )}

            {item.data.status === 'graded' && (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex size-10 items-center justify-center rounded bg-red-50">
                        <PaperIcon className="size-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.data.submittedFile.name}</p>
                        <p className="text-sm text-red-600">Submitted at {item.data.submittedFile.submittedAt}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {item.data.feedback && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="mb-1 text-sm font-semibold text-gray-700">Nhận xét từ giảng viên:</p>
                    <p className="text-sm text-gray-600">{item.data.feedback}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="size-4" />
                    <span>
                      Hạn chót: <span className="font-semibold text-red-600">{item.data.dueDate}</span>
                    </span>
                  </div>
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    Chỉnh sửa bài nộp
                  </button>
                </div>
              </div>
            )}

            {item.data.status === 'not-submitted' && (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <p className="mb-4 text-gray-500">Chưa có bài nộp</p>
                  <button className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700">
                    + Thêm bài nộp
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="size-4" />
                  <span>Hạn chót: {item.data.dueDate}</span>
                </div>
              </div>
            )}

            {!item.data.status && (
              <p className="text-gray-500">
                {item.data.text || 'Chưa có bài nộp nào trong hệ thống.'}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (!course) {
    return (
      <StudyLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Không tìm thấy khóa học
          </h1>
          <p className="mb-8 text-gray-600">
            Khóa học với ID "{id}" không tồn tại.
          </p>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Quay lại Dashboard
          </button>
        </div>
      </StudyLayout>
    );
  }

  // Nếu có data chi tiết, hiển thị layout với sidebar tabs
  if (courseDetail) {
    return (
      <StudyLayout>
        <div className="font-['Archivo']">
          {/* Back button */}
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="mb-6 flex items-center gap-2 text-[#3D4863] transition hover:text-blue-700"
          >
            <ArrowLeft className="size-5" />
            <span className="font-medium">Quay lại</span>
          </button>

          {/* Course header */}
          <div
            className="relative rounded-lg p-8 text-white shadow-lg"
            style={{
              backgroundImage: `url(${course.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '250px',
            }}
          >
            <div className="relative z-10">
              <p className="mb-2 text-sm font-medium text-gray-200">
                {course.code}
              </p>
              <h1 className="mb-3 text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-gray-100">
                Giảng viên: {course.instructor}
              </p>

              {/* Button "tổng quan" + "Đánh giá" */}
              <div className="mt-6 flex gap-4">
                <button className="rounded-lg bg-[#0329E9] px-4 py-2 font-medium backdrop-blur-sm transition hover:bg-[#0329E9]/80">
                  Tổng quan
                </button>
                <button className="rounded-lg bg-white px-4 py-2 font-medium text-[#0329E9] backdrop-blur-sm transition hover:bg-white/80">
                  Đánh giá
                </button>
              </div>
            </div>
          </div>

          {/* Layout with sidebar + content */}
          <div className="flex items-start gap-6">
            {/* Sidebar timeline */}
            <div className="w-64 shrink-0">
              <div className="sticky top-6 h-full py-4">
                <div className="relative h-full pl-6">
                  {/* Vertical line - extends full height */}
                  <div className="absolute inset-y-0 left-[13px] w-0.5 bg-gray-300" />

                  {/* Timeline items - dynamically from content */}
                  {courseDetail.content?.map((item: any, index: number) => {
                    const Icon = typeToIconMap[item.type] || BookIcon;
                    const sectionKey = `${item.type}-${index}`;
                    const isActive = activeTab === sectionKey;
                    const isFirst = index === 0;

                    return (
                      <button
                        key={sectionKey}
                        onClick={() => scrollToSection(sectionKey)}
                        className={`relative ${isFirst ? 'mt-2' : 'mt-8'} flex w-full items-center gap-3 pl-3 text-left transition-colors`}
                      >
                        <div className={`absolute -left-6 flex size-7 items-center justify-center rounded-full border-2 bg-white transition ${isActive ? 'border-blue-600' : 'border-gray-300'
                          }`}>
                          <div className={`size-2 rounded-full transition ${isActive ? 'bg-blue-600' : 'bg-transparent'}`} />
                        </div>
                        <Icon className={`size-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                        <span className={`font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main content area with scroll */}
            <div className="flex-1">
              <div
                ref={contentContainerRef}
                className="mt-10 max-h-[calc(100vh-220px)] overflow-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                {courseDetail.content?.map((item: any, index: number) => {
                  const sectionKey = `${item.type}-${index}`;
                  return (
                    <div
                      key={sectionKey}
                      ref={(el) => {
                        sectionRefs.current[sectionKey] = el;
                      }}
                      className="mb-12 rounded-lg border border-gray-200 p-4"
                      style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}
                    >
                      {renderSectionContent(item)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </StudyLayout>
    );
  }

  // Nếu không có data chi tiết, hiển thị layout đơn giản ban đầu

  return (
    <StudyLayout>
      <div style={{ fontFamily: 'Archivo' }}>
        {/* Back button */}
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="mb-6 flex items-center gap-2 text-[#3D4863] transition hover:text-blue-700"
        >
          <ArrowLeft className="size-5" />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Course header with background */}
        <div
          className="relative mb-8 rounded-lg p-8 text-white shadow-lg"
          style={{
            backgroundImage: `url(${course.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '250px',
          }}
        >
          <div className="relative z-10">
            <p className="mb-2 text-sm font-medium text-gray-200">
              {course.code}
            </p>
            <h1 className="mb-3 text-4xl font-bold">{course.title}</h1>
            <p className="text-lg text-gray-100">
              Giảng viên: {course.instructor}
            </p>

            {/* Button "tổng quan" + "Đánh giá" */}
            <div className="mt-6 flex gap-4">
              <button className="rounded-lg bg-[#0329E9] px-4 py-2 font-medium backdrop-blur-sm transition hover:bg-[#0329E9]/80">
                Tổng quan
              </button>
              <button className="rounded-lg bg-white px-4 py-2 font-medium text-[#0329E9] backdrop-blur-sm transition hover:bg-white/80">
                Đánh giá
              </button>
            </div>
          </div>
        </div>

        {/* Course statistics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}>
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {course.stats.documents}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Tài liệu học tập
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}>
            <div className="mb-2 text-3xl font-bold text-green-600">
              {course.stats.links}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Đường dẫn tham khảo
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}>
            <div className="mb-2 text-3xl font-bold text-orange-600">
              {course.stats.assignments}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Bài tập được giao
            </div>
          </div>
        </div>

        {/* Course content sections */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Thông tin khóa học
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <span className="font-semibold">Mã khóa học:</span>{" "}
                {course.code}
              </p>
              <p>
                <span className="font-semibold">Tên khóa học:</span>{" "}
                {course.title}
              </p>
              <p>
                <span className="font-semibold">Giảng viên:</span>{" "}
                {course.instructor}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Mô tả khóa học
            </h2>
            <p className="text-gray-600">
              Đây là khóa học {course.title}. Khóa học cung cấp kiến thức nền
              tảng và thực hành về lĩnh vực này. Sinh viên sẽ được học tập qua
              các tài liệu, bài giảng và bài tập thực hành.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Tài liệu học tập
            </h2>
            <div className="text-gray-600">
              <p className="mb-2">
                Có <span className="font-semibold">{course.stats.documents}</span> tài liệu
                có sẵn trong khóa học này.
              </p>
              <p className="text-sm text-gray-500">
                Tài liệu sẽ được cập nhật trong các phiên bản tương lai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudyLayout>
  );
}

