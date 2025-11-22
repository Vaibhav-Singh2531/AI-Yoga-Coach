const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected`);

    // console.log(`✅ MongoDB URI: ${process.env.MONGODB_URI}`);
    // console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    // console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Handle connection events
// mongoose.connection.on('connected', () => {
//   console.log('🔗 Mongoose connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('❌ Mongoose connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('🔌 Mongoose disconnected from MongoDB');
// });

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during MongoDB disconnection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;
