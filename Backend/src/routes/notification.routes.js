import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getNotifications);
router.route("/read/:notificationId").patch(markNotificationRead);
router.route("/read-all").patch(markAllNotificationsRead);

export default router;