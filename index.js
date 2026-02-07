import express  from 'express';
import dotenv from 'dotenv';
import dbConnect from './DB/dbConnect.js';
import authRouter from './routes/authUser.js';
import multer from 'multer';
import messageRouter from './routes/messageRout.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRout.js';

dbConnect();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(express.json());
app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log("==== DEBUG MIDDLEWARE ====");
//   console.log("Headers.cookie:", req.headers.cookie);
//   console.log("req.cookies object:", req.cookies);
//   console.log("==========================");
//   next();
// });

app.use(express.urlencoded({ /// ye hm tab use krte h jb form data bhejna ho server ko
    extended: true,
    limit: "16kb"
})); 

app.use(express.static("public"));

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});