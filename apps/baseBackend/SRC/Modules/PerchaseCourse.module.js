import mongoose ,{Schema} from "mongoose";

const PurchaseCourseSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseID:{
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    purchaseDate:{
        type: Date,
        default: Date.now
    },
    paymentID:{
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    paymentStatus:{
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    
},{
    timestamps: true   
});
export  const PurchaseCourse = mongoose.model('PurchaseCourse', PurchaseCourseSchema);
//