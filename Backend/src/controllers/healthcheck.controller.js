import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'

const healthcheck = asyncHandler(async (req, res) => {
    // Ek simple OK status return karna hai message ke saath
    return res
        .status(200)
        .json(
            new ApiResponse(200, { status: "OK" }, "Healthcheck passed: System is working fine")
        )
})

export {
    healthcheck
}