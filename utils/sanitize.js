// mongoSanitizeMiddleware.js

const mongoSanitize = (req, res, next) => {
    // Function to sanitize an object (recursively)
    const sanitize = (obj) => {
        for (let key in obj) {
            // Check if the key starts with '$' or contains '.' (MongoDB operators)
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key]; // Remove the key
            } else if (typeof obj[key] === 'object') {
                sanitize(obj[key]); // Recursively sanitize nested objects
            }
        }
    };

    // Sanitize the request body, query, and params
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    // Proceed to the next middleware or route handler
    next();
};

export default mongoSanitize;
