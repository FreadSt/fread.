import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Refresh } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import io, { Socket } from 'socket.io-client';

// --- Placeholder imports for your project-specific helpers/stores ---
import { userRequest } from '../request-methods.ts';
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

// --------------------------------------------------------------------
// NOTE: This single file collects AdminPanel + AdminChat + small subcomponents
// with conservative, backward-compatible style tweaks (Tailwind).
// The goal: improved responsiveness, predictable scrolling, and clearer
// visual hierarchy without changing business logic.
// --------------------------------------------------------------------

interface Product {
  title: string;
  description: string;
  image: string;
  categories: string[];
  size: string[];
  color: string[];
  price: number;
  inStock: boolean;
}

interface AdminPanelState {
  product: Product;
  message: string;
}

export const AdminPanel: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [state, setState] = useState<AdminPanelState>({
    product: {
      title: '',
      description: '',
      image: '',
      categories: [],
      size: [],
      color: [],
      price: 0,
      inStock: true,
    },
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      product: { ...prev.product, [name]: value },
    }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Product
  ): void => {
    const { value } = e.target;
    setState((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        [field]: value === '' ? [] : value.split(',').map((item) => item.trim()),
      },
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await userRequest.post('/products', state.product);
      setState((prev) => ({
        ...prev,
        message: 'Product added successfully!',
        product: {
          title: '',
          description: '',
          image: '',
          categories: [],
          size: [],
          color: [],
          price: 0,
          inStock: true,
        },
      }));
    } catch (error: unknown) {
      const errorMessage =
        (error as any).response?.data?.message || (error as Error).message || 'Error adding product';
      setState((prev) => ({
        ...prev,
        message: 'Error adding product: ' + errorMessage,
      }));
    }
  };

  // If user is not admin, redirect immediately (keeps UI simple and predictable)
  if (!currentUser?.isAdmin) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
        <section className='md:col-span-2 bg-white rounded-lg shadow p-6'>
          <h1 className='text-2xl font-semibold mb-4'>Admin Panel</h1>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Title</label>
              <input
                type='text'
                name='title'
                value={state.product.title}
                onChange={handleInputChange}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Description</label>
              <input
                type='text'
                name='description'
                value={state.product.description}
                onChange={handleInputChange}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Image URL</label>
              <input
                type='text'
                name='image'
                value={state.product.image}
                onChange={handleInputChange}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Categories (comma-separated)</label>
              <input
                type='text'
                value={state.product.categories.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'categories')}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                placeholder='e.g., shoes, man, casual'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Sizes (comma-separated)</label>
              <input
                type='text'
                value={state.product.size.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'size')}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                placeholder='e.g., s, m, l'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Colors (comma-separated)</label>
              <input
                type='text'
                value={state.product.color.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'color')}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                placeholder='e.g., black, white'
              />
            </div>

            <div className='grid grid-cols-2 gap-4 items-center'>
              <div>
                <label className='block text-sm font-medium mb-1'>Price</label>
                <input
                  type='number'
                  name='price'
                  value={state.product.price}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      product: { ...prev.product, price: Number(e.target.value) },
                    }))
                  }
                  className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                  required
                />
              </div>

              <div className='flex items-center space-x-3'>
                <label className='text-sm font-medium'>In Stock</label>
                <input
                  type='checkbox'
                  name='inStock'
                  checked={state.product.inStock}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      product: { ...prev.product, inStock: e.target.checked },
                    }))
                  }
                  className='h-4 w-4 rounded border-gray-300 focus:ring-teal-300'
                  aria-label='In stock'
                />
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='submit'
                className='px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-300'
              >
                Add Product
              </button>

              {state.message && (
                <p className='text-sm text-gray-700'>{state.message}</p>
              )}
            </div>
          </form>
        </section>

        <aside className='md:col-span-1'>
          <AdminChat />
        </aside>
      </div>
    </div>
  );
};

