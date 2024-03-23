import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// creating method for generating access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
	try {
		// finding user with id
		const user = await User.findById(userId);
		// running function for generating access token that is created in user model
		const accessToken = user.generateAccessToken();
		// running function for generating refresh token that is created in user model
		const refreshToken = user.generateRefreshToken();

		// saving refresh token in database
		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		// returning both access and refresh token for after use
		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"Something went wrong, while generating refresh and access tokens"
		);
	}
};

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

// writing code for logging user in
const loginUser = asyncHandler(async (req, res) => {
	// Getting user input
	const { email, password } = req.body;
	console.log(email, password);

	// Checking whether data is present or not, if not throwing error
	if ([email, password].some((fields) => !fields?.trim())) {
		throw new ApiError(400, "All fields are required");
	}

	// checking email or username anyone present or not, if not throw error
	if (!email) {
		throw new ApiError(400, "Email is required");
	}

	// checking in database if this username or email present or not
	const user = await User.findOne({
		$or: [{ email }],
	});

	// throwing error if such user is not present
	if (!user) {
		throw new ApiError(404, "User does not exists, Register first");
	}

	// checking password validation, throwing error if not
	const isPasswordValid = await user.isPasswordCorrect(password);
	if (!isPasswordValid) {
		throw new ApiError(402, "Password is not correct");
	}

	// calling function for generating and saving access and refresh token
	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
		user._id
	);

	// selecting fields to send user without password and refresh token
	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	// sending data with cookies to user, we neet to create some options
	const options = {
		// below properties are used to secure our cookies, i.e this cookies can not be modified on frontend, it can be modified by server
		httpOnly: true,
		secure: true,
	};

	// sending the response
	return res
		.status(200)
		.cookie("AccessToken", accessToken, options)
		.cookie("RefreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: loggedInUser,
					accessToken,
					refreshToken,
				},
				"User logged in Successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				refreshToken: undefined,
			},
		},
		{
			new: true,
		}
	);
	const options = {
		// below properties are used to secure our cookies, i.e this cookies can not be modified on frontend, it can be modified by server
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged out successfully"));
});
// checking refreshtoken for authentication time refreshment of user
const refreshAccessToken = asyncHandler(async (req, res) => {
	try {
		// getting refresh token from cookies that we saved
		const incomingRefreshToken =
			req.cookies?.RefreshToken || req.body?.RefreshToken;

		// if not present throw error
		if (!incomingRefreshToken) {
			throw new ApiError(402, "Unauthorized request");
		}

		// verifying the refreshtoken as did before
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		// if we have id then store it in user, data is send by the jwt token
		const user = await User.findById(decodedToken?._id);

		// if not present throw error
		if (!user) {
			throw new ApiError(401, "Invalid refresh token");
		}
		// matching the incoming and already added token
		if (incomingRefreshToken !== user?.refreshToken) {
			throw new ApiError(401, "Refresh token is expired or used");
		}

		const options = {
			httpOnly: true,
			secure: true,
		};

		const { accessToken, newRefreshToken } =
			await generateAccessAndRefreshTokens(user._id);

		return res
			.status(200)
			.cookie("AccessToken", accessToken, options)
			.cookie("RefreshToken", newRefreshToken, options)
			.json(
				new ApiResponse(
					200,
					{ accessToken, refreshToken: newRefreshToken },
					"Access token refreshed successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Invalid Refresh Token");
	}
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
