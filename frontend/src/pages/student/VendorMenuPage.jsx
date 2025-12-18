import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useCart } from '../../context/CartContext';
import { getVendorDetails, getVendorMenu } from '../../services/apiService';

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

  useEffect(() => {
    fetchData();
  }, [vendorId]);

  const fetchData = async () => {
    try {
      const [vendorRes, menuRes] = await Promise.all([
        getVendorDetails(vendorId),
        getVendorMenu(vendorId),
      ]);
      setVendor(vendorRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load menu', severity: 'error' });
    } finally {
      setLoading(false);
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
      setSnackbar({ open: true, message: 'Added to cart', severity: 'success' });
      setQuantities((prev) => ({ ...prev, [item._id]: 0 }));
    }
  };

  const handleConfirmSwitch = () => {
    clearCart();
    addToCart(vendorId, vendor.stallName, confirmDialog.item);
    setSnackbar({ open: true, message: 'Cart cleared and item added', severity: 'success' });
    setConfirmDialog({ open: false, item: null });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
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
            onClick={() => navigate('/dashboard')} 
            edge="start"
            sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <LocalDiningIcon sx={{ mx: 1, fontSize: 28 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {vendor?.stallName}
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/checkout')}
            startIcon={<ShoppingCartIcon />}
            sx={{ 
              fontWeight: 600,
              '&:hover': { backgroundColor: alpha('#ffffff', 0.1) }
            }}
          >
            Cart ({cart.items.length})
          </Button>
        </Toolbar>
      </AppBar>

      {/* Vendor Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 4,
        mb: 4,
      }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {vendor?.stallName}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {vendor?.description}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>

        {menuItems.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: alpha('#667eea', 0.05),
            borderRadius: 4,
          }}>
            <RestaurantMenuIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
              No menu items available at the moment.
            </Alert>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {item.cloudinaryImageUrl ? (
                    <CardMedia
                      component="img"
                      height="220"
                      image={item.cloudinaryImageUrl}
                      alt={item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ 
                      height: 220, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <RestaurantMenuIcon sx={{ fontSize: 80, color: 'white', opacity: 0.5 }} />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ৳{item.price}
                      </Typography>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        sx={{ 
                          fontWeight: 600,
                          background: alpha('#4ECDC4', 0.1),
                          color: '#44A08D',
                        }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Box display="flex" alignItems="center" gap={1} sx={{ width: '100%' }}>
                      <Box display="flex" alignItems="center" gap={1} sx={{ 
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 0.5,
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item._id, -1)}
                          sx={{ color: 'primary.main' }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ minWidth: 32, textAlign: 'center', fontWeight: 600 }}>
                          {quantities[item._id] || 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item._id, 1)}
                          sx={{ color: 'primary.main' }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={() => handleAddToCart(item)}
                        startIcon={<ShoppingCartIcon />}
                        sx={{ 
                          flexGrow: 1,
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                          },
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Confirm vendor switch dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, item: null })}>
        <DialogTitle>Switch Vendor?</DialogTitle>
        <DialogContent>
          <Typography>
            Your cart contains items from {cart.vendorName}. Switching to {vendor?.stallName} will
            clear your current cart. Continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, item: null })}>Cancel</Button>
          <Button onClick={handleConfirmSwitch} color="primary" variant="contained">
            Clear and Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default VendorMenuPage;
