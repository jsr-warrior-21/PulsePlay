import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { // the user who receives the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromUser: { // the user who triggered it (liked, commented, subscribed)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { // type of notification
      type: String,
      enum: ["like", "comment", "subscription"],
      required: true,
    },
    video: { // optional, only for like/comment
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: { // optional, only for comment
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export { Notification };