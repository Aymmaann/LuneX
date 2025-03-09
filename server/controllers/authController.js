import UserModel from "../models/userModel.js";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { oauth2client } from "../utils/googleConfig.js";

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    
    // const userRes = await axios.get(
    //   `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    // );
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
      {
        headers: {
          Authorization: `Bearer ${googleRes.tokens.access_token}`,
        },
      }
    );
    
    const { name, email, picture } = userRes.data;
    
    console.log("Looking for user with email:", email);
    let user = await UserModel.findOne(email);
    
    if (!user) {
      console.log("User not found, creating new user");
      user = await UserModel.create({
        name,
        email,
        image: picture
      });
      console.log("Created user:", user);
    } else {
      console.log("Found existing user:", user);
    }
    
    // Log the user ID to verify it's numeric
    console.log("User ID for token:", user.id, "Type:", typeof user.id);
    
    // Ensure ID is numeric for the token
    const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
    
    const token = jwt.sign(
      { id: userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT }
    );
    
    return res.status(200).json({
      message: 'Success',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        image: user.image
      }
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export { googleLogin };