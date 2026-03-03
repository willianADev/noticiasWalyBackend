import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CONFIG_CLOUDINARY } from '../config/env';

cloudinary.config({
  cloud_name: CONFIG_CLOUDINARY.cloud_name,
  api_key: CONFIG_CLOUDINARY.api_key,
  api_secret: CONFIG_CLOUDINARY.api_secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'noticias-waly',
      format: 'webp',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      transformation: [{ width: 800, height: 600, crop: 'limit' }]
    };
  },
});

export const cargarImagen = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB por imagen
  }
});