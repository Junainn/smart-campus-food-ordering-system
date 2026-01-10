import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material';
import {
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  ArrowUpDown,
  X,
  CheckCircle,
  Package,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudentOrders,
  resubmitTransactionId,
  cancelOrder,
  completeOrder,
  submitReview,
} from '../../services/apiService';
import { 
  StatusBadge, 
  EmptyState, 
  LoadingSkeleton,
} from '../../components/shared';
import { cn } from '../../utils/cn';
import toast, { Toaster } from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewDialog, setReviewDialog] = useState({ open: false, orderId: null });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [retryDialog, setRetryDialog] = useState({ open: false, orderId: null });
  const [newTransactionId, setNewTransactionId] = useState('');
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000); // Poll every 20 seconds
    return () => clearInterval(interval);
  }, [page]);

  const fetchOrders = async () => {
    try {
      const response = await getStudentOrders(page);
      setOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to cancel order');
    }
  };

  const handleRetryTransaction = async () => {
    if (!newTransactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }
    try {
      await resubmitTransactionId(retryDialog.orderId, newTransactionId);
      setRetryDialog({ open: false, orderId: null });
      setNewTransactionId('');
      toast.success('Transaction ID resubmitted');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to resubmit transaction ID');
    }
  };

  const handleMarkReceived = async (orderId) => {
    try {
      await completeOrder(orderId);
      setReviewDialog({ open: true, orderId });
      toast.success('Order marked as received');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to mark order as received');
    }
  };

  const handleSubmitReview = async () => {
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      toast.error('Please provide a rating between 1 and 5');
      return;
    }
    try {
      await submitReview({
        orderId: reviewDialog.orderId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setReviewDialog({ open: false, orderId: null });
      setReviewData({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'warning',
      Rejected: 'error',
      Accepted: 'info',
      Processing: 'primary',
      Ready: 'success',
      Completed: 'success',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
            </div>
            <button
              onClick={fetchOrders}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh orders"
            >
              <RefreshCw className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Order History</h2>
          <p className="text-white/90">Track your orders and submit reviews</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton count={3} height={200} />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No orders yet"
            description="Start ordering from your favorite vendors!"
            action={{
              label: "Browse Vendors",
              onClick: () => navigate('/dashboard')
            }}
          />
        ) : (
          <>
            {/* Filter, Sort, and Search Controls */}
            <div className="card p-6 mb-6">
              <div className="flex flex-wrap gap-4">
                {/* Status Filter */}
                <div className="min-w-[180px]">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Filter className="w-4 h-4" />
                    Status Filter
                  </label>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full"
                  >
                    <MenuItem value="All">All Orders</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Accepted">Accepted</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Ready">Ready</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="min-w-[180px]">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort By
                  </label>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full"
                  >
                    <MenuItem value="date-desc">Date: Newest First</MenuItem>
                    <MenuItem value="date-asc">Date: Oldest First</MenuItem>
                    <MenuItem value="amount-desc">Amount: High to Low</MenuItem>
                    <MenuItem value="amount-asc">Amount: Low to High</MenuItem>
                  </Select>
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[250px]">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by vendor name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              // Calculate filtered and sorted orders
              const filteredOrders = (orders || [])
                .filter((order) => statusFilter === 'All' || order.status === statusFilter)
                .filter(
                  (order) =>
                    searchQuery === '' ||
                    order.vendorId?.stallName?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort((a, b) => {
                  if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
                  if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
                  if (sortBy === 'amount-desc') return b.totalPrice - a.totalPrice;
                  if (sortBy === 'amount-asc') return a.totalPrice - b.totalPrice;
                  return 0;
                });

              if (filteredOrders.length === 0) {
                return (
                  <EmptyState
                    icon="🔍"
                    title="No orders match your filters"
                    description="Try adjusting your search or filter criteria"
                  />
                );
              }

              return (
                <>
                  <div className="space-y-4 mb-8">
                    {filteredOrders.map((order) => (
                      <div key={order._id} className="card overflow-hidden">
                        {/* Top gradient bar */}
                        <div className="h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                        
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {order.vendorId?.stallName || 'Vendor'}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Order ID: {order._id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>

                          {/* Items */}
                          <div className="mb-4 space-y-1">
                            {order.items.map((item, idx) => (
                              <p key={idx} className="text-sm text-gray-600">
                                • {item.name} × {item.quantity} - ৳{item.priceAtOrder * item.quantity}
                              </p>
                            ))}
                          </div>

                          <div className="border-t border-gray-200 my-4"></div>

                          {/* Transaction ID */}
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-600">Transaction ID:</span>
                            <span className="text-sm font-semibold font-mono text-gray-900">
                              {order.transactionId}
                            </span>
                          </div>

                          {/* Total */}
                          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Total Amount</span>
                              <span className="text-2xl font-bold text-primary-600">
                                ৳{order.totalPrice}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {order.status === 'Pending' && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Cancel Order
                              </button>
                            )}
                            {order.status === 'Rejected' && order.rejectionReason && (
                              <>
                                <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                                  Rejected: {order.rejectionReason}
                                </div>
                                <button
                                  onClick={() => setRetryDialog({ open: true, orderId: order._id })}
                                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                                >
                                  Retry with New Transaction ID
                                </button>
                              </>
                            )}
                            {order.status === 'Ready' && (
                              <button
                                onClick={() => handleMarkReceived(order._id)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Mark as Received
                              </button>
                            )}
                          </div>

                          {/* Timestamp */}
                          <p className="text-xs text-gray-500">
                            Ordered: {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center">
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                        size="large"
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>

      {/* Retry Transaction Dialog */}
      <Dialog open={retryDialog.open} onClose={() => setRetryDialog({ open: false, orderId: null })}>
        <DialogTitle>Retry Transaction</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600 mb-4">
            Enter a new transaction ID to retry this order:
          </p>
          <input
            type="text"
            placeholder="e.g., TRX987654321"
            value={newTransactionId}
            onChange={(e) => setNewTransactionId(e.target.value)}
            className="input w-full"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetryDialog({ open: false, orderId: null })}>Cancel</Button>
          <Button onClick={handleRetryTransaction} variant="contained" className="btn-primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, orderId: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Experience</DialogTitle>
        <DialogContent>
          <div className="text-center mb-6">
            <p className="text-base mb-4">How was your food?</p>
            <Rating
              value={reviewData.rating}
              onChange={(e, newValue) => setReviewData({ ...reviewData, rating: newValue })}
              size="large"
            />
          </div>
          <textarea
            rows={4}
            placeholder="Share your experience..."
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            className="input w-full resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            Your review will be analyzed for sentiment to help other students
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog({ open: false, orderId: null })}>Skip</Button>
          <Button onClick={handleSubmitReview} variant="contained" className="btn-primary">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
