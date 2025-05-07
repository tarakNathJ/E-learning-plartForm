import { ApiError } from '../Utils/ApiError.js';
import { User } from '../Modules/User.module.js'
import { ApiResponce } from '../Utils/ApiResponce.js';
import { asyncHandler } from '../Utils/RequestHandler.js';
import { profile } from '../Modules/Profile.module.js';
import bcrypt from 'bcryptjs';


export const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.genetareAccessToken()
        const refreshToken = user.genetareRefressToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}



export const registerController = asyncHandler(async (req, res) => {
    const { userName, email, password, accountType = "student" } = req.body;
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    if (
        [userName, email, password, accountType].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ $and: [{ email: email }, { validUser: true }] })
    if (existedUser) {
        throw new ApiError(400, "User with email  already exists")
    }
    // create user object - create entry in db
    const user = await User.create({
        userName,
        email,
        password,
        accountType,
        validUser: true,
    });
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    // return res
    return res.status(201).json(
        new ApiResponce(200, createdUser, "User registered Successfully")
    )

})

export const loginController = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    

    if (!email) {
        throw new ApiError(400, "username or email is required")
    }


    const user = await User.findOne({
        $and: [{ email: email }, { validUser: true }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponce(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

}
)
export const logoutController = asyncHandler(async (req, res) => {
    const { refreshToken } = req.user;
    // check if refresh token is present
    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required")
    }
    // check if user exists in db
    const user = await User.findOne({ $and: [{ refreshToken: refreshToken }, { validUser: true }] })
    if (!user) {
        throw new ApiError(400, "User with this refresh token does not exists")
    }
    // remove refresh token from db
    await User.findByIdAndUpdate(user._id, { refreshToken: "" }, { new: true });
    // return res
    return res.status(200).json(
        new ApiResponce(200, null, "User logged out Successfully")
    )
})

export const refreshTokenController = asyncHandler(async (req, res) => {
    const { refreshToken } = req.user;
    // check if refresh token is present
    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required")
    }
    // check if user exists in db
    const user = await User.findOne({ $and: [{ refreshToken: refreshToken }, { validUser: true }] })
    if (!user) {
        throw new ApiError(400, "User with this refresh token does not exists")
    }

    // generate new access token
    const accessToken = await user.generateAccessToken();
    // return res
    return res.status(200).json(
        new ApiResponce(200, { accessToken }, "New access token generated")
    )
})
export const getAllUsersController = asyncHandler(async (req, res) => {
    // get all users from db
    const users = await User.find({ validUser: true }).select("-password -refreshToken");
    // check for user creation
    if (!users) {
        throw new ApiError(500, "Something went wrong while getting the users")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200, users, "All users fetched successfully")
    )
})

export const getSingleUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // check if user exists in db

    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200, user, "User fetched successfully")
    )
})
export const updateUserController = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const Id = req.user._id
    // check if user exists in db
    console.log(Id);
    const user = await User.findById({_id:Id}).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // update user
    const updatedUser = await User.findByIdAndUpdate(id, {
        userName: name,
        email: email
    }, { new: true }).select("-password -refreshToken");
    // check for user creation
    if (!updatedUser) {
        throw new ApiError(500, "Something went wrong while updating the user")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200, updatedUser, "User updated successfully")
    )
})
export const deleteUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // check if user exists in db
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // delete user
    await User.findByIdAndDelete(id);
    // return res
    return res.status(200).json(
        new ApiResponce(200, null, "User deleted successfully")
    )
})

export const blockUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // check if user exists in db
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // block user
    const blockedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true }).select("-password -refreshToken");
    // check for user creation
    if (!blockedUser) {
        throw new ApiError(500, "Something went wrong while blocking the user")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200, blockedUser, "User blocked successfully")
    )
})
export const unblockUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // check if user exists in db
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // unblock user
    const unblockedUser = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true }).select("-password -refreshToken");
    // check for user creation
    if (!unblockedUser) {
        throw new ApiError(500, "Something went wrong while unblocking the user")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200, unblockedUser, "User unblocked successfully")
    )
})

