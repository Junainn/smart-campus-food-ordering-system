import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  alpha,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useAuth } from '../../context/AuthContext';
import { registerStudent } from '../../services/apiService';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await registerStudent(formData);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4,
    }}>
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ 
              display: 'inline-block',
              p: 2,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
              mb: 2,
            }}>
              <RestaurantIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Student Registration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join CUET Food Hub
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="CUET Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="u2104040@student.cuet.ac.bd"
              helperText="Format: uYYDDIII@student.cuet.ac.bd (YY: Year, DD: Dept 01-13, III: ID)"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              helperText="Minimum 6 characters"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: '#FF6B6B', fontWeight: 600 }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentRegister;
