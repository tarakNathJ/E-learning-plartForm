import mongoose ,{Schema} from "mongoose";

const SuperAdminSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    licenseeID:{
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true   

});

export  const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);

