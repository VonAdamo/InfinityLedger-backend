import User from "../models/UserModel.mjs";
import ErrorResponse from "../models/ErrorResponseModel.mjs";
import {asyncHandler} from "../middleware/asyncHandler.mjs";

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = asyncHandler(async( req, res, next ) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    createAndSendToken(user, 201, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = asyncHandler(async( req, res, next ) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    createAndSendToken(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  PRIVATE
export const getMe = asyncHandler(async( req, res, next ) => {

});

// @desc    Update user details
// @route   PUT /api/v1/auth/updateuser
// @access  PRIVATE
export const updateUserDetails = asyncHandler(async( req, res, next ) => {

});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  PRIVATE
export const updatePassword = asyncHandler(async( req, res, next ) => {

});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  PUBLIC
export const forgotPassword = asyncHandler(async( req, res, next ) => {

});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:token
// @access  PUBLIC
export const resetPassword = asyncHandler(async( req, res, next ) => {

});

export const createAndSendToken = (user, statusCode, res) => {
    const token = user.generateToken();

    res.status(statusCode).json({ success: true, statusCode, token });
};