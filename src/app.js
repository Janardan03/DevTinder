const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

// middleware to convert json data
app.use(express.json());
// middleware to read cookies
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB().then(() => {
    console.log("Database Connection Established!!!!");
    
    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
    
}).catch((err) => {
    console.log("Database cannot be connected!!!");
});