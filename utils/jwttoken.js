const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTToken();

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE*24*60*60*60*1000),
        httpOnly: true,
        sameSite: "None",    // Important for cross-origin
        secure: true 
    };


 res.status(statusCode).cookie("token",token,options).json({
    success: true,
    user,
    token
 })
}




module.exports = sendToken;
