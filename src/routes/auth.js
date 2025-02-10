const express = require("express");
const { validateSignup } = require("../helper/validate");
const bycrypt = require("bcrypt");
const User = require("../model/user.js");




const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
    // console.log(req.body); //{}
    const { firstName, lastName, emailId, password, age,gender,about, photoUrl } = req.body

    try {
        validateSignup(req);

        const encryptedPassword = await bycrypt.hash(password, 10);


        const existingUser = await User.findOne({ emailId: emailId });
        const existingPassword = await User.findOne({ password: password });
        if (existingUser) {
            throw new Error("email already exists")
        }
        if (existingPassword) {
            throw new Error("Try creating different password")
        }
        else {
            const user = new User({
                firstName,
                lastName,
                emailId,
                password: encryptedPassword,
                age,
                gender,
                about,
                photoUrl
            });
            await user.save();
            res.send("user added successfully")
        }

    } catch (error) {
        
        res.status(500).send("Something went wrong" + error.message)
    }

})

authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credentials")
        }
        const passwordExists = await user.validatePassword(password)
        if (passwordExists) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 900000), httpOnly:true})
            res.json({ok:true, message:"login successful", data:user})
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).json({ok:false, message:error.message})
    }
})

authRouter.post('/logout',(req,res,next)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    .json({ok:true, message:"logout successful"})
})



module.exports = {authRouter};