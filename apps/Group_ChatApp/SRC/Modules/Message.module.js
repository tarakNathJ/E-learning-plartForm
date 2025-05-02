import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupID: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    userName:{
        type:String,
        required:true,
    }

}, {
    timestamps: true
});

export const message =  mongoose.model('message',messageSchema);

