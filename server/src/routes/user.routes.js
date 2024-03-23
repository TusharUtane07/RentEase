import { Router } from "express";
import {
	registerUser,
	loginUser,
	refreshAccessToken,
	logoutUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/Multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
	upload.fields([
		{
			name: "profile",
			maxCount: 1,
		},
	]),
	registerUser
);
router.route("/login").post(loginUser);

// Secured Routes
// added middleware to check verified user then do the functionality provided on this particular route
router.route("/logout").post(verifyJWT, logoutUser);
// checking for refresh token expiry and adding new one
router.route("/refresh-token").post(refreshAccessToken);
export default router;
