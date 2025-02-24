import Brand from '../models/brand.js';


//  const createBrand = async (req, res) => {
//   try {
//     const { name, logo, trademarkNumber, trademarkCertificate, certificateOwnerName, nonObjectiveDocument } = req.body;

    
//     if (!name || !logo || !trademarkNumber || !trademarkCertificate || !certificateOwnerName) {
//       return res.status(400).json({ success: false, message: 'All required fields must be provided' });
//     }

    
//     const existingBrand = await Brand.findOne({ trademarkNumber });
//     if (existingBrand) {
//       return res.status(400).json({ success: false, message: 'Trademark number already exists' });
//     }

    
//     const brand = new Brand({
//       name,
//       logo,
//       trademarkNumber,
//       trademarkCertificate,
//       certificateOwnerName,
//       nonObjectiveDocument, 
//     });

//     await brand.save();
//     res.status(201).json({ success: true, message: 'Brand created successfully', data: brand });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const createBrand = async (req, res) => {
//   try {
//     const { name, logo, trademarkNumber, trademarkCertificate, certificateOwnerName, nonObjectiveDocument } = req.body;

//     if (!name || !logo || !trademarkNumber || !trademarkCertificate || !certificateOwnerName) {
//       return res.status(400).json({ success: false, message: 'All required fields must be provided' });
//     }

//     const cookies = req.headers.authorization || "";
//     const cookieParts = cookies.split("=");

//     if (cookieParts.length < 2) {
//       return res.status(401).json({ message: "Unauthorized: Invalid token format" });
//     }

//     const tokenPrefix = cookieParts[0];
//     const token = cookieParts[1];

//     let secretKey;
//     let createdBy;

//     if (tokenPrefix.startsWith("ad_b2b_tkn")) {
//       secretKey = process.env.JWT_SECRET_ADMIN;
//       createdBy = "admin";
//     } else if (tokenPrefix.startsWith("sl_b2b_tkn")) {
//       secretKey = process.env.JWT_SECRET_SELLER;
//       createdBy = "seller";
//     } else if (tokenPrefix.startsWith("st_b2b_tkn")) {
//       secretKey = process.env.JWT_SECRET_STORE;
//       createdBy = "store";
//     } else {
//       return res.status(401).json({ message: "Unauthorized: Unknown token type" });
//     }

//     let userId;
//     try {
//       const decoded = jwt.verify(token, secretKey);
//       userId = decoded.userId;
//     } catch (err) {
//       return res.status(401).json({ message: "Unauthorized: Invalid token" });
//     }

//     const existingBrand = await Brand.findOne({ trademarkNumber });
//     if (existingBrand) {
//       return res.status(400).json({ success: false, message: 'Trademark number already exists' });
//     }

//     const brand = new Brand({
//       name,
//       logo,
//       trademarkNumber,
//       trademarkCertificate,
//       certificateOwnerName,
//       nonObjectiveDocument,
//       createdBy,
//       userId
//     });

//     await brand.save();
//     res.status(201).json({ success: true, message: 'Brand created successfully', data: brand });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const createBrand = async (req, res) => {
  try {
    const { name, logo, trademarkNumber, trademarkCertificate, certificateOwnerName, nonObjectiveDocument } = req.body;

    if (!name || !logo || !trademarkNumber || !trademarkCertificate || !certificateOwnerName) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const authHeader = req.headers.authorization || "";
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const token = parts[1];
    let secretKey;
    let createdBy;

    if (authHeader.startsWith("ad_b2b_tkn")) {
      secretKey = process.env.JWT_SECRET_ADMIN;
      createdBy = "admin";
    } else if (authHeader.startsWith("sl_b2b_tkn")) {
      secretKey = process.env.JWT_SECRET_SELLER;
      createdBy = "seller";
    } else if (authHeader.startsWith("st_b2b_tkn")) {
      secretKey = process.env.JWT_SECRET_STORE;
      createdBy = "store";
    } else {
      return res.status(401).json({ message: "Unauthorized: Unknown token type" });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, secretKey);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const existingBrand = await Brand.findOne({ trademarkNumber });
    if (existingBrand) {
      return res.status(400).json({ success: false, message: "Trademark number already exists" });
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
    res.status(201).json({ success: true, message: "Brand created successfully", data: brand });

  } catch (error) {
    console.error("Creating brand error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//update with sorting


//  const getAllBrands = async (req, res) => {
//     try {
//       const brands = await Brand.find({ isDeleted: false });
  
//       res.status(200).json({
//         success: true,
//         total: brands.length,
//         data: brands,
//       });
  
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };
  
// const getAllBrands = async (req, res) => {
//   try {
//     const { status } = req.body;

//     let filter = { isDeleted: false };
    
//     if (status && ["pending", "rejected", "approved"].includes(status)) {
//       filter.status = status;
//     }

//     const brands = await Brand.find(filter);

//     res.status(200).json({
//       success: true,
//       total: brands.length,
//       data: brands,
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

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
      const { name, logo, trademarkNumber, trademarkCertificate, certificateOwnerName, nonObjectiveDocument } = req.body;
  
      const brand = await Brand.findById(req.params.id);
  
      if (!brand || brand.isDeleted) {
        return res.status(404).json({ success: false, message: 'Brand not found or has been deleted' });
      }
  
      
      if (name) brand.name = name;
      if (logo) brand.logo = logo;
      if (trademarkNumber) brand.trademarkNumber = trademarkNumber;
      if (trademarkCertificate) brand.trademarkCertificate = trademarkCertificate;
      if (certificateOwnerName) brand.certificateOwnerName = certificateOwnerName;
      if (nonObjectiveDocument) brand.nonObjectiveDocument = nonObjectiveDocument;
  
      await brand.save();
      res.status(200).json({ success: true, message: 'Brand updated successfully', data: brand });
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

   const softDeleteBrand = async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
  
      if (!brand || brand.isDeleted) {
        return res.status(404).json({ success: false, message: 'Brand not found or already deleted' });
      }
  
      brand.isDeleted = true;
      await brand.save();
  
      res.status(200).json({ success: true, message: 'Brand soft deleted successfully', data:brand  });
  
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
        return res.status(404).json({ success: false, message: 'Brand not found' });
      }
  
      await Brand.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ success: true, message: 'Brand permanently deleted' });
  
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
}