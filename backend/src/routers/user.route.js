import express from 'express';
import { registerUser } from '../controllers/User.Controller.js';

export const userRouter = express.Router();

userRouter.post('/registerUser', registerUser);