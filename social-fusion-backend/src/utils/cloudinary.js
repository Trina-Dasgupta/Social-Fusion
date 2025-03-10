import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "uploads",
      format: "png",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image");
  }
};
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Deleted file from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("❌ Failed to delete file from Cloudinary:", error);
  }
};

export default cloudinary;

