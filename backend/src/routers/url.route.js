import express from 'express';
import { shortenURL,updateOriginalURLtoShorten,deleteURL } from '../controllers/url.controller.js';

export const urlRouter = express.Router();

urlRouter.post('/createShortLinks/:id',shortenURL);
urlRouter.put('/updateURL/:id',updateOriginalURLtoShorten);
urlRouter.post('/deleteURL',deleteURL);