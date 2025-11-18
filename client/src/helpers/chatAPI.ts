import { CHAT_CONFIG } from '../constants/chat/chat.ts';

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

interface MarkAsReadPayload {
  senderRole: 'admin' | 'user';
}

export const chatAPI = {
  async fetchTickets(): Promise<UserTicket[]> {
    const response = await fetch(`${CHAT_CONFIG.API_BASE}/admin/tickets`);
    if (!response.ok) throw new Error('Failed to fetch tickets');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async markAsRead(
    userId: string,
    payload: MarkAsReadPayload
  ): Promise<void> {
    const response = await fetch(
      `${CHAT_CONFIG.API_BASE}/mark-as-read/${userId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) throw new Error('Failed to mark as read');
  },

  async sendMessage(payload: {
    senderId: string;
    senderName: string;
    senderEmail: string;
    senderRole: string;
    message: string;
    userId: string;
  }): Promise<void> {
    const response = await fetch(`${CHAT_CONFIG.API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to send message');
  },
};
