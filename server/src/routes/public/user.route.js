import { userController } from "#controllers";
import express from "express";
const { registerUserController, sendOTPController } = userController;

const router = express.Router();

router.post("/send-otp", sendOTPController); // Initiates user registration by validating input and sending an OTP to the user's email.
router.post("/register", registerUserController); // Completes user registration by verifying OTP and creating the user account.

export const userRoute = router;
