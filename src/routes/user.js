const express = require("express");
const User = require("../model/user");
const { userAuth } = require("../middleware/auth");
const { connectionRequest } = require("../model/connectionRequest");

const userRouter = express.Router();

const USER_ACCEPT_FIELDS = "firstName lastName gender age about skills photoUrl"


//to see all the pending request of loggedInUser
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectrequest = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_ACCEPT_FIELDS)
        const data = connectrequest.map((user) => user.fromUserId)
        res.json({ message: "connection requests sent successfully", data: data })

    } catch (error) {
        res.status(500).send("Error", error.message)

    }
})



userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_ACCEPT_FIELDS).populate("toUserId", USER_ACCEPT_FIELDS)
        if (connections.length === 0) {
            return res.json({ message: "no connections found" })
        }
        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({ message: "connection requests sent successfully", data: data })

    } catch (error) {
        res.status(500).send("Error", error.message)

    }
})


userRouter.get("/user/feed", userAuth, async (req, res) => {
    
    try {
        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        limit = limit>50? 50 :limit;
        const skip = (page-1) *limit;
        
        const loggedInUser = req.user;
        const connectrequest = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsers = new Set();
         connectrequest.map((req)=>{
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString())
        })
        console.log(hideUsers);

        const users = await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUsers)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).skip(skip).limit(limit)
        
        
        res.json({data:users})
    } catch (error) {
        res.status(500).send("Error", error.message)

    }
})


module.exports = { userRouter }