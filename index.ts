
import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;



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

