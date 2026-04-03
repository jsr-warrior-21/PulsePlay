const asyncHandler = (fn) => {
    // 1. function jo hum RETURN kar rahe hain -> kyuki controller baki sbb hamesha function lete hai aagar maine isko as a function return nahi kiya to wo undefined rah jayenge
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message,
            });
        }
    };
};

export {asyncHandler};



/**
 * Aapka asyncHandler ek "Wrapper" function hai. Iska kaam sirf itna hai ki aapko baar-baar har controller mein try-catch na likhna pade.
 */