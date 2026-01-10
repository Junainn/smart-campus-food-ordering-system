import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Clock, 
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus as MinusIcon
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getVendorDetails, getVendorMenu, getVendorReviews } from '../../services/apiService';
import { 
  FoodCard, 
  EmptyState, 
  GridSkeleton,
  Badge as CustomBadge,
  StatusBadge 
} from '../../components/shared';
import { cn } from '../../utils/cn';
import toast, { Toaster } from 'react-hot-toast';

const VendorMenuPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, clearCart } = useCart();
  const [vendor, setVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, item: null });
  
  // Reviews state
  const [activeTab, setActiveTab] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [totalReviewsPages, setTotalReviewsPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [vendorId]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchReviews();
    }
  }, [activeTab, reviewsPage]);

  const fetchData = async () => {
    try {
      const [vendorRes, menuRes] = await Promise.all([
        getVendorDetails(vendorId),
        getVendorMenu(vendorId),
      ]);
      setVendor(vendorRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await getVendorReviews(vendorId, reviewsPage);
      setReviews(response.data.reviews);
      setTotalReviewsPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    
    const cartItem = {
      menuItemId: item._id,
      name: item.name,
      quantity: quantity,
      priceAtOrder: item.price,
    };

    const success = addToCart(vendorId, vendor.stallName, cartItem);

    if (!success) {
      // Different vendor - show confirmation
      setConfirmDialog({ open: true, item: cartItem });
    } else {
      toast.success('Added to cart!');
      setQuantities((prev) => ({ ...prev, [item._id]: 0 }));
    }
  };

  const handleConfirmSwitch = () => {
    clearCart();
    addToCart(vendorId, vendor.stallName, confirmDialog.item);
    toast.success('Cart cleared and item added');
    setConfirmDialog({ open: false, item: null });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-700 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <span className="font-heading font-bold text-xl text-gray-900">
                  {vendor?.stallName}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="relative flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline font-medium">Cart</span>
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Vendor Header */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-2">
            {vendor?.stallName}
          </h1>
          <p className="text-lg text-white/90 mb-4">
            {vendor?.description}
          </p>
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{vendor?.openingHours} - {vendor?.closingHours}</span>
            </div>
            {vendor?.reviewSummary?.total > 0 && (
              <div className="flex items-center gap-2">
                <Star size={20} className="fill-yellow-400 text-yellow-400" />
                <span>{vendor.reviewSummary.total} reviews</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 60,
                },
                '& .Mui-selected': {
                  color: '#FF3B30',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FF3B30',
                  height: 3,
                }
              }}
            >
              <Tab label={`Menu (${menuItems.length})`} />
              <Tab label={`Reviews (${vendor?.reviewSummary?.total || 0})`} />
            </Tabs>
          </Box>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Tab */}
        {activeTab === 0 && (
          <>
            {menuItems.length === 0 ? (
              <EmptyState 
                type="default"
                title="No menu items"
                message="This vendor hasn't added any items yet."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => {
                  const quantity = quantities[item._id] || 1;
                  return (
                    <div key={item._id} className="card overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Image */}
                      <div className="relative h-44 bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
                        {item.cloudinaryImageUrl ? (
                          <img
                            src={item.cloudinaryImageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <div className="text-5xl mb-1">🍔</div>
                              <p className="text-xs font-medium">No Image</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        {/* Category */}
                        {item.category && (
                          <span className="text-xs font-medium text-primary-500 uppercase tracking-wide">
                            {item.category}
                          </span>
                        )}

                        {/* Name */}
                        <h4 className="font-heading font-semibold text-base text-gray-900 line-clamp-1">
                          {item.name}
                        </h4>

                        {/* Description */}
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                            {item.description}
                          </p>
                        )}

                        {/* Price */}
                        <div className="font-heading font-bold text-xl text-primary-500">
                          ৳{item.price}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-2 py-1">
                            <button
                              onClick={() => handleQuantityChange(item._id, -1)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              disabled={quantity <= 1}
                            >
                              <MinusIcon size={16} />
                            </button>
                            <span className="font-semibold min-w-[2rem] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, 1)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <ShoppingCart size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 btn-primary text-sm py-2"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === 1 && (
          <div>
            {reviewsLoading ? (
              <GridSkeleton count={3} columns={1} />
            ) : reviews.length === 0 ? (
              <EmptyState 
                type="default"
                title="No reviews yet"
                message="Be the first to review this vendor after placing an order!"
              />
            ) : (
              <div className="space-y-6">
                {/* Review Stats */}
                {vendor?.reviewSummary && vendor.reviewSummary.total > 0 && (
                  <div className="card p-6 bg-gradient-to-br from-gray-50 to-white">
                    <h3 className="font-heading font-bold text-xl mb-6">Review Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-3">
                          <div>
                            <ThumbsUp size={32} />
                            <div className="font-bold text-xl mt-1">
                              {Math.round((vendor.reviewSummary.positive / vendor.reviewSummary.total) * 100)}%
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-green-600">Positive</div>
                        <div className="text-sm text-gray-600">{vendor.reviewSummary.positive} reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 text-gray-600 mb-3">
                          <div>
                            <MinusIcon size={32} />
                            <div className="font-bold text-xl mt-1">
                              {Math.round((vendor.reviewSummary.neutral / vendor.reviewSummary.total) * 100)}%
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-gray-600">Neutral</div>
                        <div className="text-sm text-gray-600">{vendor.reviewSummary.neutral} reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-600 mb-3">
                          <div>
                            <ThumbsDown size={32} />
                            <div className="font-bold text-xl mt-1">
                              {Math.round((vendor.reviewSummary.negative / vendor.reviewSummary.total) * 100)}%
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-red-600">Negative</div>
                        <div className="text-sm text-gray-600">{vendor.reviewSummary.negative} reviews</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {reviews.map((review) => (
                  <div key={review._id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {review.studentId?.name?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{review.studentId?.name || 'Anonymous'}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={cn(
                                    i < review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <CustomBadge 
                            variant={
                              review.sentiment === 'positive' ? 'success' :
                              review.sentiment === 'negative' ? 'error' :
                              'default'
                            }
                          >
                            {review.sentiment}
                          </CustomBadge>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm vendor switch dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ open: false, item: null })}
      >
        <DialogTitle>Switch Vendor?</DialogTitle>
        <DialogContent>
          <p className="text-gray-700">
            Your cart contains items from {cart.vendorName}. Switching to {vendor?.stallName} will
            clear your current cart. Continue?
          </p>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setConfirmDialog({ open: false, item: null })}>
            Cancel
          </MuiButton>
          <MuiButton onClick={handleConfirmSwitch} variant="contained" color="primary">
            Clear and Add
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VendorMenuPage;
