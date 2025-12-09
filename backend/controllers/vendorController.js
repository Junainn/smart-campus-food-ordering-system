import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Vendor from '../models/Vendor.js';
import cloudinary from '../config/cloudinary.js';
import { validationResult } from 'express-validator';

// Get vendor menu items
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ vendorId: req.vendor._id }).sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add menu item
export const addMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, description, category, isAvailable } = req.body;

    let cloudinaryImageUrl = '';

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `cuet-food-app/menu-items/${req.vendor._id}`,
              transformation: [
                { width: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        cloudinaryImageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    const menuItem = await MenuItem.create({
      vendorId: req.vendor._id,
      name,
      price,
      description,
      category,
      isAvailable,
      cloudinaryImageUrl,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, isAvailable } = req.body;

    const menuItem = await MenuItem.findOne({ _id: id, vendorId: req.vendor._id });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Update fields
    if (name) menuItem.name = name;
    if (price !== undefined) menuItem.price = price;
    if (description !== undefined) menuItem.description = description;
    if (category) menuItem.category = category;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

    // Upload new image if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `cuet-food-app/menu-items/${req.vendor._id}`,
              transformation: [
                { width: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        menuItem.cloudinaryImageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    await menuItem.save();

    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findOneAndDelete({ _id: id, vendorId: req.vendor._id });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update vendor availability
export const updateAvailability = async (req, res) => {
  try {
    const { isOpen, openingHours, closingHours } = req.body;

    const vendor = await Vendor.findById(req.vendor._id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    if (isOpen !== undefined) vendor.isOpen = isOpen;
    if (openingHours) vendor.openingHours = openingHours;
    if (closingHours) vendor.closingHours = closingHours;

    await vendor.save();

    res.json({
      isOpen: vendor.isOpen,
      openingHours: vendor.openingHours,
      closingHours: vendor.closingHours,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vendor orders
export const getVendorOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ vendorId: req.vendor._id })
      .populate('studentId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ vendorId: req.vendor._id });

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

// Verify order (Accept/Reject)
export const verifyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;

    const order = await Order.findOne({ _id: id, vendorId: req.vendor._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order is not in pending status' });
    }

    if (action === 'accept') {
      order.status = 'Accepted';
    } else if (action === 'reject') {
      order.status = 'Rejected';
      order.rejectionReason = rejectionReason || 'Invalid transaction ID';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ _id: id, vendorId: req.vendor._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status transitions
    const validTransitions = {
      Accepted: ['Processing'],
      Processing: ['Ready'],
    };

    if (!validTransitions[order.status] || !validTransitions[order.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vendor reviews
export const getVendorReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ vendorId: req.vendor._id })
      .populate('studentId', 'name')
      .populate('orderId', 'createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ vendorId: req.vendor._id });

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

// Get vendor dashboard statistics
export const getVendorStats = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    // Get total orders
    const totalOrders = await Order.countDocuments({ vendorId });

    // Get pending orders
    const pendingOrders = await Order.countDocuments({ vendorId, status: 'Pending' });

    // Get completed orders
    const completedOrders = await Order.countDocuments({ vendorId, status: 'Completed' });

    // Get rejected orders
    const rejectedOrders = await Order.countDocuments({ vendorId, status: 'Rejected' });

    // Calculate total income from completed orders
    const incomeResult = await Order.aggregate([
      { $match: { vendorId: req.vendor._id, status: 'Completed' } },
      { $group: { _id: null, totalIncome: { $sum: '$totalPrice' } } }
    ]);
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;

    // Get menu items count
    const totalMenuItems = await MenuItem.countDocuments({ vendorId });
    const availableMenuItems = await MenuItem.countDocuments({ vendorId, isAvailable: true });

    // Get average rating
    const vendor = await Vendor.findById(vendorId);
    const averageRating = vendor.averageRating || 0;
    const totalReviews = vendor.reviewSummary.positive + vendor.reviewSummary.neutral + vendor.reviewSummary.negative;

    // Get recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = await Order.countDocuments({
      vendorId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get recent income (last 7 days)
    const recentIncomeResult = await Order.aggregate([
      {
        $match: {
          vendorId: req.vendor._id,
          status: 'Completed',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      { $group: { _id: null, recentIncome: { $sum: '$totalPrice' } } }
    ]);
    const recentIncome = recentIncomeResult.length > 0 ? recentIncomeResult[0].recentIncome : 0;

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      rejectedOrders,
      totalIncome,
      recentIncome,
      totalMenuItems,
      availableMenuItems,
      averageRating,
      totalReviews,
      recentOrders,
      reviewSummary: vendor.reviewSummary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
