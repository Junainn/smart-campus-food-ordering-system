import express from 'express';
import { protectVendor } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
  getVendorOrders,
  verifyOrder,
  updateOrderStatus,
  getVendorReviews,
  getVendorStats,
} from '../controllers/vendorController.js';
import { body } from 'express-validator';

const router = express.Router();

// All routes require vendor authentication
router.use(protectVendor);

// Dashboard stats
router.get('/stats', getVendorStats);

// Menu routes
router.get('/menu', getMenuItems);
router.post(
  '/menu',
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Item name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  addMenuItem
);
router.patch('/menu/:id', upload.single('image'), updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Availability routes
router.patch('/availability', updateAvailability);

// Order routes
router.get('/orders', getVendorOrders);
router.patch(
  '/orders/:id/verify',
  [body('action').isIn(['accept', 'reject']).withMessage('Action must be accept or reject')],
  verifyOrder
);
router.patch(
  '/orders/:id/status',
  [
    body('status')
      .isIn(['Processing', 'Ready'])
      .withMessage('Status must be Processing or Ready'),
  ],
  updateOrderStatus
);

// Review routes
router.get('/reviews', getVendorReviews);

export default router;
