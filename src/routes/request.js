const express = require("express");
const {userAuth} = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {

    const user = req.user;
    res.send(user.firstName + " sent the connection request");
});

module.exports = requestRouter;