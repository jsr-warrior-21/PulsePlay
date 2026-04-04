import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // here we will use url of the cloudinary
      required: true,
    },
    coverImage: {
      type: String,
    },
    // watchHistory will be an array because an user can see multiple videos
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required ."],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// hashing of the pass - before saving the model
// i have used if condition so that hashing of passing may not happen again and again happened only when any king of changes occur in the password.

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return ;
  try {
    this.password = await bcrypt.hash(this.password, 10);
    // next();
  } catch (error) {
   throw error;
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Wrong Password.");
  }
};

// here jwt handling -- like mano ki sabhi data hamare db me store hai unke upper operation krr rahe hai

//generating access token
userSchema.methods.generateAccessToken = function () {
  const AccessToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return AccessToken;
};

// generating refresh token
userSchema.methods.generateRefreshToken = function () {
  const AccessToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return AccessToken;
};

const User = mongoose.model("User", userSchema);
export { User };
