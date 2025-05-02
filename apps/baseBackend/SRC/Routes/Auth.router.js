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
    deleteProfileController 
} from '../Controller/Auth.controller.js';


const router = express.Router();

router.route('/register').post(registerController);
router.route('/login').post(loginController);
router.route('/logout').get(logoutController);
router.route('/refresh').get(refreshTokenController);
router.route('/update').put(updateUserController);
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

export default router;