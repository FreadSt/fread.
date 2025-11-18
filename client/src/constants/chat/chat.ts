export const CHAT_CONFIG = {
  ADMIN_ROOM: 'admin-support',
  SOCKET_URL: 'http://localhost:5000',
  API_BASE: 'http://localhost:5000/api/chat',
};

export const CHAT_MESSAGES = {
  NO_CONVERSATIONS: 'No active conversations yet',
  NO_MESSAGES: 'No messages yet',
  SELECT_TICKET: 'Select a ticket to view conversation',
  REPLY_PLACEHOLDER: 'Reply to customer...',
};

export const CHAT_STYLES = {
  PRIMARY_COLOR: '#0d9488',
  PRIMARY_HOVER: '#0f766e',
  HEADER_GRADIENT: 'from-teal-600 to-teal-700',
  BADGE_COLOR: 'error' as const,
};
