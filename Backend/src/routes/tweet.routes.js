import { Router } from 'express';
import {upload} from '../middlewares/multer.middleware.js'
import { deleteTweetImage } from "../controllers/tweet.controller.js";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/").post(
    upload.single("image"), 
    createTweet
);

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);
router.route("/remove-image/:tweetId").patch(deleteTweetImage);

export default router