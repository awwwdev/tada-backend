import express from 'express';
import passport, { AuthenticateCallback } from 'passport';
import crypto from 'crypto';
import { TUser, User } from '../models/user.model';

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

authRouter.post(
  '/login/with-password',
  passport.authenticate('local', {
    successRedirect: '/api/v0/auth/login-success',
    failureRedirect: '/api/v0/auth/login-failed',
    failureFlash: true
  })
);

authRouter.post('/login-success', (req, res) => {
  res.json({ message: 'success' });
});

authRouter.post('/login-failed', (req, res) => {
  res.json({ message: 'faild' });
});

authRouter.get('/status', (req, res) => {
  if (req.user) return res.json({ message: 'Authenticated', user: req.user });
  return res.json({ message: 'Not Authenticated' });
});

authRouter.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'User logged out successfully' });
  });
});

authRouter.post('/signup', function (req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
    if (err) return next(err);

    try {
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        passwordHash: hashedPassword,
        salt: salt,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // res.redirect('/');
        res.json({ message: 'User created successfully' });
      });
    } catch (error) {
      return next(error);
    }
  });
});

export default authRouter;
