import { CourseDetails } from '../Modules/CourseDetails.module.js' ;
import { User } from '../Modules/User.module.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponce  } from '../Utils/ApiResponce.js';
import { asyncHandler } from '../Utils/RequestHandler.js';
import {CourseContent} from '../Modules/CourseContent.module.js';
import { CourseAssigment } from '../Modules/CourseAssigment.module.js';
import { SubmitAssigment } from '../Modules/SubmitAssigment.module.js';
import { CourseNots } from '../Modules/CourseNots.module.js';



export const getAllCourseDetails = asyncHandler(async (req, res) => {
    const courseDetails = await CourseDetails.find({}).populate('courseInstructor', 'name email').populate('courseCategory', 'categoryName');
    if (!courseDetails) {
        throw new ApiError(404, 'No course details found');
    }
    res.status(200).json(new ApiResponce(200, true, 'Course details fetched successfully', courseDetails));
}
);
export const getCourseDetailsById = asyncHandler(async (req, res) => {
    const courseDetails = await CourseDetails.findById(req.params.id).populate('courseInstructor', 'name email').populate('courseCategory', 'categoryName');
    if (!courseDetails) {
        throw new ApiError(404, 'No course details found');
    }
    res.status(200).json(new ApiResponce(200, true, 'Course details fetched successfully', courseDetails));
}
);
export const CreateCourseController = asyncHandler(async (req, res) => {
    const { courseName, courseDescription, courseCategory, courseInstructor, coursePrice, courseDuration ,courseImage } = req.body;
    
    if (!courseName || !courseDescription || !courseCategory || !courseInstructor || !coursePrice || !courseDuration) {
        throw new ApiError(400, 'Please provide all required fields');
    }
    const instructor = await User.findById(courseInstructor);
    if (!instructor) {
        throw new ApiError(404, 'Instructor not found');
    }
    const category = await CourseDetails.findById(courseCategory);
    if (!category) {
        throw new ApiError(404, 'Category not found');
    }
    const existingCourse = await CourseDetails.find({ courseName });
    if (existingCourse.length > 0) {
        throw new ApiError(400, 'Course already exists');
    }
    if (coursePrice < 0) {
        throw new ApiError(400, 'Course price cannot be negative');
    }
    if (courseDuration < 0) {
        throw new ApiError(400, 'Course duration cannot be negative');
    }
    
    const courseDetails = await CourseDetails.create({
        courseName,
        courseDescription,
        courseCategory,
        courseInstructor,
        coursePrice,
        courseDuration,
        courseImage: courseImage,
    });
    res.status(201).json(new ApiResponce(201, true, 'Course created successfully', courseDetails));
})
export const AddCourseContentController = asyncHandler(async (req, res) => {
    const { courseID, contentTitle, contentDescription, contentLink } = req.body;
    if (!courseID || !contentTitle || !contentDescription || !contentLink) {
        throw new ApiError(400, 'Please provide all required fields');
    }
    const courseDetails = await CourseDetails.findById(courseID);
    if (!courseDetails) {
        throw new ApiError(404, 'Course not found');
    }
    const courseContent = await CourseContent.create({
        courseID,
        contentTitle,
        contentDescription,
        contentLink,
    });
    res.status(201).json(new ApiResponce(201, true, 'Course content added successfully', courseContent));
});
export const getCourseContentController = asyncHandler(async (req, res) => {
    const { courseID } = req.params;
    if (!courseID) {
        throw new ApiError(400, 'Please provide course ID');
    }
    const courseDetails = await CourseDetails.findById(courseID);
    if (!courseDetails) {
        throw new ApiError(404, 'Course not found');
    }
    const courseContent = await CourseContent.find({ courseID }).populate('courseID', 'courseName');
    if (!courseContent) {
        throw new ApiError(404, 'No course content found');
    }
    res.status(200).json(new ApiResponce(200, true, 'Course content fetched successfully', courseContent));
});

