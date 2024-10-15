import { Strategy } from 'passport-local';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { USER } from './schema/user.model';
import getDBClient from './db/client';
import ERRORS from './errors';

type Callback = (error: Error | null, user?: any | null, options?: any) => void;

const db = getDBClient();

const options = { usernameField: 'email' };
export const localStrategy = new Strategy(options, async function verify(
  email: string,
  password: string,
  done: Callback
) {
  try {
    const [user] = await db.select().from(USER).where(eq(USER.email, email))
    //  .findOne({ email }).select('+passwordHash').select('+salt');
    if (!user) {
      return done(null, false, ERRORS.INVALID_CREDENTIALS);
    }
    
    // if (await bcrypt.compare(user.passwordHash , password)) {
    //   const { salt, passwordHash, ...userWithoutSensitiveData } = user;
    //   return done(null, userWithoutSensitiveData);
    // } else {
    //     return done(null, false, ERRORS.INVALID_CREDENTIALS);
    //   }

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
      if (err) return done(err);
      if (!crypto.timingSafeEqual(user.passwordHash, hashedPassword)) {
        return done(null, null, ERRORS.INVALID_CREDENTIALS);
      }
      const { salt, passwordHash, ...userWithoutSensitiveData } = user;
      return done(null, userWithoutSensitiveData); // puts this user object into the session.
    });
  } catch (error) {
    return done(error as Error);
  }
});

