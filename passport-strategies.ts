import { Strategy } from 'passport-local';
import { User } from './models/user.model';
import crypto from 'crypto';

type Callback = (error: Error | null, user?: any | null, options?: any) => void;


// const options = { usernameField: 'email' };
export const localStrategy = new Strategy( async function verify(
  username: string,
  password: string,
  done: Callback
) {
  try {
    const user = await User.findOne({ username }).select('+passwordHash').select('+salt');
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
      if (err) return done(err);
      if (!crypto.timingSafeEqual(user.passwordHash, hashedPassword)) {
        return done(null, null, { message: 'Incorrect email or password.' });
      }
      console.log('🚀 ~ user in verify:', user);
      return done(null, user); // puts this user into session according to serializeUser function
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

