import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { RootState, AppDispatch } from '../store';
import {
  setTickets,
  selectTicket,
  addMessage,
  markAsRead,
  setLoading,
  setError,
} from '../store/chat-slice';
import { chatAPI } from '../helpers/chatAPI';
import { CHAT_CONFIG, CHAT_MESSAGES, CHAT_STYLES } from '../constants/chat/chat.ts';
import AdminChatHeader from '../components/AdminChatHeader';
import AdminChatTicketList from '../components/AdminChatTicketList';
import AdminChatMessages from '../components/AdminChatMessages';
import io, { Socket } from 'socket.io-client';

export const AdminChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { tickets, selectedTicketId, loading } = useSelector(
    (state: RootState) => state.chat
  );

  const [input, setInput] = useState<string>('');
  const [markedReadTickets, setMarkedReadTickets] = useState<Set<string>>(
    new Set()
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  if (!currentUser?.isAdmin) return null;

  const loadTickets = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const data = await chatAPI.fetchTickets();
      const ticketsArray = Array.isArray(data) ? data : [];
      dispatch(setTickets(ticketsArray));
    } catch (err) {
      dispatch(
        setError(err instanceof Error ? err.message : 'Error loading tickets')
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadTickets();

    socketRef.current = io(CHAT_CONFIG.SOCKET_URL);
    socketRef.current.emit('joinRoom', CHAT_CONFIG.ADMIN_ROOM);

    const handleMessage = (message: any): void => {
      dispatch(addMessage(message));
    };

    socketRef.current.on('receiveMessage', handleMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('receiveMessage', handleMessage);
        socketRef.current.disconnect();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedTicketId && !markedReadTickets.has(selectedTicketId)) {
      (async () => {
        try {
          await chatAPI.markAsRead(selectedTicketId, { senderRole: 'admin' });
          dispatch(markAsRead(selectedTicketId));
          setMarkedReadTickets((prev) => new Set(prev).add(selectedTicketId));
        } catch (err) {
          console.error('Error marking as read:', err);
        }
      })();
    }
  }, [selectedTicketId, dispatch, markedReadTickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicketId, tickets]);

  const handleSelectTicket = (ticketId: string): void => {
    dispatch(selectTicket(ticketId));
  };

  const handleSend = async (): Promise<void> => {
    if (!input.trim() || !selectedTicketId || !currentUser) return;

    const messageData = {
      senderId: currentUser._id,
      senderName: currentUser.username,
      senderEmail: currentUser.email,
      senderRole: 'admin',
      message: input,
      userId: selectedTicketId,
    };

    try {
      await chatAPI.sendMessage(messageData);

      if (socketRef.current) {
        socketRef.current.emit('sendMessage', messageData);
      }

      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedTicket = tickets.find((t) => t.userId === selectedTicketId);

  const sortedMessages = [...(selectedTicket?.messages || [])].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className='grid grid-cols-4 gap-4 max-h-screen p-4'>
      <AdminChatTicketList
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        loading={loading}
        onSelectTicket={handleSelectTicket}
        onRefresh={loadTickets}
      />

      <div className='col-span-3 bg-white rounded-lg shadow-md flex flex-col overflow-hidden h-[70vh] w-full'>
        {selectedTicket ? (
          <>
            <AdminChatHeader ticket={selectedTicket} />
            <AdminChatMessages
              messages={sortedMessages}
              messagesEndRef={messagesEndRef}
              onEmpty={CHAT_MESSAGES.NO_MESSAGES}
            />
            <div className='border-t p-3 flex gap-2'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={CHAT_MESSAGES.REPLY_PLACEHOLDER}
                className='flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500'
              />
              <IconButton
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{
                  color: CHAT_STYLES.PRIMARY_COLOR,
                  '&:hover': {
                    backgroundColor: `rgba(13, 148, 136, 0.1)`,
                  },
                }}
              >
                <Send />
              </IconButton>
            </div>
          </>
        ) : (
          <div className='flex items-center justify-center h-full text-gray-500'>
            <p>{CHAT_MESSAGES.SELECT_TICKET}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
