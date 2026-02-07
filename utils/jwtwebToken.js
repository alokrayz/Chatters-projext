import jwt from "jsonwebtoken";

const jwtToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d"
    })
    // console.log("Generated JWT Token:", token);
    res.cookie("jwt", token, {
        maxage: 30*24*60*60*1000, // 30 days
        httpOnly: true,
        secure: process.env.SECURE !== "devlopment" // in production only https
    })
}

export default jwtToken;