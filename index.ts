
import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import folderRouter from './routes/folder.route';
//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// routes
app.use("/api/v0/folders", folderRouter);

mongoose.connect(process.env.MONGODB_URI ?? "").then(
  () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  }
).catch((err) => {
  console.log(err);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

