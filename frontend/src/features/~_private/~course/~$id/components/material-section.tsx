import React, { ComponentType } from 'react';

import { SectionHeader } from './shared-components';

interface MaterialData {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  source: string;
}

interface MaterialSectionProps {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  document?: MaterialData;
  changing: boolean;
  type: string;
  onTitleChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDocumentChange: (doc: MaterialData) => void;
  onDelete: () => void;
  getAssetUrl: (filename?: string) => string;
}

export const MaterialSection: React.FC<MaterialSectionProps> = ({
  Icon,
  title,
  document,
  changing,
  type,
  onTitleChange,
  onTypeChange,
  onDocumentChange,
  onDelete,
  getAssetUrl,
}) => {
  const handleFieldChange = (field: keyof MaterialData, value: string) => {
    onDocumentChange({
      ...(document || { id: `doc-${Date.now()}`, title: '', description: '', dueDate: '', source: '' }),
      [field]: value,
    });
  };

  return (
    <>
      <SectionHeader
        Icon={Icon}
        changing={changing}
        onDelete={onDelete}
        onTitleChange={onTitleChange}
        onTypeChange={onTypeChange}
        title={title}
        type={type}
      />
      <div className="space-y-4">
        {changing ? (
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề tài liệu</label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Nhập tiêu đề tài liệu"
                type="text"
                value={document?.title || ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Nhập mô tả chi tiết về tài liệu"
                rows={3}
                value={document?.description || ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Hạn nộp</label>
              <input
                aria-label="Due date"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                type="date"
                value={document?.dueDate || ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tên file nguồn (trong thư mục data)
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('source', e.target.value)}
                placeholder="Ví dụ: document.pdf"
                type="text"
                value={document?.source || ''}
              />
            </div>

            {document?.source && (
              <div className="rounded border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                  <strong>Preview:</strong> File sẽ được tải từ: {getAssetUrl(document.source)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {document ? (
              <div key={document.id} className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-gray-800">{document.title}</h3>
                    <p className="mb-2 text-sm text-gray-600">{document.description}</p>
                    <p className="text-xs text-gray-500">File: {document.source}</p>
                  </div>
                  <div className="shrink-0">
                    <a
                      className="inline-flex items-center gap-2 rounded-lg bg-[#0329E9] px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      download
                      href={getAssetUrl(document.source)}
                    >
                      <svg
                        aria-hidden="true"
                        className="shrink-0"
                        fill="none"
                        height="16"
                        viewBox="0 0 20 20"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.8337 7.5H12.5003V2.5H7.50033V7.5H4.16699L10.0003 13.3333L15.8337 7.5ZM4.16699 15V16.6667H15.8337V15H4.16699Z"
                          fill="white"
                        />
                      </svg>
                      <span>Tải tài liệu</span>
                    </a>
                  </div>
                </div>

                {/* Inline PDF viewer */}
                <div className="overflow-hidden rounded-md border">
                  <iframe
                    className="h-[600px] w-full bg-white"
                    src={getAssetUrl(document.source)}
                    title={document.title}
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Chưa có tài liệu nào.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
