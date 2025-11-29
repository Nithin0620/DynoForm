import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dynoform';

export const connectDatabase = async () => {
  try {
    // console.log(MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});


