const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validate");
const bcrypt = require("bcrypt");

const app = express();

// middleware to convert json data
app.use(express.json());

app.post("/signup", async (req, res) => {

    try{

        // you can also validate all this in schema
        validateSignUpData(req);
        const {firstName, lastName, emailId, password} = req.body;

        // now encrypt your paswords
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        });

        await user.save();
        res.send("user added successfully");

    } catch(err) {
        res.status(400).send("Error saving the user : " + err.message);
    }
});

app.post("/login", async (req, res) => {

    try {

        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid) {
            res.send("User logged in successfully");
        } else {
            throw new Error("Invalid credentials");
        }

    } catch(err) {
        res.status(400).send("Error : " + err.message);
    }
})

app.get("/user", async (req, res) => {
    
    const userEmail = req.body.emailId;
    
    try {
        const users = await User.find({emailId: userEmail});
        if(users.length === 0) {
            res.status(404).send("User Not Found");
        } else {
            res.send(users);    
        }
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);    
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});

app.delete("/user", async (req, res) => {

    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(402).send("Something went wrong");
    }
})

app.patch("/user", async (req, res) => {

    const data = req.body;
    const userId = req.body.userId;

    try {

        const ALLOWED_UPDATES = ["userID", "photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }

        if(data.skills.length > 10) {
            throw new Error("skills more than 10 not allowed");
        }

        await User.findByIdAndUpdate(userId, data, {
            runValidators: true,
        });
        res.send("user updated successfully");

    } catch (err) {
        res.status(402).send("Something went wrong");
    }
})


connectDB().then(() => {
    console.log("Database Connection Established!!!!");
    
    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
    
}).catch((err) => {
    console.log("Database cannot be connected!!!");
});