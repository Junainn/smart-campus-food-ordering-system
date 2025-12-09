import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Vendor from '../models/Vendor.js';

// Protect student routes
export const protectStudent = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Students only.' });
      }

      req.student = await Student.findById(decoded.id).select('-password');

      if (!req.student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Protect vendor routes
export const protectVendor = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'vendor') {
        return res.status(403).json({ message: 'Access denied. Vendors only.' });
      }

      req.vendor = await Vendor.findById(decoded.id).select('-password');

      if (!req.vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Generate JWT token
export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};
