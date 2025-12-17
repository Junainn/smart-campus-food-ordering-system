import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  alpha,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import StarIcon from '@mui/icons-material/Star';
import SpeedIcon from '@mui/icons-material/Speed';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 50, color: '#FF6B6B' }} />,
      title: 'Diverse Cuisine',
      description: 'Explore a variety of delicious food options from campus vendors',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50, color: '#4ECDC4' }} />,
      title: 'Quick Orders',
      description: 'Order in seconds and get notifications when ready',
    },
    {
      icon: <StarIcon sx={{ fontSize: 50, color: '#FFD93D' }} />,
      title: 'Quality Rated',
      description: 'Read reviews with AI-powered sentiment analysis',
    },
    {
      icon: <DeliveryDiningIcon sx={{ fontSize: 50, color: '#95E1D3' }} />,
      title: 'Campus Wide',
      description: 'All your favorite CUET food vendors in one place',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ 
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Toolbar>
          <LocalDiningIcon sx={{ mr: 2, fontSize: 32, color: '#FFD93D' }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, color: 'white' }}>
            CUET Food Hub
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
            sx={{ 
              mx: 1,
              color: 'white',
              '&:hover': { backgroundColor: alpha('#ffffff', 0.1) }
            }}
          >
            Student Login
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/vendor/login')}
            sx={{ 
              mx: 1,
              color: 'white',
              '&:hover': { backgroundColor: alpha('#ffffff', 0.1) }
            }}
          >
            Vendor Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 8, md: 12 },
          color: 'white'
        }}>
          <Box sx={{ 
            display: 'inline-block',
            mb: 3,
            p: 2,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.1),
            backdropFilter: 'blur(10px)'
          }}>
            <RestaurantIcon sx={{ fontSize: 80, color: '#FFD93D' }} />
          </Box>
          
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              background: 'linear-gradient(45deg, #FFD93D, #FF6B6B)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Hungry? Order Now!
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              fontWeight: 400,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            CUET's premier food ordering platform
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 5, 
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1.1rem'
            }}
          >
            Browse delicious meals from campus vendors, place orders instantly, 
            and enjoy your favorite food without the wait!
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              startIcon={<RestaurantIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                boxShadow: '0 8px 16px rgba(255,107,107,0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                  boxShadow: '0 12px 24px rgba(255,107,107,0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Order as Student
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/vendor/register')}
              startIcon={<StorefrontIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                boxShadow: '0 8px 16px rgba(78,205,196,0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #44A08D, #4ECDC4)',
                  boxShadow: '0 12px 24px rgba(78,205,196,0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Join as Vendor
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ pb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  background: alpha('#ffffff', 0.95),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer CTA */}
        <Box sx={{ 
          textAlign: 'center', 
          pb: 6,
          pt: 4,
          borderTop: `1px solid ${alpha('#ffffff', 0.1)}`
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
            Ready to satisfy your cravings?
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
            Join hundreds of students already enjoying hassle-free food ordering
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              py: 1.5,
              px: 4,
              color: 'white',
              borderColor: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: alpha('#ffffff', 0.1),
              },
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
