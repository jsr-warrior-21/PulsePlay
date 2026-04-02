import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
        username:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            unique:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            unique:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, // here we will use url of the cloudinary
            required:true
        },
        coverImage:{
            type:String,
        },
        // watchHistory will be an array because an user can see multiple videos
        watchHistory:[{
            type:mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }],
        password:{
            type:String,
            required:[true,"Password is required ."]
        },
        refreshToken:{
            type:String
        }

},{timestamps:true});

const User= mongoose.model("User",userSchema);
export {User};