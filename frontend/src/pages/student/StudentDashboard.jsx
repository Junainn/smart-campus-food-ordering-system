import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  LogOut, 
  Search, 
  MapPin, 
  Clock,
  TrendingUp,
  ChevronRight,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getAvailableVendors } from '../../services/apiService';
import { 
  VendorCard, 
  EmptyState, 
  GridSkeleton,
  Badge as CustomBadge 
} from '../../components/shared';
import { cn } from '../../utils/cn';

const StudentDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter vendors based on search query
  const filteredVendors = vendors.filter(vendor =>
    vendor.stallName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl">🍽️</div>
              <span className="font-heading font-bold text-xl text-gray-900">
                CUET Food Hub
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/orders')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Package size={20} />
                <span className="font-medium">My Orders</span>
              </button>

              <button
                onClick={() => navigate('/checkout')}
                className="relative p-2 text-gray-700 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart size={24} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg text-white/90">
                Discover delicious meals from campus vendors
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for vendors or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary-500" size={24} />
            <h2 className="font-heading font-bold text-2xl text-gray-900">
              Available Vendors
            </h2>
          </div>
          <span className="text-gray-600 font-medium">
            {filteredVendors.length} vendors open now
          </span>
        </div>

        {/* Loading State */}
        {loading && <GridSkeleton count={6} columns={3} />}

        {/* Empty State */}
        {!loading && filteredVendors.length === 0 && (
          <EmptyState
            type={searchQuery ? 'search' : 'default'}
            title={searchQuery ? 'No vendors found' : 'No vendors available'}
            message={
              searchQuery
                ? 'Try adjusting your search query'
                : 'No vendors are currently open. Please check back later!'
            }
            action={
              searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              )
            }
          />
        )}

        {/* Vendors Grid */}
        {!loading && filteredVendors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor._id}
                vendor={{
                  name: vendor.stallName,
                  description: vendor.description,
                  image: vendor.image,
                  rating: vendor.rating || 4.5,
                  reviewCount: 
                    (vendor.reviewSummary?.positive || 0) +
                    (vendor.reviewSummary?.neutral || 0) +
                    (vendor.reviewSummary?.negative || 0),
                  location: 'CUET Campus',
                  preparationTime: '20-30',
                  isAvailable: true,
                }}
                onClick={() => handleVendorClick(vendor._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
