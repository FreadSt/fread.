require('dotenv').config();
const socketIo = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const path = require('node:path');
const http = require('http');
const cors = require('cors');

const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripe');
const chatRoutes = require('./routes/chat');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

const io = socketIo(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] },
});


app.use(logger('[:date[clf]] Request :method :url', { immediate: true }));
app.use(
  logger(
    '[:date[clf]] Response :method :url Status - :status Time - :response-time ms Content length - :res[content-length]'
  )
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', stripeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res) => {
  res.status(404).json({
    message: 'Error serving the request!',
  });
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const {
        senderId,
        senderName,
        senderEmail,
        senderRole,
        message,
        userId,
      } = data;

      console.log('Received message:', {
        senderRole,
        userId,
        message,
      });

      const newMessage = new Message({
        senderId,
        senderName,
        senderEmail,
        senderRole: senderRole || 'user',
        message,
        userId: userId || null,
      });

      await newMessage.save();

      io.to(`user-${userId}`).emit('receiveMessage', newMessage);

      io.to('admin-support').emit('receiveMessage', newMessage);

      console.log('Message emitted to rooms:', `user-${userId}`, 'admin-support');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected successfully to:', MONGO_URL);

    app.use(
      session({
        store: MongoStore.create({
          client: mongoose.connection.getClient(),
          dbName: 'sessions',
        }),
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
      })
    );

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('Attempted to connect to:', MONGO_URL);
    process.exit(1);
  });
