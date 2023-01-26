require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const { mongodb } = require('./db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const rootRoute = require('./routes/root');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('./passport/passport');

const app = express();

if (!process.env.JWT_SECRET && !process.env.EXPRESS_SESSION_SECRET) {
  throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
}

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json({ limit: '50mb' }));
// app.use(cookieParser());

// Cross Origin Resource Sharing
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.SERVER_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Express session for passport
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', rootRoute);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

//Error Handler
app.use(errorHandler);
app.use(notFound);

// connect to mongodb
mongodb();

const port = process.env.PORT || 6001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
