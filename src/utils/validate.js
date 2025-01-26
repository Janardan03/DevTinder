const validator = require("validator");

const validateSignUpData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name cant be empty");
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Enter valid email id");
    }
}

module.exports = validateSignUpData;