import express from 'express';
const app = express();
import morgan from 'morgan';
import cors from 'cors';
import config from './config/config.js';
import authRoutes from './routes/auth.routes.js';
import cookie from 'cookie-parser';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

app.use(passport.initialize());

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));

// Middleware
app.use(cookie());

app.use(morgan('dev'));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use auth routes
app.use('/api/auth', authRoutes);

export default app;