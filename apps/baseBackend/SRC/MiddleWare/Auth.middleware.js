
import {ApiError} from "../Utils/ApiError.js";
import jwt from "jsonwebtoken"
import {asyncHandler} from "../Utils/RequestHandler.js";
import {User} from "../Modules/User.module.js";



export const verifyJWT = asyncHandler(async (req,_,next) => {
	try {
		const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
		console.log(req.cookies);

		console.log(req.cookies);
		if(!token) {
			throw new ApiError(401,"Unauthorized request")
		}

		const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

		const user = await User.findById(decodedToken?._id).select("-password ")

		if(!user) {

			throw new ApiError(401,"Invalid Access Token")
		}

		req.user = user;
		next()
	} catch(error) {
		throw new ApiError(401,error?.message || "Invalid access token")
	}

})


export const isAdmin = asyncHandler(async (req,_,next) => {
	
	if(req.user.accountType !== "admin") {
		throw new ApiError(400,"this only for admin preson")
	}
	next()
})

export const isTeacher = asyncHandler(async (req,_,next) => {
	if(req.user.accountType !== "teacher") {
		throw new ApiError(400,"this only for customer preson")
	}
	next()
})

export const isStudent = asyncHandler(async (req,_,next) => {
	if(req.user.accountType !== "student") {
		throw new ApiError(400,"this only for customer preson")
	}
	next()
})