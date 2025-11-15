// Load environment variables FIRST before requiring any routes
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const path = require("node:path");

const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripe');

const app = express();

app.use(logger('[:date[clf]] Request :method :url', { immediate: true }));
app.use(logger('[:date[clf]] Response :method :url Status - :status Time - :response-time ms Content length - :res[content-length]'));

// Парсинг JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Маршруты
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', stripeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Обработка ошибок 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Error serving the request!',
  });
});

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected successfully to:', MONGO_URL);
    app.use(
      session({
        store: MongoStore.create({ client: mongoose.connection.getClient(), dbName: 'sessions' }),
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
      })
    );

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('Attempted to connect to:', MONGO_URL);
    process.exit(1);
  });