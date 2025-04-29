export const checkRequiredEnvVars = () => {
    const requiredVars = [
      'MONGODB_URL',
      'JWT_SECRET',
      'EMAIL_USER',
      'EMAIL_PASS'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
      console.error('\x1b[31m%s\x1b[0m', '❌ ENVIRONMENT ERROR:', errorMessage);
      console.error('Please check your .env file and ensure all required variables are defined.');
      
      // Don't exit in development to allow continued testing
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        console.warn('\x1b[33m%s\x1b[0m', '⚠️ Running in development mode with missing variables');
      }
    }
  };