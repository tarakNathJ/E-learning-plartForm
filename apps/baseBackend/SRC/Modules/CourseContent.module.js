import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CourseContentSchema = new Schema({
    courseID:{
        type: Schema.Types.ObjectId,
        ref: 'CourseDetails',
        required: true
    },
    contentTitle:{
        type: String,
        required: true,
        trim: true
    },
    contentDescription:{
        type: String,
        required: true,
        trim: true
    },
    contentType:{
        type: String,
        required: true,
        trim: true
    },
    contentLink:{
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true   
});

// to plugin aggregation pipeline
CourseContentSchema.plugin(mongooseAggregatePaginate)
// export module
export const CourseContent = mongoose.model('CourseContent', CourseContentSchema);