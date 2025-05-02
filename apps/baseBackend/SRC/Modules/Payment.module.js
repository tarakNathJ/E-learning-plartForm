import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const PaymentSchema = new Schema({
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    courseID:{
        type: Schema.Types.ObjectId,
        ref: 'CourseDetails',
        required:true,
    },
    paymentStatus:{
        type: String,
        required:true,
        trim:true
    },
    paymentAmount:{
        type: Number,
        required:true,
        trim:true
    },
    paymentDate:{
        type: Date,
        required:true,
        trim:true
    },
    RazorpayOrderID:{
        type: String,
        required:true,
        trim:true
    },
    RazorpayPaymentID:{
        type: String,
        required:true,
        trim:true
    },
    RazorpaySignature:{
        type: String,
        required:true,
        trim:true
    }
    
},{
    timestamps: true
});
// to plugin aggregation pipeline
PaymentSchema.plugin(mongooseAggregatePaginate)
// export module
export const Payment = mongoose.model('Payment', PaymentSchema);

