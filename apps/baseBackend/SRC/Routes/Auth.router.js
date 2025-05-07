import express from 'express';
import {
    registerController,
    loginController ,
    logoutController,
    refreshTokenController,
    updateUserController,
    deleteUserController,
    getAllUsersController,
    getSingleUserController,
    blockUserController,
    unblockUserController,
    CreatePersonalDetailsController,
    UpdateProfileController,
    getProfileController,
    getAllProfileController,
    deleteProfileController ,
    changeCurrentPassword 
} from '../Controller/Auth.controller.js';

import { verifyJWT } from '../MiddleWare/Auth.middleware.js';


const router = express.Router();

router.route('/register').post(registerController);
router.route('/login').post(loginController);
router.route('/logout').post(verifyJWT ,logoutController);
router.route('/refresh').get(verifyJWT,refreshTokenController);
router.route('/update').post(verifyJWT,updateUserController);
router.route('/delete').delete(deleteUserController);
router.route('/all-users').get(getAllUsersController);
router.route('/single-user/:id').get(getSingleUserController);
router.route('/block-user/:id').put(blockUserController);
router.route('/unblock-user/:id').put(unblockUserController);
router.route('/CreateUserProfile').post(CreatePersonalDetailsController);
router.route('/UpdateUserProfile').post(UpdateProfileController);
router.route('/getUserProfile').get(getProfileController);
router.route('/getAllProfile').get(getAllProfileController);
router.route('/deleteUserProfile').delete(deleteProfileController);
router.route('/changePassword').post(changeCurrentPassword);

export default router;