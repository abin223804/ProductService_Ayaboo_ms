import Brand from '../models/brand.js';


export const createBrand = async (req, res) => {
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
