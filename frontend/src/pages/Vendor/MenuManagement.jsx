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
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
  alpha,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ImageIcon from '@mui/icons-material/Image';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../../services/apiService';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, item: null });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await getMenuItems();
      setMenuItems(response.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load menu items', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        isAvailable: item.isAvailable,
      });
      setImagePreview(item.cloudinaryImageUrl || '');
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true,
      });
      setImagePreview('');
    }
    setImage(null);
    setDialog({ open: true, item });
  };

  const handleCloseDialog = () => {
    setDialog({ open: false, item: null });
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isAvailable: true,
    });
    setImage(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      setSnackbar({ open: true, message: 'Please fill required fields', severity: 'error' });
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('isAvailable', formData.isAvailable);
    if (image) {
      data.append('image', image);
    }

    try {
      if (dialog.item) {
        await updateMenuItem(dialog.item._id, data);
        setSnackbar({ open: true, message: 'Menu item updated!', severity: 'success' });
      } else {
        await addMenuItem(data);
        setSnackbar({ open: true, message: 'Menu item added!', severity: 'success' });
      }
      handleCloseDialog();
      fetchMenuItems();
    } catch (err) {
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteMenuItem(id);
      setSnackbar({ open: true, message: 'Item deleted!', severity: 'success' });
      fetchMenuItems();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete item', severity: 'error' });
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
          <RestaurantMenuIcon sx={{ mx: 1, fontSize: 28 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Menu Management
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              fontWeight: 600,
              '&:hover': { backgroundColor: alpha('#ffffff', 0.1) },
            }}
          >
            Add Item
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 6 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={60} />
          </Box>
        ) : menuItems.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: alpha('#667eea', 0.05),
              borderRadius: 4,
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              No menu items yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                },
              }}
            >
              Add First Item
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {item.cloudinaryImageUrl ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.cloudinaryImageUrl}
                      alt={item.name}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 80, color: 'white', opacity: 0.5 }} />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.isAvailable ? 'Available' : 'Unavailable'}
                        color={item.isAvailable ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        ৳{item.price}
                      </Typography>
                      <Chip label={item.category} size="small" />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog open={dialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog.item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Item Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Price (৳)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            placeholder="e.g., Rice, Snacks, Drinks"
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              />
            }
            label="Available"
            sx={{ mt: 1 }}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
              {image || dialog.item?.cloudinaryImageUrl ? 'Change Image' : 'Upload Image'}
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : dialog.item ? 'Update' : 'Add'}
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

export default MenuManagement;