// ---------------------- Admin Chat and subcomponents -------------------
export const AdminChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { tickets, selectedTicketId, loading } = useSelector((state: RootState) => state.chat);

  const [input, setInput] = useState<string>('');
  const [markedReadTickets, setMarkedReadTickets] = useState<Set<string>>(new Set());
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
      dispatch(setError(err instanceof Error ? err.message : 'Error loading tickets'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadTickets();

    socketRef.current = io(CHAT_CONFIG.SOCKET_URL, { transports: ['websocket'] });
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedTicket = tickets.find((t) => t.userId === selectedTicketId);

  const sortedMessages = [...(selectedTicket?.messages || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden w-full'>
      <div className='flex border-b items-center justify-between p-3'>
        <div>
          <h3 className='text-lg font-semibold'>Support Tickets</h3>
          <p className='text-xs text-gray-500'>{tickets?.length || 0} active</p>
        </div>
        <IconButton onClick={loadTickets} disabled={loading} size='small' sx={{ color: CHAT_STYLES.PRIMARY_COLOR }}>
          <Refresh />
        </IconButton>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-0'>
        <div className='md:col-span-1 border-r h-[60vh] overflow-y-auto bg-gray-50'>
          <AdminChatTicketList
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            loading={loading}
            onSelectTicket={handleSelectTicket}
            onRefresh={loadTickets}
          />
        </div>

        <div className='md:col-span-3 flex flex-col h-[60vh]'>
          {selectedTicket ? (
            <>
              <AdminChatHeader ticket={selectedTicket} />
              <AdminChatMessages
                messages={sortedMessages}
                messagesEndRef={messagesEndRef}
                onEmpty={CHAT_MESSAGES.NO_MESSAGES}
              />

              <div className='border-t p-3 flex gap-2 items-center'>
                <input
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={CHAT_MESSAGES.REPLY_PLACEHOLDER}
                  className='flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300'
                />
                <IconButton onClick={handleSend} disabled={!input.trim()} sx={{ color: CHAT_STYLES.PRIMARY_COLOR }}>
                  <Send />
                </IconButton>
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center h-full text-gray-500 p-6'>
              <p>{CHAT_MESSAGES.SELECT_TICKET}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ------------------------- Ticket List ---------------------------------
interface Ticket {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string | Date | null;
  unreadCount: number;
  messages: any[];
}

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  loading: boolean;
  onSelectTicket: (ticketId: string) => void;
  onRefresh: () => Promise<void> | void;
}

const AdminChatTicketList: React.FC<TicketListProps> = ({ tickets, selectedTicketId, loading, onSelectTicket }) => {
  return (
    <div>
      {tickets && tickets.length > 0 ? (
        tickets.map((ticket) => (
          <button
            key={ticket.userId}
            onClick={() => onSelectTicket(ticket.userId)}
            className={`w-full text-left p-4 border-b transition focus:outline-none ${
              selectedTicketId === ticket.userId ? 'bg-white' : 'hover:bg-gray-100'
            }`}
            aria-pressed={selectedTicketId === ticket.userId}
          >
            <div className='flex justify-between items-start mb-2'>
              <div className='truncate'>
                <p className='font-semibold truncate'>{ticket.userName}</p>
                <p className='text-xs text-gray-500 truncate'>{ticket.userEmail}</p>
              </div>

              {ticket.unreadCount > 0 && (
                <span className='ml-3 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold'>
                  {ticket.unreadCount}
                </span>
              )}
            </div>

            <p className='text-sm text-gray-600 truncate'>{ticket.lastMessage}</p>
            <p className='text-xs text-gray-400 mt-1'>
              {ticket.lastMessageTime ? new Date(ticket.lastMessageTime).toLocaleString() : ''}
            </p>
          </button>
        ))
      ) : (
        <div className='p-4 text-center text-gray-500'>
          <p>{CHAT_MESSAGES.NO_CONVERSATIONS}</p>
        </div>
      )}
    </div>
  );
};

// ------------------------- Messages ------------------------------------
interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  isRead: boolean;
  timestamp: string | Date;
}

interface MessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onEmpty: string;
}

const AdminChatMessages: React.FC<MessagesProps> = ({ messages, messagesEndRef, onEmpty }) => {
  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-3 flex flex-col'>
      {messages.length === 0 ? (
        <div className='flex items-center justify-center h-full text-gray-500'>
          <p>{onEmpty}</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
              msg.senderRole === 'admin' ? 'bg-teal-700 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'
            }`}>
              <p className='text-xs font-semibold opacity-80'>{msg.senderName}</p>
              <p className='text-sm'>{msg.message}</p>
              <p className='text-xs opacity-70 mt-1'>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.isRead && msg.senderRole === 'user' && <span className='ml-2'>✓ Read</span>}
              </p>
            </div>
          </div>
        ))
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

// ------------------------- Header --------------------------------------
interface TicketHeaderProps {
  ticket: Ticket;
}

const AdminChatHeader: React.FC<TicketHeaderProps> = ({ ticket }) => (
  <div className='p-4 border-b bg-gradient-to-r from-teal-600 to-teal-700 text-white'>
    <p className='text-lg font-semibold truncate'>{ticket.userName}</p>
    <p className='text-sm opacity-90 truncate'>{ticket.userEmail}</p>
  </div>
);

export default AdminPanel;
