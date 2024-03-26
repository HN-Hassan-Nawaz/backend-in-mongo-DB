import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

//cloudinary config b/c it alow the user to upload files to loca server to the cloudinary etc...
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file path on clodinary
        const response = await cloudinary.uploader.upload
            (localFilePath, {
                resource_type: "auto"
            })
        console.log("file is uploaded on cloudinary", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // it is used to delete a file from the local server's file system.
        return null;
    }
}

export {uploadOnCloudinary}