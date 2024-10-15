import passport from 'passport';
import crypto from 'crypto';
import getDBClient from '../db/client';
import { createRouter } from '../utils/createRouter';
import { BackendError } from '../utils/errors';
import { USER } from '../schema/user.model';
import { singleOrThrow } from '../db/utils';

const db = getDBClient();


export default createRouter((router) => {
  router.post(
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

  router.post('/login-success', (req, res) => {
    res.status(200).json({ message: 'Authenticated', user: req.user });
  });

  router.get('/login-success', (req, res) => {
    res.status(200).json({ message: 'Authenticated', user: 1 });
  });

  router.get('/login-failed', (req, res) => {
    throw new BackendError('INVALID_CREDENTIALS')
  });

  router.get('/user', (req, res) => {
    if (req.user) return res.json({ message: 'Authenticated', user: req.user });
    throw new BackendError('NOT_AUTHENTICATED');
  });

  router.post('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: 'User logged out successfully' });
    });
  });

  router.post('/signup', function (req, res, next) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
      if (err) return next(err);

      try {
        const user = await db
          .insert(USER)
          .values({
            username: req.body.username,
            email: req.body.email,
            passwordHash: hashedPassword,
            salt,
          })
          .returning().then(singleOrThrow);
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
});
