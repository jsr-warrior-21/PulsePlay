import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;

    } catch (error) {
        console.error("Cloudinary Error:", error.message);
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (err) {
                console.log("Cleanup failed, but app won't crash now");
            }
        }
        return null;
    }
};

const deleteFromCloudinary = async (publicId, resourceType = "video") => {
    try {
        if (!publicId) return null;
        
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        console.error("Cloudinary Delete Error:", error.message);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };