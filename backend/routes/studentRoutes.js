import express from 'express';
import { protectStudent } from '../middleware/auth.js';
import {
  getAvailableVendors,
  getVendorDetails,
  getVendorMenu,
  placeOrder,
  getStudentOrders,
  resubmitTransactionId,
  cancelOrder,
  completeOrder,
  submitReview,
  getVendorReviewsForStudent,
} from '../controllers/studentController.js';
import { body } from 'express-validator';

const router = express.Router();

// All routes require student authentication
router.use(protectStudent);

// Vendor routes
router.get('/vendors', getAvailableVendors);
router.get('/vendors/:id', getVendorDetails);
router.get('/menu/:vendorId', getVendorMenu);
router.get('/vendors/:vendorId/reviews', getVendorReviewsForStudent);

// Order routes
router.post(
  '/orders',
  [
    body('vendorId').notEmpty().withMessage('Vendor ID is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('totalPrice').isNumeric().withMessage('Total price must be a number'),
    body('transactionId').trim().notEmpty().withMessage('Transaction ID is required'),
  ],
  placeOrder
);
router.get('/orders', getStudentOrders);
router.patch(
  '/orders/:id/resubmit',
  [body('transactionId').trim().notEmpty().withMessage('Transaction ID is required')],
  resubmitTransactionId
);
router.delete('/orders/:id', cancelOrder);
router.patch('/orders/:id/complete', completeOrder);

// Review routes
router.post(
  '/reviews',
  [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  submitReview
);

export default router;
