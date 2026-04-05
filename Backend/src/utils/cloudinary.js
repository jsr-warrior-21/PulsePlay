import 'dotenv/config';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
    secure: true
});

// Writing upload handler function
const uploadOnCloudinary = async function (LocalFilePath) {
    try {
        if (!LocalFilePath) return null;

        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: "auto",

            transformation: [
                { quality: "auto", fetch_format: "auto" }
            ]
        });

        // File successfully upload ho gayi, ab local temp file delete karo
        if (fs.existsSync(LocalFilePath)) {
            fs.unlinkSync(LocalFilePath);
        }
        
        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // Error aane par bhi local file delete karo taaki server full na ho
        if (fs.existsSync(LocalFilePath)) {
            fs.unlinkSync(LocalFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary };