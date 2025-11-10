import React, { ComponentType } from 'react';

import { SectionHeader } from './shared-components';

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface MovieSectionProps {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  video?: VideoData;
  changing: boolean;
  type: string;
  onTitleChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onVideoChange: (video: VideoData) => void;
  onDelete: () => void;
  toEmbed: (url?: string) => string;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  Icon,
  title,
  video,
  changing,
  type,
  onTitleChange,
  onTypeChange,
  onVideoChange,
  onDelete,
  toEmbed,
}) => {
  const handleFieldChange = (field: keyof VideoData, value: string) => {
    onVideoChange({
      ...(video || { id: `vid-${Date.now()}`, title: '', description: '', url: '' }),
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
      {changing ? (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề video</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Nhập tiêu đề video"
              type="text"
              value={video?.title || ''}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả video</label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Nhập mô tả chi tiết về video"
              rows={3}
              value={video?.description || ''}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">URL video (YouTube)</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              onChange={(e) => handleFieldChange('url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              type="url"
              value={video?.url || ''}
            />
          </div>

          {video?.url && (
            <div className="rounded border border-blue-200 bg-blue-50 p-3">
              <p className="mb-2 text-xs font-medium text-blue-700">Preview:</p>
              <div className="aspect-video w-full overflow-hidden rounded-md border border-blue-300">
                <iframe allowFullScreen className="size-full" src={toEmbed(video.url)} title="Preview" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {video ? (
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-gray-800">{video.title}</h3>
              <p className="mb-3 text-sm text-gray-600">{video.description}</p>
              <div className="aspect-video w-full overflow-hidden rounded-md border">
                <iframe allowFullScreen className="size-full" src={toEmbed(video.url)} title={video.title} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Chưa có video bài giảng nào.</p>
          )}
        </>
      )}
    </>
  );
};
