import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  alpha,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../services/apiService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalPrice, removeFromCart, updateQuantity } = useCart();
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (!transactionId.trim()) {
      setError('Please enter transaction ID');
      return;
    }

    if (cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        vendorId: cart.vendorId,
        items: cart.items,
        totalPrice: getTotalPrice(),
        transactionId: transactionId.trim(),
      };

      await placeOrder(orderData);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
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
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Checkout</Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 6, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
          <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            Your cart is empty. Browse vendors to add items.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard')} 
            size="large"
            startIcon={<LocalDiningIcon />}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
              },
            }}
          >
            Browse Vendors
          </Button>
        </Container>
      </>
    );
  }

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
            onClick={() => navigate(-1)} 
            edge="start"
            sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <ShoppingCartIcon sx={{ mx: 1, fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Checkout</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 6, maxWidth: 'md' }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ShoppingCartIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Order Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  From: {cart.vendorName}
                </Typography>
              </Box>
            </Box>

            <List sx={{ bgcolor: alpha('#667eea', 0.02), borderRadius: 2, p: 1 }}>
              {cart.items.map((item, index) => (
                <Box key={item.menuItemId}>
                  <ListItem
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      mb: index < cart.items.length - 1 ? 1 : 0,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              border: '2px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              overflow: 'hidden',
                            }}>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                sx={{ borderRadius: 0, color: 'primary.main' }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="body1" sx={{ px: 2, fontWeight: 600 }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                sx={{ borderRadius: 0, color: 'primary.main' }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            ৳{item.priceAtOrder} × {item.quantity} = <strong>৳{item.priceAtOrder * item.quantity}</strong>
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton 
                      edge="end" 
                      onClick={() => removeFromCart(item.menuItemId)}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': { bgcolor: alpha('#FF6B9D', 0.1) }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </Box>
              ))}
            </List>

            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: alpha('#4ECDC4', 0.1),
              borderRadius: 2,
            }}>
              <Typography variant="h4" align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Total: ৳{getTotalPrice()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PaymentIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Payment Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter your payment transaction ID
                </Typography>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              Send ৳{getTotalPrice()} to the vendor via bKash/Nagad and enter the transaction ID below.
            </Alert>

            <TextField
              fullWidth
              label="Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g., TRX123456789"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)} 
                size="large"
                fullWidth
                sx={{ fontWeight: 600 }}
              >
                Back to Menu
              </Button>
              <Button
                variant="contained"
                onClick={handlePlaceOrder}
                disabled={loading}
                size="large"
                fullWidth
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default CheckoutPage;
