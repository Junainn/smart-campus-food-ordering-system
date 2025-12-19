import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to={role === 'vendor' ? '/vendor/login' : '/login'} />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/dashboard'} />;
  }

  return children;
};

export default PrivateRoute;
