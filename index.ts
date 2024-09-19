import express, { Express, Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import folderRouter from './routes/folder.route';
import session from 'express-session';
import passport from 'passport';
import { User } from './models/user.model';
import MongoStore from 'connect-mongo';
import authRouter from './routes/auth.route';
import { localStrategy } from './passport-strategies';
import listRouter from './routes/list.route';
import taskRouter from './routes/task.route';
import flash from 'express-flash';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

const db = mongoose.connection;

const corsOptions = {
  origin: 'http://localhost:3000/',
  optionsSuccessStatus: 200,
};

app.use(cors());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'the flying elephant',
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
app.use('/api/v0/auth/', authRouter);
app.use('/api/v0/folders', folderRouter);
app.use('/api/v0/lists', listRouter);
app.use('/api/v0/tasks', taskRouter);

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
