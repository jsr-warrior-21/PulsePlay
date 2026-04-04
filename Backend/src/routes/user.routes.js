import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logOutUser,
  refreshAccessToken,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  userRegister,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// register
router.route("/register").post(
  upload.fields([
    // so this is the way for using middleware before controller and after route
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegister
);
// http://localhost:8000/api/v1/users/register -> like this wo wala prefix ban jayega.

// login
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logOutUser); // yaha maine middleware ko insect krr diya before running the logoutuser functionality
// aur issi liye mai middleware me next() call krta hu so that verifyJWT function chalne ke baad logOutUser run ho.

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile); // kyuki isko hum params se le rahe hai
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
