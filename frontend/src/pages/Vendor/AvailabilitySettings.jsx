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
  Switch,
  FormControlLabel,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../../context/AuthContext';
import { updateAvailability } from '../../services/apiService';

const AvailabilitySettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openingHours, setOpeningHours] = useState('09:00');
  const [closingHours, setClosingHours] = useState('17:00');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsOpen(user.isOpen || false);
      setOpeningHours(user.openingHours || '09:00');
      setClosingHours(user.closingHours || '17:00');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAvailability({
        isOpen,
        openingHours,
        closingHours,
      });
      setSnackbar({ open: true, message: 'Settings updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update settings', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOpen = async (checked) => {
    setIsOpen(checked);
    try {
      await updateAvailability({ isOpen: checked, openingHours, closingHours });
      setSnackbar({
        open: true,
        message: checked ? 'Stall is now OPEN' : 'Stall is now CLOSED',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
      setIsOpen(!checked);
    }
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
            onClick={() => navigate('/vendor/dashboard')}
            edge="start"
            sx={{ '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <AccessTimeIcon sx={{ mx: 1, fontSize: 28 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Availability Settings
          </Typography>
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
            Manage Availability
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Control when students can order from you
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mb: 6 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isOpen}
                    onChange={(e) => handleToggleOpen(e.target.checked)}
                    size="medium"
                    color="success"
                  />
                }
                label={
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {isOpen ? '🟢 Stall is OPEN' : '🔴 Stall is CLOSED'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isOpen
                        ? 'Students can see your stall and place orders'
                        : 'Your stall is hidden from students'}
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box
              sx={{
                p: 3,
                bgcolor: alpha('#667eea', 0.05),
                borderRadius: 2,
                border: '2px solid',
                borderColor: alpha('#667eea', 0.1),
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Operating Hours
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <TextField
                  label="Opening Time"
                  type="time"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1, minWidth: 200 }}
                />
                <TextField
                  label="Closing Time"
                  type="time"
                  value={closingHours}
                  onChange={(e) => setClosingHours(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1, minWidth: 200 }}
                />
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                Your stall will only appear to students within these hours (even if marked as open)
              </Alert>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              💡 Tips
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Toggle the switch to quickly open/close your stall
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Set operating hours to match your actual availability
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Students can only see open stalls within operating hours
            </Typography>
          </CardContent>
        </Card>
      </Container>

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

export default AvailabilitySettings;
