import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CourseAssigmentSchema = new Schema({
    courseID:{
        type: Schema.Types.ObjectId,
        ref: 'CourseContent',
        required: true
    },
    assigmentTitle:{
        type: String,
        required: true,
        trim: true
    },
    assigmentDescription:{
        type: String,
        required: true,
        trim: true
    },
    assigmentType:{
        type: String,
        required: true,
        trim: true
    },
    assigmentLink:{
        type: String,
        required: true,
        trim: true
    },
    assigmentMarks:{
        type: Number,
        required: true,
        trim: true
    },
    assigmentDate:{
        type: Date,
        required: true,
        trim: true
    },
    assigmentStatus:{
        type: String,
        required: true,
        trim: true
    },
    assigmentSubmissionDate:{
        type: Date,
        required: true,
        trim: true
    },
    assigmentSubmissionStatus:{
        type: String,
        required: true,
        trim: true
    },
    assigmentSubmissionLink:{
        type: String,
        required: true,
        trim: true
    }},{
    timestamps: true
});

// to plugin aggregation pipeline
CourseAssigmentSchema.plugin(mongooseAggregatePaginate)
// export module
export const CourseAssigment = mongoose.model('CourseAssigment', CourseAssigmentSchema);