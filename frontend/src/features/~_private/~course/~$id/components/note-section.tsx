import React, { ComponentType } from 'react';

import { SectionHeader } from './shared-components';

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  source?: string;
}

interface NoteSectionProps {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  assignment?: AssignmentData;
  changing: boolean;
  type: string;
  onTitleChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onAssignmentChange: (assignment: AssignmentData) => void;
  onDelete: () => void;
}

export const NoteSection: React.FC<NoteSectionProps> = ({
  Icon,
  title,
  assignment,
  changing,
  type,
  onTitleChange,
  onTypeChange,
  onAssignmentChange,
  onDelete,
}) => {
  const handleFieldChange = (field: keyof AssignmentData, value: string) => {
    onAssignmentChange({
      ...(assignment || { id: `assign-${Date.now()}`, title: '', description: '', dueDate: '', source: '' }),
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
              <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề bài tập</label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Nhập tiêu đề bài tập"
                type="text"
                value={assignment?.title || ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả bài tập</label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Nhập mô tả chi tiết về bài tập"
                rows={5}
                value={assignment?.description || ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Hạn nộp</label>
              <input
                aria-label="assignment"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                type="date"
                value={assignment?.dueDate || ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tên file đính kèm (nếu có)</label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleFieldChange('source', e.target.value)}
                placeholder="Ví dụ: assignment1.pdf"
                type="text"
                value={assignment?.source || ''}
              />
            </div>
          </div>
        ) : (
          <>
            {assignment ? (
              <div className="">
                <h3 className="mb-2 font-semibold text-gray-800">{assignment.title}</h3>
                <p className="mb-2 text-sm text-gray-600">{assignment.description}</p>
                <p className="text-xs text-gray-500">Hạn nộp: {assignment.dueDate}</p>
              </div>
            ) : (
              <p className="text-gray-500">Chưa có bài tập nào.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
