const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_APP_URL,
    credentials:true
}));
app.use(express.json());

app.use('/api/auth',authRoutes)

const PORT = process.env.PORT || 8080;


app.listen(PORT,()=>{
    console.log(`✅ Server is running on port ${PORT}`);
    connectDB();
})