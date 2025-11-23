const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./lib/db');
const authRoute = require('./routes/auth-route.js');
const dashboardRoute = require("./routes/dashboard-route.js")
const angleRoute = require("./routes/angle-route.js");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser()); // 👈 ADD THIS LINE
app.use(cors({
  origin: [
    "http://localhost:8080",   // your frontend
    "https://typebot.io"       // TypeBot client requests
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Routes
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});
app.use("/api/auth", authRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/angle", angleRoute);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DeepLearning Project Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  connectDB();
});

module.exports = app;
