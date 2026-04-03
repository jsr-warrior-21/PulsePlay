const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};
export {asyncHandler};



/**
 * Aapka asyncHandler ek "Wrapper" function hai. Iska kaam sirf itna hai ki aapko baar-baar har controller mein try-catch na likhna pade.
 */