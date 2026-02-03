import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB connection failed:', error);
    }
}

export default dbConnect;