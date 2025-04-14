const asyncHandler = fn => (req, res, next) =>{
    // next itu maksudnya untuk melanjutkan pesan error ke Express Async Handler
    // promise akan mengembaikan fn(req, res, next) jika berhasil / resolved
    // sebaliknya, promise akan mengembalikan catch(next) ketika error
    Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler