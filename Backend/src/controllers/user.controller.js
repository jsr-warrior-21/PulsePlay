import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/apiError.js'
import {User} from '../models/users.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { upload } from "../middlewares/multer.middleware.js";
// ye jo maine async handler banaya hai wo ek call back leta hai as a argument.
const userRegister = asyncHandler(async (req, res) => {
  // taking information from frontend

  const { username, fullName, email, password } = req.body;
  console.log(fullName);
  console.log(password);

  //1. yaha prr maine sbb check krr liya ki koi field empty to nahi hai.
  if ([username, fullName, email, password].some((field) => !field?.trim())) {
    // At least one field is empty/null/whitespace
    throw new ApiError(400,"All fields required" ); // here we have called ApiError which is wrapper
  }


  //2. check if user already exist.

  const userExisted = User.findOne({
    $or:[{username},{email}] //  ye or krr krr ke username email dono ko check karega ki iss username or email ka koi user already exist to nahi krtaa
  });

  if(userExisted){
    // dekh rahe ho kitna easy ho raha hai ApiError ka use krke Error ko throw krna nahi to res.status(409).json({success:false,message:"user already exist with this name and email"})
    throw new ApiError(422,"with this username and email user already exist.")
  }


  //3. handle the avatar and coverImage



  // ?. -> Prevents TypeError: Cannot read property 'avatar' of undefined crashes

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file reuired.")
    }

    //4. abb mujhe dono path mill gayi to mai abb cloudinary prr upload krr dunga.

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    //5. again checking for avatar which is required.

    if(!avatar){
        throw new ApiError(400,"Avatar file required.")
    }
    
    // 6. now agar cloudinary se file ka reponse aa gaya hai to object banao aur data base me entry maar do.
    // aur in files ka mai url store karwaunga db me

    const user  = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    });

    // 7. check user created or not -> if created the entry must have and _id key 
   // aur issi sath hum user ke password aur refreshToken ko select ki help se neglect krr denge so that wo na aa jaye reponse me 

    const isUserCreated  = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!isUserCreated){
        throw new ApiError(500,"Something went wrong during Registration of the user.")
    }



    //8. now all thing done then return ApiResponse here we will also use ApiResponse Wrapper

    return res.status(201).json(
        new ApiResponse(200,isUserCreated,"Registration of user Done .")
    )


});
export { userRegister };
