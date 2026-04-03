import 'dotenv/config';
import {v2 as  cloudinary } from 'cloudinary';
import fs from 'fs'

// configuration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRECT
})



// writing upload handler function

const uploadOnCloudinary = async function (path){
        try {
            if(!path) return null;
          const response =   await cloudinary.uploader.upload('path',{
            resource_type:"auto"
          });
          console.log('file uploaded on cloudinary successFully.',response.url);
          return response;
        } catch (error) {
            fs.unlinkSync(path) // unlink the file which is locally uploaded on my sytem if upload operation got failed.
            return null;
        }
}

export{uploadOnCloudinary};