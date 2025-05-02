import {ApiError} from '../Utils/ApiError.js';
import {User} from '../Modules/User.module.js'
import {ApiResponce }from '../Utils/ApiResponce.js';
import {asyncHandler} from '../Utils/RequestHandler.js';
import {profile} from '../Modules/Profile.module.js';


export const registerController = asyncHandler(async (req, res) => {
    const {userName,email,password,accountType} = req.body;
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    if(
		[userName,email,password,accountType].some((field) => field?.trim() === "")
	) {
		throw new ApiError(400,"All fields are required")
	}

    const existedUser = await User.findOne({$and: [{email: email},{validUser: true}]})
    if(existedUser) {
        throw new ApiError(400,"User with email  already exists")
    }
    // create user object - create entry in db
    const user = await User.create({
        userName,
        email,
        password,
        accountType,
        validUser: false,
    });
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    // check for user creation
    if(!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    // return res
    return res.status(201).json(
		new ApiResponce(200,createdUser,"User registered Successfully")
	)
 
})

export const loginController = asyncHandler(async (req, res) => {
    const {email,password} = req.body;
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    if(
        [email,password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required")
    }
    // check if user exists in db
    const user = await User.findOne({$and: [{email: email},{validUser: true}]})
    if(!user) {
        throw new ApiError(400,"User with email  does not exists")
    }
    // check if password is correct
    const isPasswordCorrect = await user.isPasswordMatched(password);
    if(!isPasswordCorrect) {
        throw new ApiError(400,"Invalid Password")
    }
    // generate refresh token and access token
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    // update refresh token in db
    await User.findByIdAndUpdate(user._id,{refreshToken: refreshToken},{new: true});
    // remove password and refresh token field from response
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    // check for user creation
    if(!loggedInUser) {
        throw new ApiError(500,"Something went wrong while logging in the user")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200,loggedInUser,"User logged in Successfully") 
    )
}
)
export const logoutController = asyncHandler(async (req, res) => {
    const {refreshToken} = req.body;
    // check if refresh token is present
    if(!refreshToken) {
        throw new ApiError(400,"Refresh token is required")
    }
    // check if user exists in db
    const user = await User.findOne({$and: [{refreshToken: refreshToken},{validUser: true}]})
    if(!user) {
        throw new ApiError(400,"User with this refresh token does not exists")
    }
    // remove refresh token from db
    await User.findByIdAndUpdate(user._id,{refreshToken: ""},{new: true});
    // return res
    return res.status(200).json(
        new ApiResponce(200,null,"User logged out Successfully") 
    )
})
export const refreshTokenController = asyncHandler(async (req, res) => {
    const {refreshToken} = req.body;
    // check if refresh token is present
    if(!refreshToken) {
        throw new ApiError(400,"Refresh token is required")
    }
    // check if user exists in db
    const user = await User.findOne({$and: [{refreshToken: refreshToken},{validUser: true}]})
    if(!user) {
        throw new ApiError(400,"User with this refresh token does not exists")
    }
    // generate new access token
    const accessToken = await user.generateAccessToken();
    // return res
    return res.status(200).json(
        new ApiResponce(200,{accessToken},"New access token generated") 
    )
})
export const getAllUsersController = asyncHandler(async (req, res) => {
    // get all users from db
    const users = await User.find({validUser: true}).select("-password -refreshToken");
    // check for user creation
    if(!users) {
        throw new ApiError(500,"Something went wrong while getting the users")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200,users,"All users fetched successfully") 
    )
})

