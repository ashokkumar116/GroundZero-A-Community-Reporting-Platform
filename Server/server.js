const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const requestRoutes = require('./routes/requestRoutes');
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_APP_URL,
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use("/api/reports",reportRoutes);
app.use("/api/request",requestRoutes);
app.use("/api/admin",adminRoutes)

const PORT = process.env.PORT || 8080;


app.listen(PORT,()=>{
    console.log(`✅ Server is running on port ${PORT}`);
    connectDB();
})