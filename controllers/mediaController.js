import axios from "axios";
import sharp from "sharp";
import  File  from "../models/media.js";

//for ImageUpload
const getImageDimensions = async (filePath, mimetype) => {
  if (!mimetype.startsWith("image/")) return null;

  try {
    let imageBuffer;

    if (filePath.startsWith("http")) {
      const response = await axios.get(filePath, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(response.data);  
    } else {
      imageBuffer = await sharp(filePath).toBuffer();
    }

    const metadata = await sharp(imageBuffer).metadata();

    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.error("Error extracting image dimensions:", error);
    return null;  
  }
};

//for ImageUpload

const getCurrentUser = async (token) => {
  try {
    const response = await axios.get("http://localhost:4000/user_api/user/getCurrentuser", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      return response.data.user._id; 
    } else {
      throw new Error("User retrieval failed");
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw new Error("Failed to get userId");
  }
};


const createMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

   
    let token = req.cookies["us_b2b_tkn"] || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const userId = await getCurrentUser(token);

    const { category } = req.body;

    const savedFiles = await Promise.all(
      req.files.map(async (file) => {
        const dimensions = await getImageDimensions(file.path, file.mimetype);

        return {
          name: file.originalname,
          size: file.size,
          format: file.mimetype,
          category,
          imageurl: file.path, 
          width: dimensions?.width || null,
          height: dimensions?.height || null,
          uploadedBy: "user",
          userId,
        };
      })
    );


    await File.insertMany(savedFiles);

    res.status(200).json({
      message: "Files uploaded successfully!",
      files: savedFiles,
    });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
};


const getAllMedia = async (req, res) => {
    try {
      const files = await File.find(); 
  
      if (files.length === 0) {
        return res.status(404).json({ message: "No media files found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Media files retrieved successfully",
        files,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve media files",
        error: error.message,
      });
    }
  };


  const getMediaById = async (req, res) => {
    try {
      const { id } = req.params; 
      const file = await File.findById(id); 
  
      if (!file) {
        return res.status(404).json({ success: false, message: "Media file not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Media file retrieved successfully",
        file,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve media file",
        error: error.message,
      });
    }
  };



  
  const deleteMediaById = async (req, res) => {
    try {
      const { id } = req.params; 
      const file = await File.findByIdAndDelete(id); 
  
      if (!file) {
        return res.status(404).json({ success: false, message: "Media file not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Media file deleted successfully",
       
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete media file",
        error: error.message,
      });
    }
  };



export default {
  createMedia,
  getAllMedia ,
  getMediaById ,
  deleteMediaById
  
};
