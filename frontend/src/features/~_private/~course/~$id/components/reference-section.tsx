import React, { ComponentType } from 'react';

import LinkIcon from '@/components/icons/link';

import { SectionHeader } from './shared-components';

interface LinkData {
  id: string;
  title: string;
  url: string;
}

interface ReferenceSectionProps {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  link?: LinkData;
  changing: boolean;
  type: string;
  onTitleChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onLinkChange: (link: LinkData) => void;
  onDelete: () => void;
}

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({
  Icon,
  title,
  link,
  changing,
  type,
  onTitleChange,
  onTypeChange,
  onLinkChange,
  onDelete,
}) => {
  const handleFieldChange = (field: keyof LinkData, value: string) => {
    onLinkChange({
      ...(link || { id: `link-${Date.now()}`, title: '', url: '' }),
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
      <div className="space-y-3">
        {changing ? (
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề tài liệu tham khảo</label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Nhập tiêu đề tài liệu tham khảo"
                type="text"
                value={link?.title || ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">URL tham khảo</label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('url', e.target.value)}
                placeholder="https://example.com"
                type="url"
                value={link?.url || ''}
              />
            </div>

            {link?.url && (
              <div className="rounded border border-blue-200 bg-blue-50 p-3">
                <p className="mb-1 text-xs font-medium text-blue-700">Preview link:</p>
                <a
                  className="flex items-center gap-2 text-sm text-[#0329E9] hover:underline"
                  href={link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <LinkIcon className="size-4" />
                  {link.title || link.url}
                </a>
              </div>
            )}
          </div>
        ) : (
          <>
            {link ? (
              <a
                className="flex items-center gap-3 rounded-lg p-4 transition hover:bg-blue-50"
                href={link.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <LinkIcon className="size-5 text-[#0329E9]" />
                <span className="font-medium text-[#0329E9]">{link.title}</span>
              </a>
            ) : (
              <p className="text-gray-500">Chưa có đường dẫn tham khảo nào.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