export const CreatePersonalDetailsController = asyncHandler(async (req, res) => {
    const { UserId, firstName, lastName, ifcs_Code, panCardID, aadharCardID, address, city, state, country, pinCode, phoneNumber } = req.body;
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    if (
        [UserId, firstName, lastName, ifcs_Code, panCardID, aadharCardID, address, city, state, country, pinCode, phoneNumber].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // check if user exists in db
    const user = await User.findById(UserId);
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // check if profile already exists
    const profile = await profile.findOne({ UserId: UserId });
    if (profile) {
        throw new ApiError(400, "Profile already exists")
    }
    // create profile object - create entry in db
    const newProfile = await profile.create({
        UserId,
        firstName,
        lastName,
        ifcs_Code,
        panCardID,
        aadharCardID,
        address,
        city,
        state,
        country,
        pinCode,
        phoneNumber
    });
    // check for profile creation
    if (!newProfile) {
        throw new ApiError(500, "Something went wrong while creating the profile")
    }

    // update user user profile
    const UpdateUserProfile = await User.findByIdAndUpdate({ _id: user._id }, {
        personalProfileID: newProfile._id
    }, { new: true });
    return res.status(201).json(
        new ApiResponce(200, newProfile, "Profile created Successfully")
    )
}
)
export const UpdateProfileController = asyncHandler(async (req, res) => {
    const { UserId, firstName, lastName, ifcs_Code, panCardID, aadharCardID, address, city, state, country, pinCode, phoneNumber } = req.body;
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    if (
        [UserId, firstName, lastName, ifcs_Code, panCardID, aadharCardID, address, city, state, country, pinCode, phoneNumber].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // check if user exists in db
    const user = await User.findById(UserId);
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // check if profile already exists
    const profile = await profile.findOne({ UserId: UserId });
    if (!profile) {
        throw new ApiError(400, "Profile does not exists")
    }
    // update profile object - create entry in db
    const updatedProfile = await profile.findByIdAndUpdate(profile._id, {
        firstName,
        lastName,
        ifcs_Code,
        panCardID,
        aadharCardID,
        address,
        city,
        state,
        country,
        pinCode,
        phoneNumber
    }, { new: true });
    // check for profile creation
    if (!updatedProfile) {
        throw new ApiError(500, "Something went wrong while creating the profile")
    }

    return res.status(201).json(
        new ApiResponce(200, newProfile, "Profile created Successfully")
    )
}
)
export const getProfileController = asyncHandler(async (req, res) => {
    const { UserId } = req.params;
    // check if user exists in db
    const user = await User.findById(UserId);
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // check if profile already exists
    const profile = await profile.findOne({ UserId: UserId });
    if (!profile) {
        throw new ApiError(400, "Profile does not exists")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200, profile, "Profile fetched successfully")
    )
})
export const getAllProfileController = asyncHandler(async (req, res) => {
    // get all users from db
    const profiles = await profile.find();
    // check for user creation
    if (!profiles) {
        throw new ApiError(500, "Something went wrong while getting the users")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200, profiles, "All users fetched successfully")
    )
})
export const deleteProfileController = asyncHandler(async (req, res) => {
    const { UserId } = req.params;
    // check if user exists in db
    const user = await User.findById(UserId);
    if (!user) {
        throw new ApiError(400, "User with this id does not exists")
    }
    // check if profile already exists
    const profile = await profile.findOne({ UserId: UserId });
    if (!profile) {
        throw new ApiError(400, "Profile does not exists")
    }
    // delete user
    await profile.findByIdAndDelete(profile._id);
    // return res
    return res.status(200).json(
        new ApiResponce(200, null, "Profile deleted successfully")
    )
})

//change Password 
export const changeCurrentPassword = asyncHandler(async (req, res) => {
	const { email, oldPassword, newPassword } = req.body


	const user = await User.findOne({ email: email })
	const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

	if (!isPasswordCorrect) {
		throw new ApiError(400, "Invalid old password")
	}

	user.password = newPassword
	await user.save({ validateBeforeSave: false })

	return res
		.status(200)
		.json(new ApiResponce(200, {}, "Password changed successfully"))
})




