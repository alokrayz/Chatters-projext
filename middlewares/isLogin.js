import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

 const isLogin = async (req, res, next) => {
    try {
        // console.log(req.headers.cookie);
        const token = req.cookies.jwt;
        // console.log("Middleware token:", token);
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("isLogin Middleware Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export default isLogin;