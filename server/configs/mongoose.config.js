import mongoose from 'mongoose';

const mongooseConfig = async (CONNECTION_URL) => {
  try {
    await mongoose.connect(CONNECTION_URL);
    console.log('MongoDB connection established.');
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};

export default mongooseConfig;
