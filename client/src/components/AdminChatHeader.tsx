import React from 'react';

interface Ticket {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: any[];
}

interface Props {
  ticket: Ticket;
}

const AdminChatHeader: React.FC<Props> = ({ ticket }) => (
  <div className='p-4 border-b bg-gradient-to-r from-teal-600 to-teal-700 text-white'>
    <p className='text-lg font-semibold'>{ticket.userName}</p>
    <p className='text-sm opacity-90'>{ticket.userEmail}</p>
  </div>
);

export default AdminChatHeader;
