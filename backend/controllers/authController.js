import Student from '../models/Student.js';
import Vendor from '../models/Vendor.js';
import { generateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

// Student Registration
export const registerStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists with this email' });
    }

    // Extract department code and admission year from email
    const emailMatch = email.match(/^u(\d{2})(0[1-9]|1[0-3])(\d{2,3})@student\.cuet\.ac\.bd$/);
    if (!emailMatch) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const admissionYear = emailMatch[1];
    const departmentCode = emailMatch[2];

    // Validate department code (01-13)
    const deptNum = parseInt(departmentCode, 10);
    if (deptNum < 1 || deptNum > 13) {
      return res.status(400).json({ message: 'Invalid department code. Must be between 01-13' });
    }

    // Create student
    const student = await Student.create({
      name,
      email,
      password,
      phone,
      departmentCode,
      admissionYear,
    });

    // Generate token
    const token = generateToken(student._id, 'student');

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      role: 'student',
      token,
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Student Login
export const loginStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find student and include password
    const student = await Student.findOne({ email }).select('+password');

    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(student._id, 'student');

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      role: 'student',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Vendor Registration
export const registerVendor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, stallName, description, phone } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor already exists with this email' });
    }

    // Create vendor
    const vendor = await Vendor.create({
      email,
      password,
      stallName,
      description,
      phone,
    });

    // Generate token
    const token = generateToken(vendor._id, 'vendor');

    res.status(201).json({
      _id: vendor._id,
      email: vendor.email,
      stallName: vendor.stallName,
      description: vendor.description,
      phone: vendor.phone,
      role: 'vendor',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Vendor Login
export const loginVendor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find vendor and include password
    const vendor = await Vendor.findOne({ email }).select('+password');

    if (!vendor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await vendor.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(vendor._id, 'vendor');

    res.json({
      _id: vendor._id,
      email: vendor.email,
      stallName: vendor.stallName,
      description: vendor.description,
      phone: vendor.phone,
      isOpen: vendor.isOpen,
      openingHours: vendor.openingHours,
      closingHours: vendor.closingHours,
      role: 'vendor',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Validation rules
export const studentRegisterValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .matches(/^u(21|22|23|24|25|26|27|28|29)(0[1-9]|1[0-3])\d{2,3}@student\.cuet\.ac\.bd$/)
    .withMessage('Must be a valid CUET student email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
];

export const studentLoginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const vendorRegisterValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('stallName').trim().notEmpty().withMessage('Stall name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
];

export const vendorLoginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
