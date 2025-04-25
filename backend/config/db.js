import mongoose from "mongoose";

const connectDB = async () => {

    try {
        const coonection = await mongoose.connect(process.env.MONGODB_URL, {

            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 4000,
        });

        console.log(`✅ MongoDB Connected: ${coonection.connection.host}`);

    } catch (error) {
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }

};

export default connectDB;
