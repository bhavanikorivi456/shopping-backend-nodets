import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinaryConfig";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "products", // Cloudinary folder
      format: async (req: Express.Request, file: Express.Multer.File) => "png", // File format
      public_id: (req: Express.Request, file: Express.Multer.File) => file.originalname, // Public ID
    } as Record<string, any>, // Type assertion for params
  });

const upload = multer({ storage });

export default upload;
