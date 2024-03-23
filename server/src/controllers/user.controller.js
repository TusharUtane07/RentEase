import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
	try {
		//Getting data from client side
		const { firstName, lastName, email, password, confirmPassword } = req.body;
		console.log(firstName, lastName, email, password, confirmPassword);

		// Checking whether data is present or not, if not throwing error
		if (
			[firstName, lastName, email, password].some((fields) => !fields?.trim())
		) {
			throw new ApiError(400, "All fields are required");
		}

		// Checking for existing user
		const existedUser = await User.findOne({
			$or: [{ email }, { firstName, lastName }],
		});

		// If existing user found, throwing error
		if (existedUser) {
			throw new ApiError(
				409,
				"User with similar username or email already exists"
			);
		}

		//Getting the path of files/images
		const profileLocalPath = req.files?.profile[0]?.path;

		// Uploading on cloudinary
		if (!profileLocalPath) {
			throw new ApiError(400, "Profile Image is required");
		}
		const profile = await uploadToCloudinary(profileLocalPath);

		// Adding all the data-entries to Database
		const user = await User.create({
			firstName,
			lastName,
			profile: profile.url,
			email,
			password,
		});

		// Getting data for validation
		const createdUser = await User.findById(user._id).select(
			"-password -refreshToken"
		);

		// Checking data is there or not if not throwing the error
		if (!createdUser) {
			throw new ApiError(500, "Something went wrong while user registration");
		}

		// Sending the api response
		return res
			.status(201)
			.json(new ApiResponse(200, createdUser, "User registered successfully"));
	} catch (error) {
		// Handle errors
		return res
			.status(error.statusCode || 500)
			.json(new ApiResponse(error.statusCode || 500, null, error.message));
	}
});

export { registerUser };
