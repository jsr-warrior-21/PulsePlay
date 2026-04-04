import mongoose from "mongoose";
const likeSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tweet",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectIdm,
      ref: "User",
    },
  },
  { timestamps: true }
);

const likeModel = mongoose.model("likeModel", likeSchema);
export { likeModel };
