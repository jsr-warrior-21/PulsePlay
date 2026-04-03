import {Router} from 'express';
import { userRegister } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js'

const router = Router();


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

export default router;