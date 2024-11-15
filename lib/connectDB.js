import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'ide_db' });
    return 'Connected to MongoDB database successfully';
  } catch (error) {
    return `Error connecting to MongoDB database: ${error}`;
  }
};

export default connectDB;