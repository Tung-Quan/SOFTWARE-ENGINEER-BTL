import { useState } from 'react';

import { 
  mockConversations, 
  Conversation, 
  createGroupChat, 
  getGroupChats,
  updateGroupName,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroupChat,
  GroupMember
} from '@/components/data/~mock-chat-data';
import { getAllNames } from '@/components/data/~mock-names';

// --- Định nghĩa SVG Icons ---

// Thay thế cho MagnifyingGlassIcon
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
      clipRule="evenodd"
    />
  </svg>
);

// Thay thế cho ChevronLeftIcon (Back)
const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
  >
    <path
      fillRule="evenodd"
      d="M12.79 5.23a.75.75 0 0 1 0 1.06L8.82 10l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </svg>
);


// Icon Send (Gửi)
const SendIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icon Mũi tên phải (ChevronRight)
const ChevronRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-400"
  >
    <path
      d="M7.5 15L12.5 10L7.5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icon Plus (Thêm group)
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
  >
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

// Icon Settings (Cài đặt group)
const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
  >
    <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

// Icon Trash (Xóa)
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
  >
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
  </svg>
);

// Icon Edit (Sửa tên)
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
  >
    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
  </svg>
);

// Icon Check (Xác nhận)
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
  >
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

// --- Component Chính ---

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

type ChatPopupProps = {
  isOpen: boolean;
  onClose?: () => void; // Make onClose optional for backward compatibility
};

