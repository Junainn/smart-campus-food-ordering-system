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
  Rating,
  Chip,
  CircularProgress,
  Pagination,
  Divider,
  Alert,
  alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../../context/AuthContext';
import { getVendorReviewsList } from '../../services/apiService';

const VendorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ positive: 0, neutral: 0, negative: 0, total: 0 });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await getVendorReviewsList(page);
      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages);
      
      // Calculate stats
      const positive = response.data.reviews.filter(r => r.sentiment === 'positive').length;
      const negative = response.data.reviews.filter(r => r.sentiment === 'negative').length;
      const neutral = response.data.reviews.filter(r => r.sentiment === 'neutral').length;
      setStats({ positive, negative, neutral, total: response.data.total });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* App Bar */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vendor/dashboard')}
            sx={{ color: 'white', mr: 2 }}
          >
            Back
          </Button>
          <ReviewsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Customer Reviews
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {user?.stallName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: alpha('#667eea', 0.05),
            borderRadius: 4,
          }}>
            <ReviewsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
              No reviews yet. Keep serving great food to get reviews!
            </Alert>
          </Box>
        ) : (
          <>
            {/* Statistics Summary */}
            <Card sx={{ mb: 4, p: 3, background: alpha('#667eea', 0.03) }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Review Statistics
              </Typography>
              <Grid container spacing={3}>
                {/* Positive Reviews */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={stats.total > 0 ? (stats.positive / stats.total) * 100 : 0}
                        size={120}
                        thickness={6}
                        sx={{
                          color: '#27AE60',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          },
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <ThumbUpIcon sx={{ fontSize: 32, color: '#27AE60', mb: 0.5 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#27AE60' }}>
                          {stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#27AE60' }}>
                      Positive
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.positive} reviews
                    </Typography>
                  </Box>
                </Grid>

                {/* Neutral Reviews */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={stats.total > 0 ? (stats.neutral / stats.total) * 100 : 0}
                        size={120}
                        thickness={6}
                        sx={{
                          color: '#95a5a6',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          },
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <RemoveCircleOutlineIcon sx={{ fontSize: 32, color: '#95a5a6', mb: 0.5 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#95a5a6' }}>
                          {stats.total > 0 ? Math.round((stats.neutral / stats.total) * 100) : 0}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#95a5a6' }}>
                      Neutral
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.neutral} reviews
                    </Typography>
                  </Box>
                </Grid>

                {/* Negative Reviews */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={stats.total > 0 ? (stats.negative / stats.total) * 100 : 0}
                        size={120}
                        thickness={6}
                        sx={{
                          color: '#E74C3C',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          },
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <ThumbDownIcon sx={{ fontSize: 32, color: '#E74C3C', mb: 0.5 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#E74C3C' }}>
                          {stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#E74C3C' }}>
                      Negative
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.negative} reviews
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Reviews List */}
            <Grid container spacing={3}>
              {reviews.map((review) => (
                <Grid item xs={12} key={review._id}>
                  <Card sx={{ 
                    background: (theme) => alpha(theme.palette.primary.main, 0.02),
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        {/* Student Avatar */}
                        <Avatar sx={{ 
                          bgcolor: 'secondary.main',
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                        }}>
                          {review.studentId?.name?.charAt(0).toUpperCase() || 'S'}
                        </Avatar>

                        {/* Review Content */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {review.studentId?.name || 'Anonymous'}
                              </Typography>
                              <Rating value={review.rating} readOnly size="small" />
                            </Box>
                            
                            {/* Sentiment Badge */}
                            <Chip
                              icon={
                                review.sentiment === 'positive' ? <ThumbUpIcon /> :
                                review.sentiment === 'negative' ? <ThumbDownIcon /> :
                                review.sentiment === 'pending' ? <CircularProgress size={16} /> :
                                <RemoveCircleOutlineIcon />
                              }
                              label={
                                review.sentiment === 'pending' 
                                  ? 'Analyzing...' 
                                  : review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)
                              }
                              size="small"
                              sx={{
                                fontWeight: 600,
                                background: review.sentiment === 'positive' 
                                  ? alpha('#27AE60', 0.15)
                                  : review.sentiment === 'negative'
                                  ? alpha('#E74C3C', 0.15)
                                  : review.sentiment === 'pending'
                                  ? alpha('#3498db', 0.15)
                                  : alpha('#95a5a6', 0.15),
                                color: review.sentiment === 'positive' 
                                  ? '#27AE60'
                                  : review.sentiment === 'negative'
                                  ? '#E74C3C'
                                  : review.sentiment === 'pending'
                                  ? '#3498db'
                                  : '#7f8c8d',
                                border: '2px solid',
                                borderColor: review.sentiment === 'positive' 
                                  ? alpha('#27AE60', 0.3)
                                  : review.sentiment === 'negative'
                                  ? alpha('#E74C3C', 0.3)
                                  : review.sentiment === 'pending'
                                  ? alpha('#3498db', 0.3)
                                  : alpha('#95a5a6', 0.3),
                              }}
                            />
                          </Box>

                          <Divider sx={{ my: 1.5 }} />

                          {/* Review Comment */}
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'text.primary',
                              lineHeight: 1.7,
                              mb: 2,
                            }}
                          >
                            {review.comment}
                          </Typography>

                          {/* Review Date */}
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 600,
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default VendorReviews;
