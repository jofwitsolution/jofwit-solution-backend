const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const express = require('express');
const { mongodb } = require('./db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { passport } = require('./controllers/authController');

dotenv.config();

const app = express();

if (!process.env.JWT_SECRET && !process.env.EXPRESS_SESSION_SECRET) {
  throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
}

app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.SERVER_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use(errorHandler);
app.use(notFound);

mongodb();

const port = process.env.PORT || 6001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
