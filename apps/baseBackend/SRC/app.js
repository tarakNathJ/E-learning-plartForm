import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import  authRouter from './Routes/Auth.router.js';
import  courseRoute from './Routes/All.course.details.route.js'



const app = express();

// to setup  body persor

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));



// to except json date  and use limitation
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/course', courseRoute);


app.use(express.static('public'))
app.use(cookieParser());




export { app }