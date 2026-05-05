import User from "../models/userModel.js";
import { generateToken } from "../config/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendResetEmail, sendOTPEmail } from "../services/emailService.js";
import OTP from "../models/otpModel.js";
import TrustedDevice from "../models/trustedDeviceModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { fullName, email, password, deviceId } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            fullName,
            email,
            password,
        });

        if (user) {
            // Generate 6-digit OTP for initial verification
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

            // Store OTP for user
            await OTP.findOneAndUpdate(
                { userId: user._id },
                { otp, expiresAt },
                { upsert: true }
            );

            // Send OTP Email (Non-blocking)
            sendOTPEmail(user.email, otp, user.fullName || "Customer").catch(err => 
                console.error("OTP Email failed:", err.message)
            );

            res.status(201).json({
                otpRequired: true,
                userId: user._id,
                message: "Registration successful. Please verify your email."
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password, deviceId } = req.body;
    console.log(`[Login] email: ${email}, deviceId: ${deviceId}`);

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            // Check for device-based trust
            if (deviceId) {
                const isTrusted = await TrustedDevice.findOne({ userId: user._id, deviceId });
                console.log(`[Login] isTrusted: ${!!isTrusted}`);

                if (!isTrusted) {
                    // Generate 6-digit OTP
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

                    // Store/Update OTP for user
                    await OTP.findOneAndUpdate(
                        { userId: user._id },
                        { otp, expiresAt },
                        { upsert: true }
                    );

                    // Send OTP Email (Non-blocking)
                    sendOTPEmail(user.email, otp, user.fullName || "Customer").catch(err =>
                        console.error("Login OTP Email failed:", err.message)
                    );

                    return res.json({ otpRequired: true, userId: user._id });
                }
            }

            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id, user.isAdmin),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
    const { tokenId, accessToken, deviceId } = req.body;
    console.log(`[Google Login] deviceId: ${deviceId}`);

    try {
        let name, email, picture;

        // Determine if tokenId is a JWT (ID Token) or an Access Token
        // JWTs have 3 segments separated by dots
        const isJWT = (token) => token && token.split(".").length === 3;

        if (tokenId && isJWT(tokenId)) {
            // Verify as ID Token
            const ticket = await client.verifyIdToken({
                idToken: tokenId,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            name = payload.name;
            email = payload.email;
            picture = payload.picture;
        } else {
            // Treat as Access Token (implicit flow or provided directly)
            const tokenToUse = accessToken || tokenId;
            if (!tokenToUse) {
                return res.status(400).json({ message: "No token provided" });
            }

            const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenToUse}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error_description || "Token verification failed or expired");
            }

            name = data.name;
            email = data.email;
            picture = data.picture;
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName: name,
                email,
                password: Math.random().toString(36).slice(-8),
                avatar_url: picture,
            });
        }

        if (user) {
            // Check for device-based trust for Google Login
            if (deviceId) {
                const isTrusted = await TrustedDevice.findOne({ userId: user._id, deviceId });
                console.log(`[Google Login] isTrusted: ${!!isTrusted}`);

                if (!isTrusted) {
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    const expiresAt = Date.now() + 5 * 60 * 1000;

                    await OTP.findOneAndUpdate(
                        { userId: user._id },
                        { otp, expiresAt },
                        { upsert: true }
                    );

                    sendOTPEmail(user.email, otp, user.fullName || "Customer").catch(err =>
                        console.error("Google Login OTP Email failed:", err.message)
                    );

                    return res.json({ otpRequired: true, userId: user._id });
                }
            }

            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id, user.isAdmin),
                avatar_url: user.avatar_url,
            });
        } else {
            res.status(400).json({ message: "Google login failed" });
        }
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ message: error.message || "Google authentication failed" });
    }
};
// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Return success even if user doesn't exist to prevent email enumeration
            return res.json({ message: "Email sent" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set expire (10 minutes)
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;

        // Log the reset URL to the console for development testing
        console.log("-----------------------------------------");
        console.log(`Password Reset Symbol link for ${user.email}:`);
        console.log(resetUrl);
        console.log("-----------------------------------------");

        const message = `
        You are receiving this email because you (or someone else) has requested the reset of a password.
        Please click on the following link, or paste this into your browser to complete the process:
        
        ${resetUrl}

        If you did not request this, please ignore this email and your password will remain unchanged.
        `;

        // Send email only if credentials exist
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Non-blocking call
            sendResetEmail(user.email, resetUrl, user.fullName || "Customer");
        } else {
            console.log("-----------------------------------------");
            console.log("NOTICE: Email sending skipped (missing credentials in .env)");
            console.log("The reset link below is for your manual testing:");
            console.log(resetUrl);
            console.log("-----------------------------------------");
        }

        res.json({ message: "Email sent" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        // Hash the token from URL
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP & Login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
    const { userId, otp, deviceId } = req.body;

    try {
        const otpRecord = await OTP.findOne({ userId, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (otpRecord.expiresAt < Date.now()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: "OTP has expired" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // OTP is valid, delete it
        await OTP.deleteOne({ _id: otpRecord._id });

        // Trust the device
        await TrustedDevice.findOneAndUpdate(
            { userId, deviceId },
            { userAgent: req.headers["user-agent"] },
            { upsert: true, new: true }
        );

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id, user.isAdmin),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};