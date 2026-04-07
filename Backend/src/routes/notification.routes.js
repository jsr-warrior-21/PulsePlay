import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getNotifications);
router.route("/read/:notificationId").patch(markNotificationRead);
router.route("/read-all").patch(markAllNotificationsRead);
router.route("/:notificationId").delete(deleteNotification);  

export default router;