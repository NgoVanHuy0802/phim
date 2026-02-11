const mongoose = require('mongoose');

/**
 * Kết nối tới MongoDB bằng Mongoose.
 * - Sử dụng strictQuery để tránh query không rõ ràng.
 * - Tách hàm riêng để dễ test và tái sử dụng.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(mongoURI);
  // eslint-disable-next-line no-console
  console.log(`✅ MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
