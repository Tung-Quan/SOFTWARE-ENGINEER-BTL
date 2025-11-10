import { Listbox, Transition } from '@headlessui/react';
import React, { ComponentType, Fragment } from 'react';

import { Book } from '@/components/icons';

import { categoryTypes, typeToIconMap } from './course-constants';

interface SectionHeaderProps {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  changing: boolean;
  type: string;
  onTitleChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  Icon,
  title,
  changing,
  type,
  onTitleChange,
  onTypeChange,
  onDelete,
  children,
}) => {
  if (!changing) {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="size-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded border border-gray-200 bg-gray-50 p-2">
          <Icon className="size-6 text-[#0329E9]" />
        </div>
        <input
          type="text"
          aria-label="Tên danh mục"
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-xl font-bold focus:border-blue-500 focus:outline-none"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Tên danh mục"
        />
        <CategorySelector type={type} onChange={onTypeChange} />
      </div>
      <DeleteButton onClick={onDelete} />
    </div>
  );
};

interface CategorySelectorProps {
  type: string;
  onChange: (value: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ type, onChange }) => {
  const IconComp = typeToIconMap[type] || Book;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <IconComp className="size-5 text-gray-600" />
      </div>
      <Listbox value={type} onChange={onChange}>
        <div className="relative w-64">
          <Listbox.Button className="relative w-full cursor-default appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm font-medium focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <span className="flex items-center">
              <IconComp className="size-5 text-gray-500" aria-hidden="true" />
              <span className="ml-2 block truncate">
                {categoryTypes.find((c) => c.id === type)?.label || 'Chọn loại danh mục'}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="size-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-10 mt-1 max-h-44 w-full overflow-auto rounded-md bg-white py-0.5 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {categoryTypes.map((categoryType) => {
                const OptionIcon = typeToIconMap[categoryType.id] || Book;
                return (
                  <Listbox.Option
                    key={categoryType.id}
                    value={categoryType.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <span className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                        <OptionIcon className="size-5 text-gray-500" aria-hidden="true" />
                        <span className="ml-2 block truncate">{categoryType.label}</span>
                      </span>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="size-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="text-red-600 hover:text-red-800" title="Xóa danh mục">
      <svg
        className="size-5"
        width="14"
        height="18"
        viewBox="0 0 14 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z"
          fill="#EA4335"
        />
      </svg>
    </button>
  );
};
