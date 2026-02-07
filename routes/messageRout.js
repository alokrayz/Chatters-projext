import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import isLogin from "../middlewares/isLogin.js";


const router = express.Router();

router.post('/send/:id',isLogin,sendMessage)

export default router;