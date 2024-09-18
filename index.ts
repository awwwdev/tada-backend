import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import folderRouter from './routes/folder.route';
import session from 'express-session';
import passport from 'passport';
import { User } from './models/user.model';
import MongoStore from 'connect-mongo';
import authRouter from './routes/auth.route';
import { localStrategy } from './passport-strategies';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

const db = mongoose.connection;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: process.env.MONGODB_URI }),
  })
);

passport.use(localStrategy);

passport.serializeUser((user: Express.User, next: Callback) => {
  process.nextTick(() => {
    // @ts-ignore
    next(null, user._id);
  });
});

type SerializedUser = string;
type Callback = (error: Error | null, user?: any | null, options?: any) => void;

passport.deserializeUser(async function (userId: SerializedUser, next: Callback) {
  try {
    const userObj = await User.findById(userId);
    process.nextTick(() => {
      return next(null, userObj);
    });
  } catch (error) {
    return next(error instanceof Error ? error : new Error('Internal Server Error: ' + error));
  }
});

app.use(passport.initialize());
app.use(passport.session()); // attaches user object to request
// app.use(passport.authenticate('session'));

// routes
app.use('/api/v0/auth/', authRouter);
app.use('/api/v0/folders', folderRouter);

mongoose
  .connect(process.env.MONGODB_URI ?? '')
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