export const getCourseContentByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, 'Please provide course content ID');
    }
    const courseContent = await CourseContent.findById(id).populate('courseID', 'courseName');
    if (!courseContent) {
        throw new ApiError(404, 'No course content found');
    }
    res.status(200).json(new ApiResponce(200, true, 'Course content fetched successfully', courseContent));
}
);
export const UpdateCourseContentController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { contentTitle, contentDescription, contentLink } = req.body;
    if (!id) {
        throw new ApiError(400, 'Please provide course content ID');
    }
    if (!contentTitle || !contentDescription || !contentLink) {
        throw new ApiError(400, 'Please provide all required fields');
    }
    const courseContent = await CourseContent.findById(id);
    if (!courseContent) {
        throw new ApiError(404, 'No course content found');
    }
    const updatedCourseContent = await CourseContent.findByIdAndUpdate(id, {
        contentTitle,
        contentDescription,
        contentLink,
    }, { new: true });
    res.status(200).json(new ApiResponce(200, true, 'Course content updated successfully', updatedCourseContent));
});
export const DeleteCourseContentController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, 'Please provide course content ID');
    }
    const courseContent = await CourseContent.findById(id);
    if (!courseContent) {
        throw new ApiError(404, 'No course content found');
    }
    await CourseContent.findByIdAndDelete(id);
    res.status(200).json(new ApiResponce(200, true, 'Course content deleted successfully'));
});
export const CreateCourseAssigmentController = asyncHandler(async (req, res) => {
    const { courseID, assigmentTitle, assigmentDescription, assigmentLink } = req.body;
    if (!courseID || !assigmentTitle || !assigmentDescription || !assigmentLink) {
        throw new ApiError(400, 'Please provide all required fields');
    }
    const courseDetails = await CourseDetails.findById(courseID);
    if (!courseDetails) {   
        throw new ApiError(404, 'Course not found');
    }
    const courseAssigment = await CourseAssigment.create({
        courseID,
        assigmentTitle,
        assigmentDescription,
        assigmentLink,
    });
    res.status(201).json(new ApiResponce(201, true, 'Course assigment created successfully', courseAssigment));
}
);
export const getCourseAssigmentController = asyncHandler(async (req, res) => {
    const { courseID } = req.params;
    if (!courseID) {
        throw new ApiError(400, 'Please provide course ID');
    }
    const courseDetails = await CourseDetails.findById(courseID);
    if (!courseDetails) {
        throw new ApiError(404, 'Course not found');
    }
    const courseAssigment = await CourseAssigment.find({ courseID }).populate('courseID', 'courseName');
    if (!courseAssigment) {
        throw new ApiError(404, 'No course assigment found');
    }
    res.status(200).json(new ApiResponce(200, true, 'Course assigment fetched successfully', courseAssigment));
}
);
export const SubmitAssigmentController = asyncHandler(async (req, res) => {
    const { courseID, assigmentID, submitLink } = req.body;
    if (!courseID || !assigmentID || !submitLink) {
        throw new ApiError(400, 'Please provide all required fields');
    }
    const courseDetails = await CourseDetails.findById(courseID);
    if (!courseDetails) {
        throw new ApiError(404, 'Course not found');
    }
    const courseAssigment = await CourseAssigment.findById(assigmentID);
    if (!courseAssigment) {
        throw new ApiError(404, 'Assigment not found');
    }
    const existingSubmit = await SubmitAssigment.findOne({ courseID, assigmentID });
    if (existingSubmit) {
        throw new ApiError(400, 'Assigment already submitted');
    }
    const submitAssigment = await SubmitAssigment.create({
        courseID,
        assigmentID,
        submitLink,
    });
    res.status(201).json(new ApiResponce(201, true, 'Assigment submitted successfully', submitAssigment));
}
);
export const getSubmitAssigmentController = asyncHandler(async (req, res) => {
    const { courseID } = req.params;
    if (!courseID) {
        throw new ApiError(400, 'Please provide course ID');
    }
    const courseDetails = await CourseDetails.findById(courseID);
    if (!courseDetails) {
        throw new ApiError(404, 'Course not found');
    }
    const submitAssigment = await SubmitAssigment.find({ courseID }).populate('courseID', 'courseName').populate('assigmentID', 'assigmentTitle');
    if (!submitAssigment) {
        throw new ApiError(404, 'No assigment submitted');
    }
    res.status(200).json(new ApiResponce(200, true, 'Assigment submitted fetched successfully', submitAssigment));
}
);
export const getSubmitAssigmentByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, 'Please provide submit assigment ID');
    }
    const submitAssigment = await SubmitAssigment.findById(id).populate('courseID', 'courseName').populate('assigmentID', 'assigmentTitle');
    if (!submitAssigment) {
        throw new ApiError(404, 'No assigment submitted found');
    }
    res.status(200).json(new ApiResponce(200, true, 'Assigment submitted fetched successfully', submitAssigment));
}
);  
export const createCourseNotsController = asyncHandler(async (req, res) => {
    const { courseID, notsTitle, notsDescription,notesFileLink } = req.body;
    if (!courseID || !notsTitle || !notsDescription  || !notesFileLink) {
        throw new ApiError(400, 'Please provide all required fields');
    }
    const courseDetails = await CourseDetails.findById(courseID);
    if (!courseDetails) {
        throw new ApiError(404, 'Course not found');
    }
    const courseNots = await CourseNots.create({
        courseID,
        notsTitle,
        notsDescription,
        notesFileLink,
    });
    res.status(201).json(new ApiResponce(201, true, 'Course nots created successfully', courseNots));
}
);

export const getCourseNotsController = asyncHandler(async (req, res) => {
    const { courseID } = req.params;
    if (!courseID) {
        throw new ApiError(400, 'Please provide course ID');
    }
    const courseDetails = await CourseDetails.findById(courseID);
    if (!courseDetails) {
        throw new ApiError(404, 'Course not found');
    }
    const courseNots = await CourseNots.find({ courseID }).populate('courseID', 'courseName');
    if (!courseNots) {
        throw new ApiError(404, 'No course nots found');
    }
    res.status(200).json(new ApiResponce(200, true, 'Course nots fetched successfully', courseNots));
}
);
export const getCourseNotsByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, 'Please provide course nots ID');
    }
    const courseNots = await CourseNots.findById(id).populate('courseID', 'courseName');
    if (!courseNots) {
        throw new ApiError(404, 'No course nots found');
    }
    res.status(200).json(new ApiResponce(200, true, 'Course nots fetched successfully', courseNots));
}
);


