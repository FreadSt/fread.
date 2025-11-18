import React from 'react';

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  isRead: boolean;
  timestamp: Date;
}

interface Props {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onEmpty: string;
}

const AdminChatMessages: React.FC<Props> = ({messages, messagesEndRef, onEmpty,}) => (
  <div className='flex-1 overflow-y-auto p-4 space-y-3 flex flex-col'>
    {messages.length === 0 ? (
      <div className='flex items-center justify-center h-full text-gray-500'>
        <p>{onEmpty}</p>
      </div>
    ) : (
      messages.map((msg) => (
        <div
          key={msg._id}
          className={`flex ${
            msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.senderRole === 'admin'
                ? 'bg-teal-700 text-white rounded-br-none'
                : 'bg-gray-200 text-black rounded-bl-none'
            }`}
          >
            <p className='text-xs font-semibold opacity-80'>{msg.senderName}</p>
            <p className='text-sm'>{msg.message}</p>
            <p className='text-xs opacity-70 mt-1'>
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {msg.isRead && msg.senderRole === 'user' && (
                <span className='ml-2'>✓ Read</span>
              )}
            </p>
          </div>
        </div>
      ))
    )}
    <div ref={messagesEndRef} />
  </div>
);

export default AdminChatMessages;
