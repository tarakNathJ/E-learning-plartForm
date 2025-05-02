import express from 'express';
import {RazorpayOrder ,VerifyPayment} from '../Controller/Parchase.controller.js';
import {isStudent ,verifyJWT} from '../MiddleWare/Auth.middleware.js';

const router = express.Router();

router.route('/createOrder').post(verifyJWT ,isStudent ,RazorpayOrder);
router.route('/verifyPayment').post(verifyJWT,isStudent,VerifyPayment);

export default router;

