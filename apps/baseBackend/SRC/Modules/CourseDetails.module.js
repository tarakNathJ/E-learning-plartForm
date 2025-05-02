import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CourseDetailsSchema = new Schema({
    
    courseName:{
        type: String,
        required: true,
        trim: true
    },
    courseDescription:{
        type: String,
        required: true,
        trim: true
    },
    courseDuration:{
        type: String,
        required: true,
        trim: true
    },
    coursePrice:{
        type: Number,
        required: true,
        trim: true
    },
    couresAuthor:{
        type: String,
        required: true,
        trim: true
    },
    courseCategory:{
        type: String,
        required: true,
        trim: true
    },
    courseImage:{
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true   
});
// to plugin aggregation pipeline
CourseDetailsSchema.plugin(mongooseAggregatePaginate)

// export module
export const CourseDetails = mongoose.model('CourseDetails', CourseDetailsSchema);
