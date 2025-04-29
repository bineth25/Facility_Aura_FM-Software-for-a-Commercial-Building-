export const errorLogger = (err, req, res, next) => {
    console.error('\x1b[31m%s\x1b[0m', '🔴 ERROR:', err);
    console.error('Request path:', req.path);
    console.error('Request body:', req.body);
    console.error('Stack trace:', err.stack);
    next(err);
  };
  
  export const errorResponder = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Define response based on the environment
    const response = {
      success: false,
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        errorCode: err.errorCode
      })
    };
    
    res.status(statusCode).json(response);
  };