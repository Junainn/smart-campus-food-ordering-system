import Vendor from '../models/Vendor.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { analyzeSentimentWithRetry } from '../utils/sentimentAnalysis.js';
import { validationResult } from 'express-validator';

// Helper function to check if vendor is currently open
const isVendorOpen = (vendor) => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return vendor.isOpen && currentTime >= vendor.openingHours && currentTime <= vendor.closingHours;
};

// Get available vendors
export const getAvailableVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');

    // Filter vendors that are currently open
    const availableVendors = vendors.filter((vendor) => isVendorOpen(vendor));

    res.json(availableVendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vendor details
export const getVendorDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vendor menu
export const getVendorMenu = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const menuItems = await MenuItem.find({
      vendorId,
      isAvailable: true,
    }).sort({ category: 1, name: 1 });

    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Place order
export const placeOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { vendorId, items, totalPrice, transactionId } = req.body;

    // Validate vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Validate menu items exist
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds }, vendorId });

    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: 'Some menu items are invalid' });
    }

    // Create order
    const order = await Order.create({
      studentId: req.student._id,
      vendorId,
      items,
      totalPrice,
      transactionId,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('vendorId', 'stallName phone')
      .populate('studentId', 'name email phone');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student orders
export const getStudentOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ studentId: req.student._id })
      .populate('vendorId', 'stallName phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ studentId: req.student._id });

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resubmit transaction ID
export const resubmitTransactionId = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    const order = await Order.findOne({ _id: id, studentId: req.student._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Rejected') {
      return res.status(400).json({ message: 'Can only resubmit for rejected orders' });
    }

    order.transactionId = transactionId;
    order.status = 'Pending';
    order.rejectionReason = undefined;

    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, studentId: req.student._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only cancel pending orders' });
    }

    await order.deleteOne();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark order as completed (received)
export const completeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, studentId: req.student._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Ready') {
      return res.status(400).json({ message: 'Order must be ready to mark as completed' });
    }

    order.status = 'Completed';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit review with sentiment analysis
export const submitReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, rating, comment } = req.body;

    // Validate order exists and belongs to student
    const order = await Order.findOne({ _id: orderId, studentId: req.student._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only review completed orders' });
    }

    if (order.isReviewed) {
      return res.status(400).json({ message: 'Order already reviewed' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already submitted for this order' });
    }

    // Analyze sentiment with retry
    console.log('📝 [Submit Review] Starting sentiment analysis for comment:', comment);
    const sentiment = await analyzeSentimentWithRetry(comment);
    console.log('📝 [Submit Review] Sentiment analysis result:', sentiment);

    // Create review
    const review = await Review.create({
      orderId,
      studentId: req.student._id,
      vendorId: order.vendorId,
      rating,
      comment,
      sentiment,
    });
    
    console.log('✅ [Submit Review] Review created with sentiment:', review.sentiment);

    // Update order
    order.isReviewed = true;
    await order.save();

    // Update vendor review summary only if sentiment was successfully analyzed
    if (sentiment !== 'pending') {
      await Vendor.findByIdAndUpdate(order.vendorId, {
        $inc: {
          [`reviewSummary.${sentiment}`]: 1,
          'reviewSummary.total': 1,
        },
      });
    }

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vendor reviews (for students to see)
export const getVendorReviewsForStudent = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ vendorId, sentiment: { $ne: 'pending' } })
      .populate('studentId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ vendorId, sentiment: { $ne: 'pending' } });

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
