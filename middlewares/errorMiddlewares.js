const notFound = (req, res, next) =>{
    const error = new Error(`path not found = ${req.originalUrl}`);
    res.status(404)
    next(error)
}
const errorHandler = (err, req, res, next) =>{
    let resStatusCode  = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // validation error
    if (err.name === "ValidationError") {
        // menggabungkan antara error pertama dengan error selanjutnya dengan join() ,
        message = Object.values(err.errors)
            .map((item) => item.message)
            .join(',')
        // status = 404 bad request
        resStatusCode = 400
    }

    res.status(resStatusCode).json({
        message,
        stack: err.stack
    })
}


export {notFound, errorHandler};