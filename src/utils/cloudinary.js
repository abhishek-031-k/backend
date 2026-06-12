
import dotenv from "dotenv";
import { v2 as cloudinary} from "cloudinary";
import fs, { unlink } from "fs"

dotenv.config({
    path: "./.env"
});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadonCloudinary = async (localFilePath)=>{
    try{
     if(!localFilePath)return null
  const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
     })
   fs.unlinkSync(localFilePath)
   console.log(response);
     return response
     
    }catch(error){
   fs.unlinkSync(localFilePath)
   return null
    }
}

export {uploadonCloudinary}