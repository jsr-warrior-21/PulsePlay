import {Router} from 'express';
import { loginUser, logOutUser, userRegister } from '../controllers/user.controller.js';

import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// register
router.route("/register").post(
    upload.fields([ // so this is the way for using middleware before controller and after route
     {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),
userRegister
);
// http://localhost:8000/api/v1/users/register -> like this wo wala prefix ban jayega.


// login
router.route('/login').post(loginUser);

// secured routes 
router.route('/logout').post(verifyJWT,logOutUser); // yaha maine middleware ko insect krr diya before running the logoutuser functionality
// aur issi liye mai middleware me next() call krta hu so that verifyJWT function chalne ke baad logOutUser run ho.

export default router;