import {Router} from 'express';
import { userRegister } from '../controllers/user.controller.js';

const router = Router();


router.route("/register").post(userRegister);
// http://localhost:8000/api/v1/users/register -> like this wo wala prefix ban jayega.

export default router;