import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { promisify } from 'util';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

export const uploadImage = (req, res, next) => {
  if (!req.file) return next();
  const uploadPromise = promisify(cloudinary.uploader.upload_stream(
    { resource_type: 'image', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
    (error, result) => {
      if (error) return res.status(500).json({ error: 'Upload failed' });
      req.imageUrl = result.secure_url;
      next();
    }
  ));
  uploadPromise(req.file.buffer);
};

export default upload;