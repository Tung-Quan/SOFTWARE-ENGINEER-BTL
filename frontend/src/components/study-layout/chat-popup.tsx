import { useState } from 'react';

import { mockConversations, Conversation } from '@/components/data/~mock-chat-data';

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
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Small header for chat view: back + search */}
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
                const IconComponent = conv.icon; // Lấy component icon
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

      {/* --- Chế độ xem CỬA SỔ CHAT --- */}
      {view === 'chat' && (
        <>
          {/* Messages */}
              {selectedConversation && (
                <div className="border-b border-gray-200 p-3">
                  <h4 className="truncate font-semibold text-gray-800">{selectedConversation.title}</h4>
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
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
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
