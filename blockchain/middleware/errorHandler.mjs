export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Try again, you may have made a mistake.'

    res.status(err.statusCode).json({ success: false, error: err.message })

    next()
}

export default errorHandler