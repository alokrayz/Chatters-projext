import User from "../Models/userModels.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwtToken from "../utils/jwtwebToken.js";


export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password } = req.body;


    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "Username or Email already exists",
      });
    }

    const profilepicLocalPath = req.files?.profilepic?.[0]?.path;
    // console.log("Profile Pic Path:", profilepicLocalPath);

    if (!profilepicLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const profilepic = await uploadOnCloudinary(profilepicLocalPath);

    if (!profilepic?.url) {
      return res.status(500).json({
        success: false,
        message: "Error uploading profile picture",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      username,
      email,
      gender,
      password: hashedPassword,
      profilepic: profilepic.url,
    });

    await newUser.save();
    jwtToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      profilepic: newUser.profilepic,
    });

  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        jwtToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            message: "Login successful"
        });
    } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
    }
};

export const userLogout = async (req, res) => {
    try {
        
        res.cookie("jwt", " ",{
            maxAge: 0
        })
        
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
    console.log("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
    }
};
