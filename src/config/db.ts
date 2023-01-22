import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);
mongoose.Schema.Types.String.cast(false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_ATLAS_URI!);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message || error || 'Unknown error'}`);
    process.exit(1);
  }
};

export default connectDB;