export const getSingleUserController = asyncHandler(async (req, res) => {
    const {id} = req.params;
    // check if user exists in db
    const user = await User.findById(id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200,user,"User fetched successfully") 
    )
})
export const updateUserController = asyncHandler(async (req, res) => {
    const {id} = req.params;
    // check if user exists in db
    const user = await User.findById(id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // update user
    const updatedUser = await User.findByIdAndUpdate(id,req.body,{new: true}).select("-password -refreshToken");
    // check for user creation
    if(!updatedUser) {
        throw new ApiError(500,"Something went wrong while updating the user")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200,updatedUser,"User updated successfully") 
    )
})
export const deleteUserController = asyncHandler(async (req, res) => {
    const {id} = req.params;
    // check if user exists in db
    const user = await User.findById(id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // delete user
    await User.findByIdAndDelete(id);
    // return res
    return res.status(200).json(
        new ApiResponce(200,null,"User deleted successfully") 
    )
})

export const blockUserController = asyncHandler(async (req, res) => {
    const {id} = req.params;
    // check if user exists in db
    const user = await User.findById(id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // block user
    const blockedUser = await User.findByIdAndUpdate(id,{isBlocked: true},{new: true}).select("-password -refreshToken");
    // check for user creation
    if(!blockedUser) {
        throw new ApiError(500,"Something went wrong while blocking the user")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200,blockedUser,"User blocked successfully") 
    )
})
export const unblockUserController = asyncHandler(async (req, res) => {
    const {id} = req.params;
    // check if user exists in db
    const user = await User.findById(id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // unblock user
    const unblockedUser = await User.findByIdAndUpdate(id,{isBlocked: false},{new: true}).select("-password -refreshToken");
    // check for user creation
    if(!unblockedUser) {
        throw new ApiError(500,"Something went wrong while unblocking the user")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200,unblockedUser,"User unblocked successfully") 
    )
})

export const CreatePersonalDetailsController = asyncHandler(async (req, res) => {
    const {UserId , firstName, lastName, ifcs_Code, panCardID, aadharCardID, address, city, state, country, pinCode, phoneNumber} = req.body;
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    if(
        [UserId, firstName, lastName, ifcs_Code, panCardID, aadharCardID, address, city, state, country, pinCode, phoneNumber].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required")
    }
    // check if user exists in db
    const user = await User.findById(UserId);
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // check if profile already exists
    const profile = await profile.findOne({UserId: UserId});
    if(profile) {
        throw new ApiError(400,"Profile already exists")
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
    if(!newProfile) {
        throw new ApiError(500,"Something went wrong while creating the profile")
    }

    return res.status(201).json(
        new ApiResponce(200,newProfile,"Profile created Successfully")
    )   
}
)
export const UpdateProfileController = asyncHandler(async (req, res) => {
    const {UserId , firstName, lastName, ifcs_Code, panCardID, aadharCardID, address, city, state, country, pinCode, phoneNumber} = req.body;
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    if(
        [UserId, firstName, lastName, ifcs_Code, panCardID, aadharCardID, address, city, state, country, pinCode, phoneNumber].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required")
    }
    // check if user exists in db
    const user = await User.findById(UserId);
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // check if profile already exists
    const profile = await profile.findOne({UserId: UserId});
    if(!profile) {
        throw new ApiError(400,"Profile does not exists")
    }
    // update profile object - create entry in db
    const updatedProfile = await profile.findByIdAndUpdate(profile._id,{
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
    },{new: true});
    // check for profile creation
    if(!updatedProfile) {
        throw new ApiError(500,"Something went wrong while creating the profile")
    }

    return res.status(201).json(
        new ApiResponce(200,newProfile,"Profile created Successfully")
    )   
}
)
export const getProfileController = asyncHandler(async (req, res) => {
    const {UserId} = req.params;
    // check if user exists in db
    const user = await User.findById(UserId);
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // check if profile already exists
    const profile = await profile.findOne({UserId: UserId});
    if(!profile) {
        throw new ApiError(400,"Profile does not exists")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200,profile,"Profile fetched successfully") 
    )
})
export const getAllProfileController = asyncHandler(async (req, res) => {
    // get all users from db
    const profiles = await profile.find();
    // check for user creation
    if(!profiles) {
        throw new ApiError(500,"Something went wrong while getting the users")
    }
    // return res
    return res.status(200).json(
        new ApiResponce(200,profiles,"All users fetched successfully") 
    )
})
export const deleteProfileController = asyncHandler(async (req, res) => {
    const {UserId} = req.params;
    // check if user exists in db
    const user = await User.findById(UserId);
    if(!user) {
        throw new ApiError(400,"User with this id does not exists")
    }
    // check if profile already exists
    const profile = await profile.findOne({UserId: UserId});
    if(!profile) {
        throw new ApiError(400,"Profile does not exists")
    }
    // delete user
    await profile.findByIdAndDelete(profile._id);
    // return res
    return res.status(200).json(
        new ApiResponce(200,null,"Profile deleted successfully") 
    )
})




