import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface UserTicket {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: ChatMessage[];
}

interface ChatState {
  tickets: UserTicket[];
  selectedTicketId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  tickets: [],
  selectedTicketId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setTickets(state, action: PayloadAction<UserTicket[]>) {
      state.tickets = action.payload;
      state.error = null;
    },

    selectTicket(state, action: PayloadAction<string>) {
      state.selectedTicketId = action.payload;
    },

    addMessage(state, action: PayloadAction<ChatMessage>) {
      const message = action.payload;
      const ticketIndex = state.tickets.findIndex(
        (t) => t.userId === message.userId
      );

      if (ticketIndex !== -1) {
        state.tickets[ticketIndex].messages.push(message);
        state.tickets[ticketIndex].lastMessage = message.message;
        state.tickets[ticketIndex].lastMessageTime = new Date(message.timestamp);

        if (message.senderRole === 'user' && !message.isRead) {
          state.tickets[ticketIndex].unreadCount += 1;
        }

        const ticket = state.tickets[ticketIndex];
        state.tickets.splice(ticketIndex, 1);
        state.tickets.unshift(ticket);
      } else {
        const newTicket: UserTicket = {
          userId: message.userId,
          userName: message.senderName,
          userEmail: message.senderEmail,
          messages: [message],
          lastMessage: message.message,
          lastMessageTime: new Date(message.timestamp),
          unreadCount: message.senderRole === 'user' && !message.isRead ? 1 : 0,
        };
        state.tickets.unshift(newTicket);
      }
    },

    markAsRead(state, action: PayloadAction<string>) {
      const ticketIndex = state.tickets.findIndex(
        (t) => t.userId === action.payload
      );
      if (ticketIndex !== -1) {
        state.tickets[ticketIndex].unreadCount = 0;
        state.tickets[ticketIndex].messages = state.tickets[
          ticketIndex
          ].messages.map((msg) =>
          msg.senderRole === 'user' ? { ...msg, isRead: true } : msg
        );
      }
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setTickets,
  selectTicket,
  addMessage,
  markAsRead,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice;
