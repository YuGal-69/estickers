import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadToCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    throw new Error("No file path provided to uploadToCloudinary");
  }

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image"
    });
    fs.unlinkSync(localFilePath); // clean up local file
    return result;
  } catch (error) {
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
    throw error;
  }
};

export default uploadToCloudinary;
