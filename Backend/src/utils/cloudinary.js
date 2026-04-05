import 'dotenv/config';
import {v2 as  cloudinary } from 'cloudinary';
import fs, { unlink } from 'fs'

// configuration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRECT,
    secure: true
})



// writing upload handler function

const uploadOnCloudinary = async function (LocalFilePath){
        try {
            if(!LocalFilePath) return null;
          const response =   await cloudinary.uploader.upload(LocalFilePath,{
            resource_type:"auto"
          });
          // console.log('file uploaded on cloudinary successFully.',response.url);
          fs.unlinkSync(LocalFilePath);
          return response;
        } catch (error) {
            fs.unlinkSync(LocalFilePath) // unlink the file which is locally uploaded on my sytem if upload operation got failed.
            return null;
        }
}

export{uploadOnCloudinary};