const ChatPopup = ({ isOpen, onClose }: ChatPopupProps) => {
  const [view, setView] = useState<'list' | 'chat' | 'create-group' | 'manage-group'>('list');
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Group chat states
  const [groupName, setGroupName] = useState('');
  // keep a Set for quick membership checks and an array for ordered/drag list
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [allStudents, setAllStudents] = useState<GroupMember[]>([]);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState('');
  // draggingId removed (not needed) to avoid unused-state lint warnings

  // Get user info
  const rawUserStore = localStorage.getItem('userStore');
  const userStore = rawUserStore ? JSON.parse(rawUserStore as string) : null;
  const State = userStore?.state ?? null;
  const userLocalStore = State?.user ?? null;
  const isTutor = userLocalStore?.isTutor ?? false;

  // Load students and conversations
  useState(() => {
    const names = getAllNames();
    setAllStudents(names.map(n => ({ id: n.id, name: n.name })));
    setAllConversations([...mockConversations, ...getGroupChats()]);
  });

  const filteredConversations = allConversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMember = (memberId: number) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
      // Append to ordered list when newly selected
      setSelectedOrder((prev) => [...prev, memberId]);
    }
    setSelectedMembers(newSelected);
  };

  // Drag handlers for available student items
  const onDragStartStudent = (e: React.DragEvent, memberId: number) => {
    e.dataTransfer.setData('text/plain', String(memberId));
  };

  const onDragEndStudent = () => {
    /* noop */
  };

  // Drop handler for selected-area: accept dropped student and add to selected if not present
  const onDropToSelected = (e: React.DragEvent) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData('text/plain');
    const id = idStr ? Number(idStr) : null;
    if (id === null || Number.isNaN(id)) return;
    if (!selectedMembers.has(id)) {
      const newSelected = new Set(selectedMembers);
      newSelected.add(id);
      setSelectedMembers(newSelected);
      setSelectedOrder((prev) => [...prev, id]);
    }
    /* noop */
  };

  // (onDragOver calls are handled inline where needed)

  // Reorder inside selected list
  const onDragStartSelectedItem = (e: React.DragEvent, memberId: number) => {
    e.dataTransfer.setData('text/selected-id', String(memberId));
  };

  const onDropSelectedItem = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData('text/selected-id');
    const dragId = idStr ? Number(idStr) : null;
    if (dragId === null || Number.isNaN(dragId)) return;
    const fromIndex = selectedOrder.indexOf(dragId);
    if (fromIndex === -1) return;
    const newOrder = selectedOrder.slice();
    newOrder.splice(fromIndex, 1);
    newOrder.splice(targetIndex, 0, dragId);
    setSelectedOrder(newOrder);
    /* noop */
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedOrder.length === 0) return;

    const memberIds = Array.from(selectedOrder);
    createGroupChat(groupName, memberIds, allStudents);
    setAllConversations([...mockConversations, ...getGroupChats()]);

    // Reset and go back
    setGroupName('');
    setSelectedMembers(new Set());
    setSelectedOrder([]);
    setView('list');
  };

  const handleStartCreateGroup = () => {
    setGroupName('');
    setSelectedMembers(new Set());
    setView('create-group');
  };

  const handleOpenGroupSettings = () => {
    if (selectedConversation?.isGroup) {
      setEditedGroupName(selectedConversation.title);
      setView('manage-group');
    }
  };

  const handleUpdateGroupName = () => {
    if (selectedConversation && editedGroupName.trim()) {
      updateGroupName(selectedConversation.id, editedGroupName);
      setSelectedConversation({
        ...selectedConversation,
        title: editedGroupName
      });
      setAllConversations([...mockConversations, ...getGroupChats()]);
      setIsEditingName(false);
    }
  };

  const handleAddMember = (member: GroupMember) => {
    if (selectedConversation) {
      addMemberToGroup(selectedConversation.id, member);
      setSelectedConversation({
        ...selectedConversation,
        members: [...(selectedConversation.members || []), member],
        description: `${(selectedConversation.members?.length || 0) + 1} thành viên`
      });
      setAllConversations([...mockConversations, ...getGroupChats()]);
    }
  };

  const handleRemoveMember = (memberId: number) => {
    if (selectedConversation) {
      removeMemberFromGroup(selectedConversation.id, memberId);
      const updatedMembers = selectedConversation.members?.filter(m => m.id !== memberId) || [];
      setSelectedConversation({
        ...selectedConversation,
        members: updatedMembers,
        description: `${updatedMembers.length} thành viên`
      });
      setAllConversations([...mockConversations, ...getGroupChats()]);
    }
  };

  // keep selectedOrder in sync if user removes a member while editing create-group
  const handleRemoveSelectedById = (memberId: number) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
      setSelectedMembers(newSelected);
    }
    setSelectedOrder((prev) => prev.filter((id) => id !== memberId));
  };

  const handleDeleteGroup = () => {
    if (selectedConversation && confirm('Bạn có chắc muốn xóa nhóm này?')) {
      deleteGroupChat(selectedConversation.id);
      setAllConversations([...mockConversations, ...getGroupChats()]);
      setView('list');
      setSelectedConversation(null);
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setView('chat');
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: `Xin chào! Tôi có thể giúp gì cho bạn về "${conv.title}"?`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedConversation(null);
    setMessages([]);
    setSearchTerm('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ phản hồi sớm nhất có thể!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-[98px] z-40 flex h-[calc(100vh-6rem)] w-[380px] flex-col overflow-hidden rounded-l-lg bg-white shadow-[0_8px_24px_0_rgba(0,0,0,0.25)]">
      {/* Small header for chat view: back + search + settings */}
      {view === 'chat' && (
        <div className="border-b border-gray-200 px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToList}
              className="text-gray-600 hover:text-gray-800"
              aria-label="Quay lại"
            >
              <BackIcon />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
            {/* Settings button for group chats */}
            {isTutor && selectedConversation?.isGroup && (
              <button
                onClick={handleOpenGroupSettings}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Cài đặt nhóm"
              >
                <SettingsIcon />
              </button>
            )}
            {/* Close button inline with search */}
            <button
              onClick={onClose}
              aria-label="Đóng chat"
              className="inline-flex size-8 items-center justify-center rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- Chế độ xem DANH SÁCH HỘI THOẠI --- */}
      {view === 'list' && (
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Thanh tìm kiếm */}
          <div className="border-b border-gray-200 p-4">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              {/* Create group button for tutors */}
              {isTutor && (
                <button
                  onClick={handleStartCreateGroup}
                  className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                  aria-label="Tạo nhóm mới"
                >
                  <PlusIcon />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Đóng chat"
                className="inline-flex size-8 items-center justify-center rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Danh sách */}
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {filteredConversations.map((conv) => {
                const IconComponent = conv.icon;
                return (
                  <li
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className="flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <IconComponent />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="truncate font-semibold text-gray-800">
                        {conv.title}
                        {conv.isGroup && <span className="ml-2 text-xs text-gray-500">(Nhóm)</span>}
                      </h4>
                      <p className="truncate text-sm text-gray-500">
                        {conv.description}
                      </p>
                    </div>
                    <ChevronRightIcon />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* --- Chế độ TẠO NHÓM --- */}
      {view === 'create-group' && (
        <div className="flex flex-1 flex-col">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView('list')}
                className="text-gray-600 hover:text-gray-800"
              >
                <BackIcon />
              </button>
              <h3 className="font-semibold text-gray-800">Tạo nhóm mới</h3>
              <button
                onClick={onClose}
                aria-label="Đóng"
                className="text-gray-600 hover:text-red-600"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Group name input */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tên nhóm
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Nhập tên nhóm..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Member selection */}
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Chọn thành viên ({selectedOrder.length}/{allStudents.length})
              </p>

              {/* Selected members (draggable, ordered) */}
              <div className="mb-3">
                <div className="mb-2 text-sm font-medium text-gray-700">Thành viên đã chọn</div>
                <div className="flex flex-col gap-2 overflow-auto" style={{ maxHeight: '18vh', paddingRight: '0.5rem' }}>
                  {selectedOrder.map((id, idx) => {
                    const member = allStudents.find((s) => s.id === id);
                    if (!member) return null;
                    return (
                      <div
                        key={id}
                        draggable
                        onDragStart={(e) => onDragStartSelectedItem(e, id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDropSelectedItem(e, idx)}
                        className="cursor-move rounded-lg border bg-white p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{member.name}</span>
                          <button
                            onClick={() => handleRemoveSelectedById(id)}
                            aria-label={`Xóa ${member.name}`}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDropToSelected}
                  className="overflow-auto"
                  style={{ maxHeight: '36vh', paddingRight: '0.5rem' }}
                >
                  {allStudents.map((student) => {
                    const isSelected = selectedMembers.has(student.id);
                    return (
                      <div
                        key={student.id}
                        draggable
                        onDragStart={(e) => onDragStartStudent(e, student.id)}
                        onDragEnd={onDragEndStudent}
                        onClick={() => toggleMember(student.id)}
                        className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">
                            {student.name}
                          </span>
                          {isSelected && (
                            <div className="text-blue-600">
                              <CheckIcon />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>
          </div>

          {/* Create button */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedMembers.size === 0}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Tạo nhóm
            </button>
          </div>
        </div>
      )}

      {/* --- Chế độ QUẢN LÝ NHÓM --- */}
      {view === 'manage-group' && selectedConversation && (
        <div className="flex flex-1 flex-col">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView('chat')}
                className="text-gray-600 hover:text-gray-800"
              >
                <BackIcon />
              </button>
              <h3 className="font-semibold text-gray-800">Quản lý nhóm</h3>
              <button
                onClick={onClose}
                aria-label="Đóng"
                className="text-gray-600 hover:text-red-600"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Group name edit */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tên nhóm
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={isEditingName ? editedGroupName : selectedConversation.title}
                  onChange={(e) => setEditedGroupName(e.target.value)}
                  disabled={!isEditingName}
                  aria-label="Tên nhóm"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
                {!isEditingName ? (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                  >
                    <EditIcon />
                  </button>
                ) : (
                  <button
                    onClick={handleUpdateGroupName}
                    className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                  >
                    <CheckIcon />
                  </button>
                )}
              </div>
            </div>

            {/* Current members */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Thành viên hiện tại ({selectedConversation.members?.length || 0})
              </p>
              <div className="space-y-2">
                {selectedConversation.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {member.name}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Xóa thành viên"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add new members */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Thêm thành viên
              </p>
              <div className="space-y-2">
                {allStudents
                  .filter(s => !selectedConversation.members?.some(m => m.id === s.id))
                  .map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleAddMember(student)}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:border-blue-500 hover:bg-blue-50"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {student.name}
                      </span>
                      <span className="text-sm text-gray-500">Thêm</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Delete group button */}
            <button
              onClick={handleDeleteGroup}
              className="w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            >
              Xóa nhóm
            </button>
          </div>
        </div>
      )}

      {/* --- Chế độ xem CỬA SỔ CHAT --- */}
      {view === 'chat' && (
        <>
          {/* Messages */}
          {selectedConversation && (
            <div className="border-b border-gray-200 p-3">
              <h4 className="truncate font-semibold text-gray-800">
                {selectedConversation.title}
                {selectedConversation.isGroup && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({selectedConversation.members?.length || 0} thành viên)
                  </span>
                )}
              </h4>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${message.sender === 'user'
                        ? 'bg-[#0329E9] text-white'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="mt-1 block text-right text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-200 p-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0329E9] px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!inputValue.trim()}
                aria-label="Gửi tin nhắn"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatPopup;
