const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const { ValidateEditProfile } = require("../helper/validate.js");
const bcrypt = require("bcrypt")
const User = require("../model/user.js")



const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);

        res.status(200).json({ message: user })
    } catch (error) {
        res.status(500).send("Error " + error.message)
    }
})

profileRouter.patch("/profile", userAuth, async (req, res) => {
    try {
        ValidateEditProfile(req);
        const loggedInUser = req.user;
        console.log("loggedInUser", loggedInUser);

        if (!loggedInUser) {
            throw new Error("user not found")
        }
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        console.log("loggedInUser2", loggedInUser);

        await loggedInUser.save();
        res.send("updated successfully")
    } catch (error) {
        res.status(500).send("Error " + error.message)

    }

})

profileRouter.patch("/forgotPassword", userAuth, async (req, res, next) => {
    try {
        const existingPasssword = req.body.password;
        const newPassword = req.body.currentPassword;
        const user = req.user;
        // const isEmailExist = await User.findOne({emailId:user.emailId});
        // if(!isEmailExist){
        //     throw new Error("Invalid credentials")
        // }
        const isExist = await user.validatePassword(existingPasssword)
        if (!isExist) {
            throw new Error("password is not valid")
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        await user.save();
        res.send("password updated successfully")
    } catch (error) {
        res.status(500).send("Error " + error.message)
    }
})


module.exports = { profileRouter }