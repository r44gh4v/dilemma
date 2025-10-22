import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { promisify } from 'util';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
};

// Configure multer with file size limit and file filter
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

export const uploadImage = (req, res, next) => {
  if (!req.file) return next();
  
  const uploadStream = cloudinary.uploader.upload_stream(
    { 
      resource_type: 'image', 
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
      format: 'webp', // Convert to webp for better compression
      quality: 'auto' // Optimize quality
    },
    (error, result) => {
      if (error) {
        return next(new Error('Image upload failed: ' + error.message));
      }
      req.imageUrl = result.secure_url;
      next();
    }
  );
  
  uploadStream.end(req.file.buffer);
};

export default upload;