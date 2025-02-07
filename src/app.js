const express = require("express");
const { connectDB } = require("./config/database.js")
// const { adminAUth, userAuth } = require("./middleware/auth.js")
var cookieParser = require('cookie-parser');
const {authRouter} = require("./routes/auth.js")
const {profileRouter} = require("./routes/profile.js")
const {requestRouter} = require("./routes/request.js")
const {userRouter} = require("./routes/user.js")
let cors = require('cors')
require("dotenv").config();

const app = express();

let corsOptions = {
    origin: 'http://localhost:5173',
    credentials:true
  }

app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)




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

