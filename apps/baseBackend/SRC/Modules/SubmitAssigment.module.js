import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const SubmitAssigmentSchema = new Schema({
    courseID:{
        type: Schema.Types.ObjectId,
        ref: 'CourseAssigment',
        required:true,
    },
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
   
    assigmentTitle:{
        type: String,
        required:true,
        trim:true
    },
    assigmentLink:{
        type: String,
        required:true,
        trim:true
    },},{
    timestamps: true
});

// to plugin aggregation pipeline
SubmitAssigmentSchema.plugin(mongooseAggregatePaginate)

// export module
export const SubmitAssigment = mongoose.model('SubmitAssigment', SubmitAssigmentSchema);
