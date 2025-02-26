import Brand from "../models/brand.js";
import jwt from "jsonwebtoken";

const createBrand = async (req, res) => {
  try {
    const {
      name,
      logo,
      trademarkNumber,
      trademarkCertificate,
      certificateOwnerName,
      nonObjectiveDocument,
    } = req.body;

    if (
      !name ||
      !logo ||
      !trademarkNumber ||
      !trademarkCertificate ||
      !certificateOwnerName
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided",
        });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          message: "Unauthorized: Missing or invalid Authorization header",
        });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    let userId;
    let createdBy;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      createdBy = "Admin";
    } catch (err) {
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_SELLER);
        createdBy = "Seller";
      } catch (err) {
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET_STORE);
          createdBy = "Store";
        } catch (err) {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        }
      }
    }

    userId = decoded.userId;

    const existingBrand = await Brand.findOne({ trademarkNumber });
    if (existingBrand) {
      return res
        .status(400)
        .json({ success: false, message: "Trademark number already exists" });
    }

    const brand = new Brand({
      name,
      logo,
      trademarkNumber,
      trademarkCertificate,
      certificateOwnerName,
      nonObjectiveDocument,
      createdBy,
      userId,
    });

    await brand.save();
    return res
      .status(201)
      .json({
        success: true,
        message: "Brand created successfully",
        data: brand,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const { status } = req.body;

    let filter = { isDeleted: false };

    if (status && ["pending", "rejected", "approved"].includes(status)) {
      filter.status = status;
    }

    const brands = await Brand.find(filter);

    res.status(200).json({
      success: true,
      total: brands.length,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const {
      name,
      logo,
      trademarkNumber,
      trademarkCertificate,
      certificateOwnerName,
      nonObjectiveDocument,
    } = req.body;

    const brand = await Brand.findById(req.params.id);

    if (!brand || brand.isDeleted) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Brand not found or has been deleted",
        });
    }

    if (name) brand.name = name;
    if (logo) brand.logo = logo;
    if (trademarkNumber) brand.trademarkNumber = trademarkNumber;
    if (trademarkCertificate) brand.trademarkCertificate = trademarkCertificate;
    if (certificateOwnerName) brand.certificateOwnerName = certificateOwnerName;
    if (nonObjectiveDocument) brand.nonObjectiveDocument = nonObjectiveDocument;

    await brand.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Brand updated successfully",
        data: brand,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const softDeleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand || brand.isDeleted) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Brand not found or already deleted",
        });
    }

    brand.isDeleted = true;
    await brand.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Brand soft deleted successfully",
        data: brand,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const hardDeleteAllBrands = async (req, res) => {
  try {
    const result = await Brand.deleteMany({});

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} brands permanently.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const hardDeleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    await Brand.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Brand permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBrandStatus = async (req, res) => {
  try {
    const token = req.cookies?.ad_b2b_tkn;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: Admin token is missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    } catch (error) {
      return res.status(403).json({ success: false, message: "Invalid or expired admin token" });
    }

  

    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use "approved" or "rejected".' });
    }

    const brand = await Brand.findById(req.params.id);

    if (!brand || brand.isDeleted) {
      return res.status(404).json({ success: false, message: "Brand not found or has been deleted" });
    }

    brand.status = status;
    await brand.save();

    res.status(200).json({
      success: true,
      message: `Brand has been ${status}.`,
      data: brand,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export default {
  createBrand,
  getAllBrands,
  updateBrand,
  softDeleteBrand,
  hardDeleteAllBrands,
  hardDeleteBrand,
  updateBrandStatus,
};
