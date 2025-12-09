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
  Grid,
  Paper,
  Avatar,
  LinearProgress,
  Divider,
  alpha,
  CircularProgress,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useAuth } from '../../context/AuthContext';
import { getVendorStats } from '../../services/apiService';

const VendorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getVendorStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: 'Total Income',
      value: `৳${stats.totalIncome.toLocaleString()}`,
      subtitle: `+৳${stats.recentIncome} this week`,
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: '#27AE60',
      bgGradient: 'linear-gradient(135deg, #27AE60 0%, #229954 100%)',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      subtitle: `${stats.recentOrders} orders this week`,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#F39C12',
      bgGradient: 'linear-gradient(135deg, #F39C12 0%, #D68910 100%)',
      clickable: true,
      path: '/vendor/orders',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      subtitle: `${stats.totalOrders} total orders`,
      icon: <ListAltIcon sx={{ fontSize: 40 }} />,
      color: '#3498DB',
      bgGradient: 'linear-gradient(135deg, #3498DB 0%, #2874A6 100%)',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      subtitle: `${stats.totalReviews} total reviews`,
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      color: '#F39C12',
      bgGradient: 'linear-gradient(135deg, #FFD93D 0%, #F39C12 100%)',
    },
  ] : [];

  const menuCards = [
    {
      title: 'Manage Menu',
      description: 'Add, edit, or remove menu items',
      icon: <RestaurantMenuIcon sx={{ fontSize: 50 }} />,
      color: '#E74C3C',
      path: '/vendor/menu',
      stats: stats ? `${stats.availableMenuItems}/${stats.totalMenuItems} available` : '',
    },
    {
      title: 'Orders',
      description: 'View and manage incoming orders',
      icon: <ListAltIcon sx={{ fontSize: 50 }} />,
      color: '#3498DB',
      path: '/vendor/orders',
      badge: stats?.pendingOrders,
      stats: stats ? `${stats.pendingOrders} pending` : '',
    },
    {
      title: 'Availability',
      description: 'Update opening hours and status',
      icon: <AccessTimeIcon sx={{ fontSize: 50 }} />,
      color: '#F39C12',
      path: '/vendor/availability',
      stats: 'Manage your schedule',
    },
  ];

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 48, height: 48 }}>
            <StorefrontIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              {user?.stallName || 'Vendor Dashboard'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Manage your food stall
            </Typography>
          </Box>
          <Button
            color="secondary"
            variant="contained"
            onClick={logout}
            sx={{ 
              fontWeight: 600,
              boxShadow: 3,
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          color: 'white',
          py: 6,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(243, 156, 18, 0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUpIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
                Welcome back, Chef! 👨‍🍳
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                Here's what's happening with your stall today
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {statCards.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      background: stat.bgGradient,
                      color: 'white',
                      cursor: stat.clickable ? 'pointer' : 'default',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '150px',
                        height: '150px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        transform: 'translate(40%, -40%)',
                      },
                    }}
                    onClick={() => stat.clickable && navigate(stat.path)}
                  >
                    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            {stat.title}
                          </Typography>
                          <Typography variant="h3" sx={{ fontWeight: 800 }}>
                            {stat.value}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            width: 64,
                            height: 64,
                          }}
                        >
                          {stat.icon}
                        </Avatar>
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.85 }}>
                        {stat.subtitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Review Summary */}
            {stats && (
              <Card sx={{ mb: 4, p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Customer Feedback Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: alpha('#27AE60', 0.1),
                        borderRadius: 3,
                      }}
                    >
                      <ThumbUpIcon sx={{ fontSize: 48, color: '#27AE60', mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#27AE60' }}>
                        {stats.reviewSummary.positive}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Positive Reviews
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(stats.reviewSummary.positive / stats.totalReviews) * 100 || 0}
                        sx={{
                          mt: 2,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha('#27AE60', 0.2),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#27AE60',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: alpha('#F39C12', 0.1),
                        borderRadius: 3,
                      }}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 48, color: '#F39C12', mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#F39C12' }}>
                        {stats.reviewSummary.neutral}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Neutral Reviews
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(stats.reviewSummary.neutral / stats.totalReviews) * 100 || 0}
                        sx={{
                          mt: 2,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha('#F39C12', 0.2),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#F39C12',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: alpha('#E74C3C', 0.1),
                        borderRadius: 3,
                      }}
                    >
                      <ThumbDownIcon sx={{ fontSize: 48, color: '#E74C3C', mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#E74C3C' }}>
                        {stats.reviewSummary.negative}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Negative Reviews
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(stats.reviewSummary.negative / stats.totalReviews) * 100 || 0}
                        sx={{
                          mt: 2,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha('#E74C3C', 0.2),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#E74C3C',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Card>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Quick Actions */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {menuCards.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '2px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        borderColor: item.color,
                        boxShadow: `0 20px 60px ${alpha(item.color, 0.2)}`,
                      },
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(item.color, 0.15),
                          color: item.color,
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      {item.stats && (
                        <Typography variant="caption" sx={{ color: item.color, fontWeight: 600 }}>
                          {item.stats}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default VendorDashboard;
