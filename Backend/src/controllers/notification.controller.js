import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Get notifications for logged-in user
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ user: userId })
    .populate("fromUser", "username fullName avatar")
    .populate("video", "title thumbnail")
    .populate("comment", "content")
    .sort({ createdAt: -1 });

  const unreadCount = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  return res.status(200).json(
    new ApiResponse(200, { notifications, unreadCount }, "Notifications fetched successfully")
  );
});

// Mark notification as read
const markNotificationRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  await Notification.findByIdAndUpdate(notificationId, { isRead: true });

  return res
    .status(200)
    .json({ success: true, message: "Notification marked as read" });
});

// Mark all notifications as read
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });

  return res
    .status(200)
    .json({ success: true, message: "All notifications marked as read" });
});

export { getNotifications, markNotificationRead, markAllNotificationsRead };