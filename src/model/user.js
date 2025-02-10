const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength:5,
        maxLength:10
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is not valid")
            }
        }
    },
    password: {
        type: String,
        required:true,
        // validate(value){
        //     const hasSpecialCharacter = /[!@#$%&*]/.test(value);
        //     const hasOneDigit = /\d/.test(value);
        //     const hasUpperCase = /[A-Z]/.test(value);
        //     const hasLowerCase = /[a-z]/.test(value);
        //     const minLength = value.length>=8;
        //     if(!hasSpecialCharacter || !hasOneDigit || !hasUpperCase || !hasLowerCase || !minLength){
        //         throw new Error("password criteria is not met")
        //     }
        // }
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Try creating strong password")
            }
        }
    },
    age: {
        type: Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female", "others"].includes(value)){
                throw new Error("Invalid gender")
            }
        }
    },
    photoUrl: {
        type: String,
        default:"https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("url is not valid")
            }
        }
    },
    about: {
        type: String,
        // validate(value){
        //     if(/[$#%]/.test(value)){
        //         throw new Error("No special characters are allowed")
        //     }
        // }
    },
    skills: {
        type: [String]
    }

},{
    timestamps:true
})

userSchema.methods.getJWT =async function(){
    const user = this;
    const token =  await jwt.sign({ _id: user._id }, "DevTinder@18", {expiresIn:"7d"})
    if(token){
        return token;
    }
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    if(isPasswordValid){
        return isPasswordValid
    }
}

module.exports = mongoose.model("User", userSchema);