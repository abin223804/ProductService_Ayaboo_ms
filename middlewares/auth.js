import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

const fetchAdminFromService = async (token) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/admin/getCurrentAdmin`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data?.admin || null;
  } catch (error) {
    console.error(
      "Error fetching admin from service:",
      error.response?.data || error.message
    );
    return null;
  }
};

const authenticateAdmin = async (req, res, next) => {
  let token =
    req.cookies["ad_b2b_tkn"] ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  console.log("Admin Token:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token.",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    req.admin = await fetchAdminFromService(token);

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, admin not found.",
      });
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed.",
      error: error.message,
    });
  }
};

const authenticateSeller = async (req, res, next) => {
  console.log("Seller authenticated");
  let token =
    req.cookies["sl_b2b_tkn"] ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_SELLER);
    req.seller = await Store.findById(decoded.userId).select("-password");

    if (!req.seller) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found.",
      });
    }

    if (req.seller.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Seller is blocked.",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed.",
      error: error.message,
    });
  }
};

const authenticateStore = async (req, res, next) => {
  console.log("Store authenticated");
  let token =
    req.cookies["st_b2b_tkn"] ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_STORE);
    req.store = await Store.findById(decoded.userId).select("-password");

    if (!req.store) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found.",
      });
    }

    if (req.store.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Store is blocked.",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed.",
      error: error.message,
    });
  }
};

export { authenticateAdmin, authenticateSeller, authenticateStore };
