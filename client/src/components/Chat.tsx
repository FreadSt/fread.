import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { Close, Message, Send } from '@mui/icons-material';
import { IconButton, Badge, Fab } from '@mui/material';
import { RootState } from '../store';
import {CHAT_CONFIG} from "../constants/chat/chat.ts";

interface ChatMessage {
  _id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'user' | 'admin';
  message: string;
  userId: string;
  isRead: boolean;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  if (currentUser?.isAdmin) {
    return null;
  }

  const chatRoom = `user-${currentUser?._id}`;

  useEffect(() => {
    const count = messages.filter(
      (msg) => msg.senderRole === 'admin' && !msg.isRead
    ).length;
    setUnreadCount(count);
  }, [messages]);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    const newSocket = io(socketUrl, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.emit('joinRoom', chatRoom);

    fetch(`${CHAT_CONFIG.API_BASE}/user/${currentUser?._id}`)
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching messages:', err));

    newSocket.on('receiveMessage', (message: ChatMessage) => {
      if (message.userId === currentUser?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?._id, chatRoom]);

  useEffect(() => {
    const markAsRead = async (): Promise<void> => {
      if (currentUser && isOpen) {
        try {
          await fetch(
            `${CHAT_CONFIG.API_BASE}/mark-as-read/${currentUser?._id}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ senderRole: 'user' }),
            }
          );


          setMessages((prev) =>
            prev.map((msg) =>
              msg.senderRole === 'admin' ? { ...msg, isRead: true } : msg
            )
          );
        } catch (err) {
          console.error('Error marking messages as read:', err);
        }
      }
    };

    markAsRead();
  }, [isOpen, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (): void => {
    if (!input.trim() || !currentUser || !socket) return;

    const messageData = {
      senderId: currentUser._id,
      senderName: currentUser.username,
      senderEmail: currentUser.email,
      senderRole: 'user',
      message: input,
      userId: currentUser._id,
    };

    socket.emit('sendMessage', messageData);
    setInput('');
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      {!isOpen && (
        <Badge badgeContent={unreadCount} color='error'>
          <Fab
            color='primary'
            aria-label='open chat'
            onClick={() => setIsOpen(true)}
            sx={{
              backgroundColor: '#0d9488',
              '&:hover': {
                backgroundColor: '#0f766e',
              },
            }}
          >
            <Message />
          </Fab>
        </Badge>
      )}

      {isOpen && (
        <div
          className='absolute bottom-0 right-0 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden'
          style={{ boxShadow: '0 5px 40px rgba(0,0,0,0.16)' }}
        >
          <div
            className='flex items-center justify-between p-4 text-white'
            style={{
              background: 'linear-gradient(to right, #0d9488, #0f766e)',
            }}
          >
            <div className='flex items-center gap-2'>
              <Message />
              <div>
                <h2 className='text-lg font-semibold'>Support Chat</h2>
                <p className='text-xs opacity-90'>Chat with our support team</p>
              </div>
            </div>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              size='small'
            >
              <Close fontSize='small' />
            </IconButton>
          </div>

          <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 flex flex-col-reverse'>
            <div ref={messagesEndRef} />
            {messages.length === 0 ? (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <p className='text-sm'>
                  No messages yet. Our support team will respond soon!
                </p>
              </div>
            ) : (
              [...messages].reverse().map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId === currentUser._id
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === currentUser._id
                        ? 'bg-teal-700 text-white rounded-br-none'
                        : 'bg-blue-100 text-blue-900 border border-blue-300 rounded-bl-none'
                    }`}
                  >
                    <p className='text-xs font-semibold opacity-80'>
                      {msg.senderName}
                      {msg.senderRole === 'admin' && (
                        <span className='ml-2 bg-blue-600 text-white px-2 py-0.5 rounded text-xs'>
                          Support
                        </span>
                      )}
                    </p>
                    <p className='text-sm'>{msg.message}</p>
                    <p className='text-xs opacity-70 mt-1'>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className='border-t p-3 bg-white flex gap-2'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Write a message...'
              className='flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500'
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim()}
              sx={{
                color: '#0d9488',
                '&:hover': {
                  backgroundColor: 'rgba(13, 148, 136, 0.1)',
                },
              }}
              size='small'
            >
              <Send fontSize='small' />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
