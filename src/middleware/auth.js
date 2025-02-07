const jwt = require("jsonwebtoken");
const User = require("../model/user.js")

// const adminAUth = (req,res,next)=>{
//     const token ="xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).send("Not AUthorized")
//     }
//     next();
// }

// const userAuth = (req,res,next)=>{
//     const token ="xyez";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).send("Not AUthorized") //how to pass error from one module to other module
//         // throw new Error("User Not AUthorized")
//     }else{
//         next();
//     }
// }


// module.exports = {adminAUth, userAuth}

const userAuth = async(req,res,next)=>{
   try {
    const {token} = req.cookies;
    if(!token){
        throw new Error("Token is not valid!!!")
    }
    const decoded = await jwt.verify(token,"DevTinder@18")
    const {_id} = decoded;;
    const user = await User.findById(_id);
    if(!user){
        res.status(400).send("User not found")
    }
    req.user = user;
    next();
   } catch (error) {
    res.status(500).send("Error" + error.message)
   }
    
}

module.exports ={userAuth}