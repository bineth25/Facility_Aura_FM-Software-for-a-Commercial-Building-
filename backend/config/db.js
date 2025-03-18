import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 4000, // Timeout after 4 seconds
    });

    // Log success message once the connection is established
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    // Log error if the connection fails
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit the process if connection fails
  }
};

// Export the connectDB function to use it in server.js
export default connectDB;
