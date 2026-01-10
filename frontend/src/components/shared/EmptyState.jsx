import React from 'react';
import { cn } from '../../utils/cn';
import { 
  ShoppingBag, 
  Search, 
  Package, 
  AlertCircle,
  FileQuestion,
  Inbox
} from 'lucide-react';

/**
 * EmptyState Component - Friendly empty state with illustrations
 * Following design reference empty state patterns
 */
const EmptyState = ({ 
  type = 'default',
  title,
  message,
  action,
  icon: CustomIcon,
  className = ''
}) => {
  const emptyStateConfig = {
    default: {
      icon: Inbox,
      title: 'Nothing here yet',
      message: 'There are no items to display.',
    },
    cart: {
      icon: ShoppingBag,
      title: 'Your cart is empty',
      message: 'Add some delicious items from our vendors to get started!',
    },
    search: {
      icon: Search,
      title: 'No results found',
      message: 'Try adjusting your search or filters to find what you\'re looking for.',
    },
    orders: {
      icon: Package,
      title: 'No orders yet',
      message: 'Your order history will appear here once you place your first order.',
    },
    error: {
      icon: AlertCircle,
      title: 'Something went wrong',
      message: 'We encountered an error loading this content. Please try again.',
    },
    notFound: {
      icon: FileQuestion,
      title: 'Not Found',
      message: 'The page or resource you\'re looking for doesn\'t exist.',
    },
  };

  const config = emptyStateConfig[type] || emptyStateConfig.default;
  const Icon = CustomIcon || config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      'text-center py-12 px-4',
      className
    )}>
      <div className="mb-6 text-gray-300">
        <Icon size={80} strokeWidth={1.5} />
      </div>
      
      <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
        {displayTitle}
      </h3>
      
      <p className="text-gray-600 max-w-md mb-6">
        {displayMessage}
      </p>

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
