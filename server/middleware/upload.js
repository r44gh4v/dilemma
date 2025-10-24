import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';

const getCloudinary = () => {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
  return cloudinary;
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
};

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter
});

export const uploadImage = (req, res, next) => {
  if (!req.file) return next();
  
  const cloud = getCloudinary();
  
  const uploadStream = cloud.uploader.upload_stream(
    { 
      resource_type: 'image', 
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
      format: 'webp',
      quality: 'auto'
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