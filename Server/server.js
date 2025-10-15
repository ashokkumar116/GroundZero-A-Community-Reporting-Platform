const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_APP_URL,
    credentials:true
}));
app.use(express.json());

const PORT = process.env.PORT || 8080;


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})