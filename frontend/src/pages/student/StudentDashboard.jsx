import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  CircularProgress,
  Badge,
  alpha,
  Avatar,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RemoveIcon from '@mui/icons-material/Remove';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getAvailableVendors } from '../../services/apiService';

const StudentDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await getAvailableVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorClick = (vendorId) => {
    navigate(`/vendor/${vendorId}`);
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
          <LocalDiningIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            CUET Food Hub
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/orders')}
            sx={{ 
              mr: 1,
              '&:hover': { backgroundColor: alpha('#ffffff', 0.1) }
            }}
          >
            My Orders
          </Button>
          <Badge 
            badgeContent={getTotalItems()} 
            color="warning" 
            sx={{ mx: 2 }}
          >
            <Button 
              color="inherit" 
              onClick={() => navigate('/checkout')}
              sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
            >
              <ShoppingCartIcon />
            </Button>
          </Badge>
          <Button 
            color="inherit" 
            onClick={logout}
            sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6,
        mb: 4,
      }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: alpha('#ffffff', 0.2),
              fontSize: '1.5rem',
              fontWeight: 700,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Discover delicious meals from campus vendors
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>

        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          🍽️ Available Vendors
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : vendors.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: alpha('#667eea', 0.05),
            borderRadius: 4,
          }}>
            <RestaurantMenuIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No vendors are currently open
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please check back later for delicious food options!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {vendors.map((vendor) => (
              <Grid item xs={12} sm={6} md={4} key={vendor._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
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
                  <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main',
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}>
                        <RestaurantMenuIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {vendor.stallName}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 2, minHeight: 40 }}
                    >
                      {vendor.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      mb: 2,
                      color: 'text.secondary',
                    }}>
                      <AccessTimeIcon sx={{ fontSize: 18 }} />
                      <Typography variant="caption">
                        {vendor.openingHours} - {vendor.closingHours}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {vendor.reviewSummary?.positive > 0 && (
                        <Chip
                          icon={<ThumbUpIcon />}
                          label={vendor.reviewSummary.positive}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                      {vendor.reviewSummary?.neutral > 0 && (
                        <Chip
                          icon={<RemoveIcon />}
                          label={vendor.reviewSummary.neutral}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                      {vendor.reviewSummary?.negative > 0 && (
                        <Chip
                          icon={<ThumbDownIcon />}
                          label={vendor.reviewSummary.negative}
                          color="error"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleVendorClick(vendor._id)}
                      startIcon={<RestaurantMenuIcon />}
                      sx={{
                        py: 1.2,
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                        },
                      }}
                    >
                      View Menu
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default StudentDashboard;
