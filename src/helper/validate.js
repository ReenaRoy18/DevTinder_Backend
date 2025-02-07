const validator = require("validator")

const validateSignup = (req) => {
    console.log(req.body);
    const { firstName, lastName, emailId, password } = req.body;
    console.log(firstName.length);


    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    } else if (firstName.length < 4 || firstName.length > 15) {
        throw new Error("min 4 and max 15")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Try creating strong password")
    }

}

const ValidateEditProfile = (req, res, next) => {
    console.log((req.body));

    const { firstName, lastName, emailId, age, gender, photoUrl, about, skills } = req.body;
    if (firstName || lastName || emailId) {
        console.log("enter condition");
        
        if (!firstName || !lastName) {
            throw new Error("Name is not valid");
        } else if (firstName.length < 5 || firstName.length > 15) {
            throw new Error("min 5 and max is 15")
        } else if (!validator.isEmail(emailId)) {
            throw new Error("Invalid mailid")
        }
    }

    const allowedEditProfile = ["firstName", "lastName", "emailId", "age", "gender", "photoUrl", "about", "skills"];

    const isEditProfile = Object.keys(req.body).every(field => allowedEditProfile.includes(field));

    return isEditProfile

}

module.exports = { validateSignup, ValidateEditProfile };