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
  IconButton,
  Pagination,
  alpha,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  getVendorOrders,
  verifyOrder,
  updateOrderStatus,
} from '../../services/apiService';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rejectDialog, setRejectDialog] = useState({ open: false, orderId: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const response = await getVendorOrders(page);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await verifyOrder(orderId, 'accept');
      fetchOrders();
    } catch (err) {
      alert('Failed to accept order');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      await verifyOrder(rejectDialog.orderId, 'reject', rejectionReason);
      setRejectDialog({ open: false, orderId: null });
      setRejectionReason('');
      fetchOrders();
    } catch (err) {
      alert('Failed to reject order');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
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

  const pendingCount = orders.filter(o => o.status === 'Pending').length;

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
            onClick={() => navigate('/vendor/dashboard')}
            edge="start"
            sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <ListAltIcon sx={{ mx: 1, fontSize: 28 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Orders
          </Typography>
          <Badge badgeContent={pendingCount} color="error" sx={{ mr: 2 }}>
            <Typography variant="body2">Pending</Typography>
          </Badge>
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
            Manage Orders
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Review and process customer orders
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
            <ListAltIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No orders yet
            </Typography>
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
                            Order #{order._id.slice(-8).toUpperCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {order.studentId?.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{order.studentId?.phone}</Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <TableContainer component={Paper} sx={{ mb: 2, bgcolor: alpha('#667eea', 0.02) }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Item</strong></TableCell>
                              <TableCell align="center"><strong>Qty</strong></TableCell>
                              <TableCell align="right"><strong>Price</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.items.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="right">৳{item.priceAtOrder * item.quantity}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

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
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Transaction ID
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {order.transactionId}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            Total
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            ৳{order.totalPrice}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {order.status === 'Pending' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleAccept(order._id)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<CancelIcon />}
                              onClick={() => setRejectDialog({ open: true, orderId: order._id })}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {order.status === 'Accepted' && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleStatusUpdate(order._id, 'Processing')}
                          >
                            Start Processing
                          </Button>
                        )}
                        {order.status === 'Processing' && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleStatusUpdate(order._id, 'Ready')}
                          >
                            Mark as Ready
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, orderId: null })}>
        <DialogTitle>Reject Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this order:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g., Invalid transaction ID, Out of stock"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, orderId: null })}>Cancel</Button>
          <Button onClick={handleReject} variant="contained" color="error">
            Reject Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VendorOrders;
