import { asyncHandler } from "../utils/asyncHandler.js";
// ye jo maine async handler banaya hai wo ek call back leta hai as a argument.
const userRegister = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});
export { userRegister };
