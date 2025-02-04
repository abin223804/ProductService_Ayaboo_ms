import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "media_uploads", 
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "mp4", "avi", "mov"], 
    resource_type: "auto",
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
    "video/avi",
    "video/quicktime",
  ];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only images, PDFs, and videos are allowed."), false);
  }
  cb(null, true);
};

export const mediaUpload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, 
  fileFilter: fileFilter,
}).array("files", 10); 
