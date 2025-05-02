import crypto from 'crypto-js';
import { RazorpayInstance } from '../Utils/RazorpayInstance.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponce } from '../Utils/ApiResponce.js';
import { asyncHandler } from '../Utils/RequestHandler.js';
import { User } from '../Modules/User.module.js';
import { CourseDetails } from '../Modules/CourseDetails.module.js';
import { PurchaseCourse } from '../Modules/PerchaseCourse.module.js';
import { Payment } from '../Modules/Payment.module.js';



export const RazorpayOrder = asyncHandler(async (req, res) => {
    const { amount, currency } = req.body;
    if (!amount || !currency) {
        throw new ApiError(400, 'Please provide amount and currency');
    }

    const options = {
        amount: amount * 100,
        currency: currency,
        receipt: crypto.randomBytes(10).toString('hex'),
        notes: {
            key1: 'value3',
            key2: 'value2'
        }
    };

    RazorpayInstance.orders.create(options, (err, order) => {
        if (err) {
            throw new ApiError(500, err.message);
        }
        res.status(200).json(new ApiResponce(200, true, 'Order created successfully', order));
    });
}
);
export const VerifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature ,userID , courseID ,amount ,status} = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userID || !courseID || !amount || !status) {
        throw new ApiError(400, 'Please provide all required fields');
    }

    const generated_signature = crypto.HmacSHA256(razorpay_order_id + '|' + razorpay_payment_id, process.env.KEY_SECRET).toString();
    if (generated_signature !== razorpay_signature) {
        throw new ApiError(400, 'Invalid signature');
    }
    const user = await User.findById(userID);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const Course = await CourseDetails.findById(courseID);
    if (!Course) {
        throw new ApiError(404, 'Course not found');
    }
    const purchaseDate = new Date();
    const payment = await Payment.create({
        userID: user._id,
        courseID: Course._id,
        paymentStatus: status,
        paymentAmount: amount,
        paymentDate: purchaseDate,
        RazorpayOrderID: razorpay_order_id,
        RazorpayPaymentID: razorpay_payment_id,
        RazorpaySignature: razorpay_signature
       
    });
    if (!payment) {
        throw new ApiError(500, 'Payment not created');
    }
    const purchaseCourse = await PurchaseCourse.create({
        userID: user._id,
        courseID: Course._id,
        purchaseDate: purchaseDate,
        paymentID: payment._id,
        paymentStatus: status,
        
    });
    if (!purchaseCourse) {
        throw new ApiError(500, 'Purchase course not created');
    }

    res.status(200).json(new ApiResponce(200, true, 'Payment verified successfully'));
}
);



