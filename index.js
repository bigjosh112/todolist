const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//mongodb://127.0.0.1:27017/todolist
const app = express();


// init mongoose
mongoose.connect(process.env.MONGO_URI);

const con = mongoose.connection;
con.on('open', error => {
    if(!error){
        console.log('DB connection successful');
    }else{
        console.log(`DB connection failed with error: ${error}`);
    }
});

app.use(express.json());

app.use('/create', require('./routes/create'));
app.use('/post', require('./routes/post'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))