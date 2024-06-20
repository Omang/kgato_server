const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnect = require('./config/dbconnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;


const router = require('./routes/Authroutes');


const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors({
 
 credentials: true,
 origin: "http://localhost:3000/"

}));

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`server running at ${PORT}`);
});





