import mongoose ,{Schema} from "mongoose";

const CourseNotesSchema = new Schema({
    courseID:{
        type: Schema.Types.ObjectId,
        ref: 'CourseDetails',
        required: true
    },
    notesTitle:{
        type: String,
        required: true,
        trim: true
    },
    notesDescription:{
        type: String,
        required: true,
        trim: true
    },
    notesFileLink:{
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true   
});

export const CourseNots = mongoose.model('CourseNotes', CourseNotesSchema);