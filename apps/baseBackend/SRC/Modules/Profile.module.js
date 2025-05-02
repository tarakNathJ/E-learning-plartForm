import   mongoose, {Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const ProfileSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    ifcs_Code:{
        type: String,
        required: true,
        trim: true

    },
    panCardID:{
        type: String,
        required: true,
        trim: true
    },
    aadharCardID:{
        type: String,
        required: true,
        trim: true
    },
    address:{
        type: String,
        required: true,
        trim: true
    },
    city:{
        type: String,
        required: true,
        trim: true
    },
    state:{
        type: String,
        required: true,
        trim: true
    },
    country:{
        type: String,
        required: true,
        trim: true
    },
    pinCode:{
        type: String,
        required: true,
        trim: true
    },
    phoneNumber:{
        type: String,
        required: true,
        trim: true
    },
    profileImage:{
        type: String,
        required: true,
        trim: true
    },
    accountType:{
        type: String,
        required: true,
        enum: ['admin', 'student', 'teacher'],
        trim: true
    },
    accountStatus:{
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        trim: true
    },
},{
    timestamps: true,   

})

// to plugin aggregation pipeline
ProfileSchema.plugin(mongooseAggregatePaginate);

// to export module
export const profile = mongoose.model('Profile', ProfileSchema);