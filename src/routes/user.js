const express = require("express");
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "skills"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
}); 

userRouter.get("/user/connections", userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;

        const connectionRequests = ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "skills"])
          .populate("toUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "skills"]);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }

            return row.fromUserId;
        });

        res.json({data});

    } catch (err) {
        res.status(400).send("Error : ", err.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
   
    try {

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = (limit > 50) ? 50 : limit;

        const skip = (page-1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id},
            ],
        }).select("fromUserId toUserId");

        const hideFromUsers = new Set();
        connectionRequests.forEach((req) => {
            hideFromUsers.add(req.fromUserId.toString());
            hideFromUsers.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideFromUsers)}},
                {_id: {$ne: loggedInUser._id}},
            ]
        }).select(["firstName", "lastName", "photoUrl", "age", "gender", "skills"]).skip(skip).limit(limit);

        res.json({message: "users fetched successfully!!!", data: users,});

    } catch(err) {
        res.status(400).send("Error : ", err.message);
    }
});

module.exports = userRouter;