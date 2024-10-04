import express from 'express';
import passport, { AuthenticateCallback } from 'passport';
import crypto from 'crypto';
import { ensureLoggedIn } from 'connect-ensure-login';
import { User } from '../models/user.model';
import ERRORS from '../errors';
import getDBClient from '../db/client';

const db = getDBClient();

/* Configure password authentication strategy.
 *
 * The `LocalStrategy` authenticates users by verifying a username and password.
 * The strategy parses the username and password from the request and calls the
 * `verify` function.
 *
 * The `verify` function queries the database for the user record and verifies
 * the password by hashing the password supplied by the user and comparing it to
 * the hashed password stored in the database.  If the comparison succeeds, the
 * user is authenticated; otherwise, not.
 */

const authRouter = express.Router();

// function authMiddleware(req, res, next) {
//   passport.authenticate('local', (err: Error, user: Express.User, info: any, status: any) => {
//     if (err) return next(err);
//     if (!user) return res.json({ message: 'Not Authenticated' });
//     res.json({ message: 'Authenticated' });
//   });
// }

// authRouter.post('/login/password', (req, res, next) => {
//   passport.authenticate('local', (err: Error, user: Express.User, info: any, status: any) => {
//     if (err) return next(err);
//     if (!user) return res.json({ message: 'Not Authenticated' });
//     res.json({ message: 'Authenticated' });
//   })(req, res, next);
// });
// authRouter.post(
//   '/login/with-password',
//   passport.authenticate('local', {
//     successRedirect: '/api/v0/auth/login-success',
//     failureRedirect: '/api/v0/auth/login-failed',
//     failureFlash: true
//   })
// );

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
