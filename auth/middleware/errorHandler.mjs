import ErrorResponse from "../models/ErrorResponseModel.mjs";

export const errorHandler = (err, req, res, next) => {
    let error = { ...err};

    error.message = err.message;

    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    };

    if (err.code === 11000) {
        const message = "Resource already exists";
        error = new ErrorResponse(message, 400);
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorResponse(`Information is missing: ${message}`, 400);
    };

    res.status(error.statusCode || 500).json({ success: false, statusCode: error.statusCode || 500, error: error.message || "Server Error" });
};