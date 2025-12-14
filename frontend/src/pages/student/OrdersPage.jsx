import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  IconButton,
  Pagination,
  alpha,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../context/AuthContext';
import {
  getStudentOrders,
  resubmitTransactionId,
  cancelOrder,
  completeOrder,
  submitReview,
} from '../../services/apiService';

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
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(orderId);
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const handleRetryTransaction = async () => {
    if (!newTransactionId.trim()) {
      alert('Please enter transaction ID');
      return;
    }
    try {
      await resubmitTransactionId(retryDialog.orderId, newTransactionId);
      setRetryDialog({ open: false, orderId: null });
      setNewTransactionId('');
      fetchOrders();
    } catch (err) {
      alert('Failed to resubmit transaction ID');
    }
  };

  const handleMarkReceived = async (orderId) => {
    try {
      await completeOrder(orderId);
      setReviewDialog({ open: true, orderId });
      fetchOrders();
    } catch (err) {
      alert('Failed to mark order as received');
    }
  };

  const handleSubmitReview = async () => {
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      alert('Please provide a rating between 1 and 5');
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
      alert('Review submitted successfully!');
    } catch (err) {
      alert('Failed to submit review');
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

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircleIcon />;
    if (status === 'Rejected') return <CancelIcon />;
    return <RestaurantIcon />;
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard')}
            edge="start"
            sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <LocalDiningIcon sx={{ mx: 1, fontSize: 28 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            My Orders
          </Typography>
          <IconButton
            color="inherit"
            onClick={fetchOrders}
            sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          mb: 4,
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Order History
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Track your orders and submit reviews
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={60} />
          </Box>
        ) : orders.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: alpha('#667eea', 0.05),
              borderRadius: 4,
            }}
          >
            <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Start ordering from your favorite vendors!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                },
              }}
            >
              Browse Vendors
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {orders.map((order) => (
                <Grid item xs={12} key={order._id}>
                  <Card
                    sx={{
                      position: 'relative',
                      overflow: 'visible',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 6,
                        background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                        borderRadius: '16px 16px 0 0',
                      },
                    }}
                  >
                    <CardContent sx={{ pt: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {order.vendorId?.stallName || 'Vendor'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Order ID: {order._id.slice(-8).toUpperCase()}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status}
                          color={getStatusColor(order.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {order.items.map((item, idx) => (
                          <Typography key={idx} variant="body2" color="text.secondary">
                            • {item.name} × {item.quantity} - ৳{item.priceAtOrder * item.quantity}
                          </Typography>
                        ))}
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          bgcolor: alpha('#4ECDC4', 0.1),
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ৳{order.totalPrice}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {order.status === 'Pending' && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            Cancel Order
                          </Button>
                        )}
                        {order.status === 'Rejected' && order.rejectionReason && (
                          <>
                            <Alert severity="error" sx={{ width: '100%', mb: 1 }}>
                              Rejected: {order.rejectionReason}
                            </Alert>
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() => setRetryDialog({ open: true, orderId: order._id })}
                            >
                              Retry with New Transaction ID
                            </Button>
                          </>
                        )}
                        {order.status === 'Ready' && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleMarkReceived(order._id)}
                            sx={{
                              background: 'linear-gradient(45deg, #51CF66, #40C057)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #40C057, #51CF66)',
                              },
                            }}
                          >
                            Mark as Received
                          </Button>
                        )}
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                        Ordered: {new Date(order.createdAt).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Retry Transaction Dialog */}
      <Dialog open={retryDialog.open} onClose={() => setRetryDialog({ open: false, orderId: null })}>
        <DialogTitle>Retry Transaction</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter a new transaction ID to retry this order:
          </Typography>
          <TextField
            fullWidth
            label="New Transaction ID"
            value={newTransactionId}
            onChange={(e) => setNewTransactionId(e.target.value)}
            placeholder="e.g., TRX987654321"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetryDialog({ open: false, orderId: null })}>Cancel</Button>
          <Button onClick={handleRetryTransaction} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, orderId: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Experience</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              How was your food?
            </Typography>
            <Rating
              value={reviewData.rating}
              onChange={(e, newValue) => setReviewData({ ...reviewData, rating: newValue })}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review (Bangla/English)"
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            placeholder="Share your experience..."
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Your review will be analyzed for sentiment to help other students
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog({ open: false, orderId: null })}>Skip</Button>
          <Button onClick={handleSubmitReview} variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrdersPage;
