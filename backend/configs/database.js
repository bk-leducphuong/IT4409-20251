import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB đã kết nối: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  }
};

// Xử lý khi ngắt kết nối
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB đã ngắt kết nối');
});

// Xử lý khi có lỗi sau khi kết nối
mongoose.connection.on('error', (err) => {
  console.error('❌ Lỗi MongoDB:', err);
});

// Đóng kết nối khi tắt ứng dụng (Ctrl+C)
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 Đã đóng kết nối MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi đóng kết nối:', err);
    process.exit(1);
  }
});

export default connectDB;