import mongoose from "mongoose";
const tweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
        type: String, 
        default: ""
    }
  },
  { timestamps: true }
);
tweetSchema.index({ content: "text" });
const tweetModel = mongoose.model("tweetModel", tweetSchema);
export { tweetModel };
