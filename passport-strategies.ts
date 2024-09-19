import { Strategy } from 'passport-local';
import { User } from './models/user.model';
import crypto from 'crypto';
import ERRORS from './errors';

type Callback = (error: Error | null, user?: any | null, options?: any) => void;


const options = { usernameField: 'email' };
export const localStrategy = new Strategy(options, async function verify(
  email: string,
  password: string,
  done: Callback
) {
  try {
    const user = await User.findOne({ email }).select('+passwordHash').select('+salt');
    if (!user) {
      return done(null, false, ERRORS.INVALID_CREDENTIALS);
    }
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
      if (err) return done(err);
      if (!crypto.timingSafeEqual(user.passwordHash, hashedPassword)) {
        return done(null, null, ERRORS.INVALID_CREDENTIALS);
      }
      const { salt, passwordHash, ...userWithoutSensitiveData } = user.toObject();
      return done(null, userWithoutSensitiveData); // puts this user object into the session.
    });
  } catch (error) {
    return done(error as Error);
  }
});


//  = {
//   id: string;
//   email: string;
//   username: string;
// }

