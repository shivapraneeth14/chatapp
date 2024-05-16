import jwt from "jsonwebtoken";
import User from "../Models/User.model.js";

const verifyjwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
        if (!token) {
            return res.status(400).json({ message: "JWT: No token found" });
        }
        console.log(" jwt Token:", token);
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("Decoded Token:", decodedToken);
            const user = await User.findById(decodedToken?._id).select("-password");
            if (!user) {
                return res.status(400).json({ message: "JWT: User not found" });
            }
            req.user = user;
            next();
        } catch (verificationError) {
            console.error("JWT Verification Error:", verificationError);
            return res.status(400).json({ message: "JWT: Invalid token" });
        }
        console.log("jwt Verification completed")
    } catch (error) {
        console.error("JWT Middleware Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default verifyjwt;
