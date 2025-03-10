import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

// ✅ Create Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads', // ✅ Store in 'uploads' folder
      // format: async () => 'png', // ✅ Convert to PNG
      public_id: `${file.fieldname}_${Date.now()}`,
      transformation: [{ width: 500, height: 500, crop: 'limit' }], // ✅ Resize/Crop settings
    };
  },
});

// ✅ File Type Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.match(/(jpg|jpeg|png|webp)$/)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed."), false);
  }
};


// ✅ File Size Limit (5MB)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// ✅ Single Upload Middleware
export const uploadSingle = (fieldName) =>
  (req, res, next) => {
    const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single(fieldName);
    
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle Multer errors
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        // Handle unknown errors
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };


// ✅ Multiple Upload Middleware (Max 5 Files)
export const uploadMultiple = (fieldName) =>
  (req, res, next) => {
    const upload = multer({ storage, fileFilter, limits }).array(fieldName, 5);
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
