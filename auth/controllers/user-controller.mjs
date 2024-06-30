import User from "../models/UserModel.mjs";
import ErrorResponse from "../models/ErrorResponseModel.mjs";
import { asyncHandler } from "../middleware/asyncHandler.mjs";

// @desc    Register a new user
// @route   POST /api/v1/users
// @access  Public
export const createUser = asyncHandler (async ( req, res, next ) => {
    const user = await User.create(req.body);

    res.status(201).json({ success: true, statusCode: 201, data: user});
});

// @desc   Get a single user
// @route  GET /api/v1/users/:id
// @access PRIVATE (Admin)
export const getUser = asyncHandler (async ( req, res, next ) => {
    const user = await User.findById(req.params.id);

    if (!user) next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));

    res.status(200).json({ success: true, statusCode: 200, data: user});
});

// @desc   Get all users
// @route  GET /api/v1/users
// @access PRIVATE (Admin)
export const getUsers = asyncHandler (async ( req, res, next ) => {
    const users = await User.find();

    res.status(200).json({ success: true, statusCode: 200, numberOfUsers: users.length, data: users });
});

// @desc   Update user
// @route  PUT /api/v1/users/:id
// @access PRIVATE (Admin)
export const updateUser = asyncHandler (async ( req, res, next ) => {
    await User.findByIdAndUpdate (req.params.id, req.body, {
        runValidators: true,
    });
    
    res.status(204).send();
});

// @desc   Delete user
// @route  DELETE /api/v1/users/:id
// @access PRIVATE (Admin)
export const deleteUser = asyncHandler (async ( req, res, next ) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).send();
});

