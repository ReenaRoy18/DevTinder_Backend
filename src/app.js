const express = require("express");
const { connectDB } = require("./config/database.js")
// const { adminAUth, userAuth } = require("./middleware/auth.js")
var cookieParser = require('cookie-parser');
const {authRouter} = require("./routes/auth.js")
const {profileRouter} = require("./routes/profile.js")
const {requestRouter} = require("./routes/request.js")
const {userRouter} = require("./routes/user.js")
const {rateLimit} = require("express-rate-limit") //rate-limit
let cors = require('cors')
require("dotenv").config();

const app = express();

let corsOptions = {
    origin: 'http://localhost:5173',
    credentials:true
  }

const limiter = rateLimit({  //rate-limit
    windowMs:60*1000, //how much min 
    max:5, //how many requests need to limit
    message:"Too many requests not allowed", //if too many requests show err message
    headers:true
})



app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))

app.use(limiter) //It is used to limit the repeated requests
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter)





const PORT = process.env.PORT
connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log("server listening to port", PORT);

        })
    }).catch((err) => {
        console.log("error connecting to database", err.message);
    })

