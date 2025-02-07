const express = require("express");
const User = require("../model/user");
const { userAuth } = require("../middleware/auth");
const { connectionRequest } = require("../model/connectionRequest");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res, next) => {
    try {
        const fromUserId = req.user;
        const toUserId = req.params.toUserId;
        const status = req.params.status

        //check existing request
        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            throw new Error("Connection Request already exist")
        }

        //corner case
        const allowedStatus = ["interested", "ignored"];
        const isStatusAllowed = allowedStatus.includes(status);
        if (!isStatusAllowed) {
            throw new Error("Invalid status")
        }

        //corner case
        const isUserExist = await User.findById(toUserId);
        if (!isUserExist) {
            throw new Error("User not found")
        }

        const newConnectionRequest = new connectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await newConnectionRequest.save();
        res.status(200).json({ newConnectionRequest, message: `Connection Request sent successfully ${req.user.firstName} is ${status} in ${isUserExist.firstName} ` })
    } catch (error) {
        res.status(500).send("Error " + error.message)
    }
})

requestRouter.post("/request/receive/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        //check valid status
        const allowedStatus = ['accepted', 'rejected'];
        const isValidStatus = allowedStatus.includes(status);
        if (!isValidStatus) {
            return res.json({ message: `Invalid status : ${status} ` })
        }

        //check is toUserId is loggedInuserId
        //he  can recieve request only if status is interested
        //check requestid is valid
        let connectionrequest = await connectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });


        if (!connectionrequest) {
            return res.json({ message: `connectionrequest is not found for ${loggedInUser.firstName}` })
        }

        connectionrequest.status = status;
        await connectionrequest.save()

        return res.json({ message: `connection request is ${status}` })

    } catch (error) {
        res.status(500).send("Error " + error.message)

    }
})

module.exports = { requestRouter }