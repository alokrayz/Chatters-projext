import express from "express";  
import isLogin from "../middlewares/isLogin.js";
import { get } from "mongoose";
import { getcurrentChatters, getUserBySearch } from "../controllers/userHandler.js";

const router = express.Router();

router.get('/search', isLogin, getUserBySearch);
router.get('/currentchatters', isLogin, getcurrentChatters);

export default router;