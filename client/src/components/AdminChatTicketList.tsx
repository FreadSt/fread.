import React from 'react';
import { Refresh } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { CHAT_MESSAGES, CHAT_STYLES } from '../constants/chat/chat.ts';

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
  tickets: Ticket[];
  selectedTicketId: string | null;
  loading: boolean;
  onSelectTicket: (ticketId: string) => void;
  onRefresh: () => Promise<void>;
}

const AdminChatTicketList: React.FC<Props> = ({tickets, selectedTicketId, loading, onSelectTicket, onRefresh,}) => (
  <div className='col-span-1 bg-white shadow-md overflow-y-auto md:col-span-2'>
    <div className='md:p-4 lg:p-4 sm:p-2 xs:p-2 border-b sticky top-0 bg-white flex justify-between items-center'>
      <div>
        <h2 className='lg:text-xl md:text-xl sm:text-sm xs:text-sm font-bold'>Support Tickets</h2>
        <p className='text-sm text-gray-500'>{tickets?.length || 0} active</p>
      </div>
      <IconButton
        onClick={onRefresh}
        disabled={loading}
        size='small'
        sx={{ color: CHAT_STYLES.PRIMARY_COLOR }}
      >
        <Refresh />
      </IconButton>
    </div>

    {tickets && tickets.length > 0 ? (
      tickets.map((ticket) => (
        <div
          key={ticket.userId}
          onClick={() => onSelectTicket(ticket.userId)}
          className={`md:p-4 lg:p-4 sm:p-2 xs:p-2 border-b cursor-pointer transition ${
            selectedTicketId === ticket.userId
              ? 'bg-teal-50 border-l-4 border-l-teal-700'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className='flex justify-between items-start mb-2'>
            <div>
              <p className='font-semibold overflow-ellipsis'>{ticket.userName}</p>
              <p className='text-xs text-gray-500 overflow-ellipsis truncate xs:max-w-[70px] max-w-[150px] md:max-w-[200px] lg:max-w-none'>{ticket.userEmail}</p>
            </div>
            {ticket.unreadCount > 0 && (
              <span className='bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold'>
                {ticket.unreadCount}
              </span>
            )}
          </div>
          <p className='text-sm text-gray-600 truncate'>{ticket.lastMessage}</p>
          <p className='text-xs text-gray-400 mt-1'>
            {new Date(ticket.lastMessageTime).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <div className='p-4 text-center text-gray-500'>
        <p>{CHAT_MESSAGES.NO_CONVERSATIONS}</p>
      </div>
    )}
  </div>
);

export default AdminChatTicketList;
