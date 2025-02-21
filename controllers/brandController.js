import Brand from '../models/brand.js';


 const createBrand = async (req, res) => {
  try {
    const { name, logo, trademarkNumber, trademarkCertificate, certificateOwnerName, nonObjectiveDocument } = req.body;

    
    if (!name || !logo || !trademarkNumber || !trademarkCertificate || !certificateOwnerName) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    
    const existingBrand = await Brand.findOne({ trademarkNumber });
    if (existingBrand) {
      return res.status(400).json({ success: false, message: 'Trademark number already exists' });
    }

    
    const brand = new Brand({
      name,
      logo,
      trademarkNumber,
      trademarkCertificate,
      certificateOwnerName,
      nonObjectiveDocument, 
    });

    await brand.save();
    res.status(201).json({ success: true, message: 'Brand created successfully', data: brand });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



 const getAllBrands = async (req, res) => {
    try {
      const brands = await Brand.find({ isDeleted: false });
  
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