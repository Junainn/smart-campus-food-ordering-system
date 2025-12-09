import express from 'express';
import {
  registerStudent,
  loginStudent,
  registerVendor,
  loginVendor,
  studentRegisterValidation,
  studentLoginValidation,
  vendorRegisterValidation,
  vendorLoginValidation,
} from '../controllers/authController.js';

const router = express.Router();

// Student routes
router.post('/student/register', studentRegisterValidation, registerStudent);
router.post('/student/login', studentLoginValidation, loginStudent);

// Vendor routes
router.post('/vendor/register', vendorRegisterValidation, registerVendor);
router.post('/vendor/login', vendorLoginValidation, loginVendor);

export default router;
