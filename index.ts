import express, { Express, Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { User } from './models/user.model';
import MongoStore from 'connect-mongo';
import { localStrategy } from './passport-strategies';
import flash from 'express-flash';
import morgan from 'morgan';
import router from './routes';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// const db = mongoose.connection;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(morgan("tiny"));
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// need cookieParser middleware before we can do anything with cookies


const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || "the flying elephant";

app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: process.env.MONGODB_URL }),
  })
);


app.use(flash());
passport.use(localStrategy);

passport.serializeUser((user: Express.User, next: Next) => {
  process.nextTick(() => {
    // @ts-ignore
    next(null, user._id);
  });
});

type SerializedUser = string;
type Next = (error: Error | null, user?: any | null, options?: any) => void;

passport.deserializeUser(async function (userId: SerializedUser, next: Next) {
  try {
    const userObj = await User.findById(userId);
    process.nextTick(() => next(null, userObj));
  } catch (err) {
    return next(err instanceof Error ? err : new Error('Internal Server Error: ' + err));
  }
});

app.use(passport.initialize());
app.use(passport.session()); // attaches user object to request

// routes
app.use('/api/v0', router);

mongoose
  .connect(process.env.MONGODB_URL ?? '')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});
