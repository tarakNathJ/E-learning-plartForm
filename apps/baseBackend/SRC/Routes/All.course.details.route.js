import express from 'express';
import {
    getAllCourseDetails ,
    getCourseDetailsById ,
    CreateCourseController ,
    AddCourseContentController ,
    getCourseContentController,
    getCourseContentByIdController ,
    UpdateCourseContentController ,
    DeleteCourseContentController ,
    CreateCourseAssigmentController,
    getCourseAssigmentController,
    SubmitAssigmentController,
    
    getSubmitAssigmentByIdController,
    createCourseNotsController,
    getCourseNotsController,
    getCourseNotsByIdController,
} from '../Controller/All.about.course.controller.js';

import {isAdmin ,isStudent ,isTeacher ,verifyJWT} from '../MiddleWare/Auth.middleware.js';

const router = express.Router();
// Course Details
router.route('/allCourse').get(getAllCourseDetails);
router.route('/course/:id').get(getCourseDetailsById);
router.route('/createCourse').post(verifyJWT, isAdmin, CreateCourseController);
router.route('/addCourseContent/:id').post(verifyJWT, isAdmin, AddCourseContentController);
router.route('/getCourseContent/:id').get(getCourseContentController);
router.route('/getCourseContentById/:id').get(getCourseContentByIdController);
router.route('/updateCourseContent/:id').put(verifyJWT, isAdmin, UpdateCourseContentController);
router.route('/deleteCourseContent/:id').delete(verifyJWT, isAdmin, DeleteCourseContentController);
router.route('/createCourseAssigment/:id').post(verifyJWT,isAdmin, CreateCourseAssigmentController);
router.route('/getCourseAssigment/:id').get(verifyJWT,isStudent, getCourseAssigmentController);
router.route('/submitAssigment/:id').post(verifyJWT,isStudent, SubmitAssigmentController);

router.route('/getSubmitAssigmentById/:id').get(verifyJWT,isStudent, getSubmitAssigmentByIdController);
router.route('/createCourseNots/:id').post(verifyJWT,isAdmin, createCourseNotsController);
router.route('/getCourseNots/:id').get(verifyJWT,isStudent, getCourseNotsController);
router.route('/getCourseNotsById/:id').get(verifyJWT,isStudent, getCourseNotsByIdController);


export default router;