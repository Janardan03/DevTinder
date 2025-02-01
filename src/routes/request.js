const express = require("express");
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {

        const fromUserId = req.user;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)) {
            throw new Error("Invalid status type " + status);
        }

        const toUser = await User.findById(toUserId);
        if(!toUser) {
            throw new Error("User not found");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });

        if(existingConnectionRequest){
            throw new Error("Connection Request already exists!!!");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: "Connection request sent successfully",
            data: data,
        })

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;
        const {requestId, status} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Status not allowed!!!"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if(!connectionRequest) {
            throw new Error("Connection request not found");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message: "Connection Request " + status, data});

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = requestRouter;