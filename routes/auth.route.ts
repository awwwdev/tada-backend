import express from 'express';
import passport, { AuthenticateCallback } from 'passport';
import crypto from 'crypto';
import { ensureLoggedIn } from 'connect-ensure-login';
import { User } from '../models/user.model';
import ERRORS from '../errors';
import getDBClient from '../db/client';

const db = getDBClient();


const authRouter = express.Router();

authRouter.post(
  '/login/with-password',
  passport.authenticate('local', {
    failureRedirect: '/api/v0/auth/login-failed',
    // successRedirect: '/api/v0/auth/login-success',
    // successMessage: 'Logged in successfully.',
    failureFlash: true,
  }),
  (req, res) => {
    res.status(200).json({ message: 'Authenticated', user: req.user });
  }
);

authRouter.post('/login-success', (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
});

authRouter.get('/login-success', (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: 1 });
});

authRouter.get('/login-failed', (req, res) => {
  res.status(401).json(ERRORS.INVALID_CREDENTIALS);
});

authRouter.get('/user', (req, res) => {
  if (req.user) return res.json({ message: 'Authenticated', user: req.user });
  return res.json({ message: ERRORS.NOT_AUTHENTICATED.message });
});

authRouter.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'User logged out successfully' });
  });
});

authRouter.post('/signup', function (req, res, next) {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
    if (err) return next(err);

    try {
      const [user] = await db.insert(User).values({
        username: req.body.username,
        email: req.body.email,
        passwordHash: hashedPassword,
        salt
      }).returning()
      // User.create({
      //   // username: req.body.username,
      //   email: req.body.email,
      //   passwordHash: hashedPassword,
      //   salt: salt,
      // });
      req.login(user, (err) => {
        if (err) return next(err);
        // res.redirect('/');

        // @ts-ignore
        const { salt, passwordHash, ...userWithoutSensitiveData } = user;
        res.json({ message: 'User created successfully', user: userWithoutSensitiveData });
      });
    } catch (error) {
      return next(error);
    }
  });
});

export default authRouter;
