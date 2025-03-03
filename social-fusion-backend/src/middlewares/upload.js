import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    format: async () => "png", 
    public_id: (req, file) => `profile_${Date.now()}`,
  },
});

const upload = multer({ storage });

export default upload;
