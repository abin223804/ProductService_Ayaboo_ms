import axios from "axios";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import File from "../models/media.js";

//for ImageUpload
const getImageDimensions = async (filePath, mimetype) => {
  if (!mimetype.startsWith("image/")) return null;

  try {
    let imageBuffer;

    if (filePath.startsWith("http")) {
      const response = await axios.get(filePath, {
        responseType: "arraybuffer",
      });
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

const createMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const cookies = req.headers.authorization || "";

    console.log("Cookies:", cookies);
    

    const cookieParts = cookies.split("=");
    if (cookieParts.length < 2) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token format" });
    }

    const tokenPrefix = cookieParts[0];
    const token = cookieParts[1];

    let secretKey;
    let uploadedBy;

    if (tokenPrefix.startsWith("ad_b2b_tkn")) {
      secretKey = process.env.JWT_SECRET_ADMIN;
      uploadedBy = "admin";
    } else if (tokenPrefix.startsWith("sl_b2b_tkn")) {
      secretKey = process.env.JWT_SECRET_Seller;
      uploadedBy = "seller";
    } else if (tokenPrefix.startsWith("st_b2b_tkn")) {
      secretKey = process.env.JWT_SECRET_Store;
      uploadedBy = "store";
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized: Unknown token type" });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, secretKey);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

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
          uploadedBy,
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
    console.error("File upload error:", error);
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
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

const deleteAllMedia = async (req, res) => {
  try {
    const result = await File.deleteMany({});

    if (result.length === 0) {
      return res.status(404).json({ message: "No media files found" });
    }

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} files`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete media files",
      error: error.message,
    });
  }
};

const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.find({ userId:id });

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "Media file not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "Media file not found" });
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

const deleteMultipleMedia = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid array of media IDs",
      });
    }

    const result = await File.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No media files found with the provided IDs",
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} media file(s)`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete media files",
      error: error.message,
    });
  }
};


export default {
  createMedia,
  getAllMedia,
  getMediaById,
  deleteMediaById,
  deleteAllMedia,
  deleteMultipleMedia
};
