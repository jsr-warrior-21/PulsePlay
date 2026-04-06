import { Notification } from "../models/notification.model.js";

export const createNotification = async ({
  userId,      
  fromUserId,   
  type,         
  videoId = null,
  commentId = null
}) => {
  // Avoid sending notification to self
  if (userId.toString() === fromUserId.toString()) return;

  await Notification.create({
    user: userId,
    fromUser: fromUserId,
    type,
    video: videoId,
    comment: commentId,
    isRead: false
  });
};