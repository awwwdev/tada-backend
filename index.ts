import express, { Request, Response, Application } from 'express';
import cors from 'cors';
// import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { User } from './models/user.model';
// import MongoStore from 'connect-mongo';
import { localStrategy } from './passport-strategies';
import flash from 'express-flash';
import morgan from 'morgan';
import pgSession from 'connect-pg-simple';
import router from './routes';
import { eq } from 'drizzle-orm';
import getDBClient from './db/client';
import config from './config';

const app: Application = express();
const port = config().PORT;
// create connection to database
const db = getDBClient();

// const db = mongoose.connection;

const corsOptions = {
  origin: config().FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(morgan('tiny'));
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// need cookieParser middleware before we can do anything with cookies

const pgSessionStore = pgSession(session);

type aa = pgSession.PGStoreOptions

app.use(
  session({
    secret: config().SESSION_SECRET_KEY,
  resave: false,
    saveUninitialized: true,
    // cookie: {
    //   sameSite: 'lax',
    //   maxAge: 60 * 60 * 24 * 30,
    //   secure: true,
    // },
    store: new pgSessionStore({
      // pool: ??? // IMPROVE use pool 
      tableName: 'sessions',
      conString: config().POSTGRESQL_CONNECTION_STRING,
      createTableIfMissing: true,
      
    }),
  })
);

app.use(flash());
passport.use(localStrategy);

passport.serializeUser((user: Express.User, next: Next) => {
  process.nextTick(() => {
    // @ts-ignore
    next(null, user.id);
  });
});

type SerializedUser = string;
type Next = (error: Error | null, user?: any | null, options?: any) => void;

passport.deserializeUser(async function (userId: SerializedUser, next: Next) {
  try {
    const [user] = await db.select().from(User).where(eq(User.id, userId));
    process.nextTick(() => next(null, user));
  } catch (err) {
    return next(err instanceof Error ? err : new Error('Internal Server Error: ' + err));
  }
});

app.use(passport.initialize());
app.use(passport.session()); // attaches user object to request

// routes
app.use('/api/v0', router);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to TADA Server');
});

// mongoose
//   .connect(process.env.MONGODB_URL ?? '')
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(port, () => {
//       console.log(`Server is Fire at http://localhost:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// app.get('/', (req: Request, res: Response) => {
//   res.send('Welcome to Express & TypeScript Server');
// });
