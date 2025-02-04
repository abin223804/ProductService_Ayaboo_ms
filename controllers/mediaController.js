import  File  from "../models/media.js";

const createMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { category } = req.body;

    const savedFiles = req.files.map((file) => ({
      name:file.originalname,
      size:file.size,
      format: file.mimetype,
      category,
      imageurl: file.path, 
    }));

    await File.insertMany(savedFiles);

    res.status(200).json({
      message: "Files uploaded successfully!",
      files: savedFiles,
    });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
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
      const { id } = req.params; // Get ID from URL params
      const file = await File.findById(id); // Fetch file by ID
  
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
