import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const { DB_HOST } = process.env;
    await mongoose.connect(DB_HOST);
    console.log('✅ Mongo connection successfully established!');
  } catch (error) {
    console.error('❌ Mongo connection failed:', error);
    process.exit(1);
  }
};
