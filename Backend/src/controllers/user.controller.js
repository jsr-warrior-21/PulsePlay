import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";

// here we have made a method for the so that we can directly get access and refreshToken
const generateAccessandRefreshToken = async (userId) => {
  try {
    // here we have find user from db
    const user = await User.findById(userId);
    // for user we have generate accessToken and refreshToken
    const accessToken = user.generateAccessToken(); // ye function to maine model me jo banaya tha wo hai usko hi direct call krr diye hai
    const refreshToken = user.generateRefreshToken();
    // phir accessToken ko maine db me store kiya
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // phir usko user ko bhi return krr diya
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Failed in generating refreshToken or accessToken."
    );
  }
};

// ye jo maine async handler banaya hai wo ek call back leta hai as a argument.
const userRegister = asyncHandler(async (req, res) => {
  // taking information from frontend

  const { username, fullName, email, password } = req.body;
  console.log(fullName);
  console.log(password);

  //1. yaha prr maine sbb check krr liya ki koi field empty to nahi hai.
  if ([username, fullName, email, password].some((field) => !field?.trim())) {
    // At least one field is empty/null/whitespace
    throw new ApiError(400, "All fields required"); // here we have called ApiError which is wrapper
  }

  //2. check if user already exist.

  const userExisted = await User.findOne({
    $or: [{ username }, { email }], //  ye or krr krr ke username email dono ko check karega ki iss username or email ka koi user already exist to nahi krtaa
  });

  if (userExisted) {
    // dekh rahe ho kitna easy ho raha hai ApiError ka use krke Error ko throw krna nahi to res.status(409).json({success:false,message:"user already exist with this name and email"})
    throw new ApiError(422, "with this username and email user already exist.");
  }

  //3. handle the avatar and coverImage

  // ?. -> Prevents TypeError: Cannot read property 'avatar' of undefined crashes

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let coverImageLocalPath;
  if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  //   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  console.log(avatarLocalPath);
  console.log(coverImageLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required.");
  }

  //4. abb mujhe dono path mill gayi to mai abb cloudinary prr upload krr dunga.

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //5. again checking for avatar which is required.

  if (!avatar) {
    throw new ApiError(400, "Avatar file required.");
  }

  // 6. now agar cloudinary se file ka reponse aa gaya hai to object banao aur data base me entry maar do.
  // aur in files ka mai url store karwaunga db me

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // 7. check user created or not -> if created the entry must have and _id key
  // aur issi sath hum user ke password aur refreshToken ko select ki help se neglect krr denge so that wo na aa jaye reponse me

  const isUserCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!isUserCreated) {
    throw new ApiError(
      500,
      "Something went wrong during Registration of the user."
    );
  }

  //8. now all thing done then return ApiResponse here we will also use ApiResponse Wrapper

  return res
    .status(201)
    .json(new ApiResponse(200, isUserCreated, "Registration of user Done ."));
});

// user login

const loginUser = asyncHandler(async function (req, res) {
  const { username, email, password } = req.body;

  //1. checking if user have all field - you must think that mujhe email se login krwana hai ki email se.

  if (!email || !username) {
    throw new ApiError(400, "username or password require.");
  }
  //2. dono basis prr search krna jo pahle mill jaye in database
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  //3. now check user found in db or not

  if (!user) {
    throw new ApiError(400, "User not found. Please Sign in.");
  }

  //4. if user found then compare password using Bcrypt already we have made isPasswordCorrect function in userModel.
  // yaha prr hum apna user use krenge model ka nahi jo upper main paya hai
  const isPasswordValid = await user.isPasswordCorrect(password); // password is user password aur db ka pass function khud se nikal lega

  // if password not matched
  if (!isPasswordValid) {
    throw new ApiError(400, "password is incorrect.");
  }

  //5.get access and refreshToken

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  ); // yaha prr maine user se user._id ko pass krr diya

  /*

* . Access Token vs Refresh Token: Kaam Kya Hai?
In dono ka rishta ek "Entry Pass" aur ek "Master Key" jaisa hai:

Access Token (Entry Pass):

Ye short-lived hota hai (maan lo 15-30 minutes).

Iska kaam har API request ke saath jana hai (profile dekhna, video upload karna, etc.).

Iska lifetime chhota isliye rakha jata hai taaki agar koi ise chura bhi le, toh wo zyada der tak tumhara account access na kar sake.

Refresh Token (Master Key):

Ye long-lived hota hai (7 din, 15 din ya mahino tak).

Iska kaam API calls karna nahi hai. Iska sirf ek hi kaam hai: Jab Access Token expire ho jaye, toh naya Access Token maangna.

Ise user ko baar-baar login karne ki takleef se bachane ke liye use kiya jata hai.

2. Refresh Token ko User (Client) ke paas kyun rakhte hain?
User (Frontend/Browser) ke paas ise rakhna zaroori hai kyunki wahi toh naya token maangega.

Jab Access Token expire hota hai, toh Frontend background mein Refresh Token bhejta hai aur kehta hai: "Bhai, mera purana access token khatam ho gaya, ye lo refresh token aur mujhe ek naya access token dedo."

Agar user ke paas Refresh Token nahi hoga, toh usey har 15 minute baad phir se password daal kar login karna padega.

3. Refresh Token ko DB mein kyun save karte hain? (Sabse Important)
Yahi wo sawal hai jo tumhe confuse kar raha hai. JWT (tokens) toh stateless hote hain (unhe check karne ke liye DB ki zaroorat nahi honi chahiye), toh DB mein kyun save karein?

Iska sabse bada kaaran hai Control & Security:

Logout Feature: * Agar user logout karta hai, toh tum user ke browser se token delete kar doge. Lekin agar kisi hacker ne wo token pehle hi chura liya tha, toh wo toh expire hone tak access karta rahega.

DB mein rakhne se tum logout ke waqt DB se token delete kar sakte ho. Jab hacker wo token lekar aayega, tum DB mein check karoge aur paoge ki "Ye token toh maine blacklist/delete kar diya hai", aur tum usey access nahi doge.

Session Management:

Maan lo tumhare user ka phone chori ho gaya. User dusre phone se login karke "Logout from all devices" click karta hai.

DB mein tokens hone ki wajah se tum purane saare refresh tokens ko invalid (delete) kar sakte ho. Bina DB ke, tum purane tokens ko "deactivate" nahi kar paoge jab tak wo khud expire na ho jayein.

Security Monitoring:

Tum track kar sakte ho ki ek user ne kitne alag-alag devices se login kiya hua hai.
     */





  //6. now send in the cookie to the user

  //"Bhai, database se user ka data lao, lekin password aur wahan pehle se pada hua refreshToken mat laana
  //Taaki server ki memory mein (jo userLoggedIn variable hai) sensitive data na rahe. Ye ek safety layer hai.
  const userLoggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // Iske peeche Security aur Data Consistency ka logic hai.

  /**
     * httpOnly: true: Iska matlab client-side script (JavaScript) is cookie ko touch nahi kar sakti (XSS attack se bachata hai).

      secure: true: Ye sirf HTTPS connections par kaam karega.
     */

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: userLoggedIn, accessToken, refreshToken },
        "User LoggedIn succeccfully."
      )
    );
});



// user logout

const logOutUser = asyncHandler(async function(req,res){

  // jbb maine middleware me req.user = user kiya to abb req ke pass mera sbb kuchh aa gaya hai

 await User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{new:true});

 const options = {
  httpOnly:true,
  secure:true
 }

 return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json( new ApiResponse(200,"","User LoggedOut successfully."))


});



export { userRegister, loginUser,logOutUser };
