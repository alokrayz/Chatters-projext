import express from 'express';
import { userLogin, userLogout, userRegister } from '../controllers/userControllers.js';
import { upload } from '../middlewares/multer.js';


const router = express.Router();

router.route("/register").post(
    upload.fields([ 
        {            
            name: "profilepic",  // ye name frontend se aayga jo formdata m hoga
            maxCount: 1
        }
    ]),
    userRegister
);

router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);

export default router;