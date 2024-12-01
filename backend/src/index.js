import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { userRouter } from './routers/user.route.js';
import { urlRouter } from './routers/url.route.js';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_,res) => {
    res.json({
        message: "Server Up"
    })
})

app.use('/api/v1/users',userRouter);
app.use('/api/v1/url', urlRouter);

app.listen(port, () => {
    console.log(`Server is up and listening on http://localhost:${port}`);
});