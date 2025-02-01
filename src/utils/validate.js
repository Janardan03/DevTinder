const validator = require("validator");

const validateSignUpData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name cant be empty");
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Enter valid email id");
    }
}

const validateEditProfileData = (req) => {

    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {validateSignUpData, validateEditProfileData};