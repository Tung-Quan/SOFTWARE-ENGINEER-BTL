import React, { ComponentType } from 'react';

import { SectionHeader } from './shared-components';

interface IntroductionSectionProps {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
  changing: boolean;
  onTitleChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onDelete: () => void;
  type: string;
}

export const IntroductionSection: React.FC<IntroductionSectionProps> = ({
  Icon,
  title,
  text,
  changing,
  onTitleChange,
  onTypeChange,
  onTextChange,
  onDelete,
  type,
}) => {
  return (
    <>
      {changing ? (
        <div className="space-y-4">
          <SectionHeader
            Icon={Icon}
            changing={changing}
            onDelete={onDelete}
            onTitleChange={onTitleChange}
            onTypeChange={onTypeChange}
            title={title}
            type={type}
          />
          <textarea
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Nhập nội dung..."
            rows={3}
            value={text || ''}
          />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            <Icon className="size-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <p className="text-gray-600">{text}</p>
        </>
      )}
    </>
  );
};
