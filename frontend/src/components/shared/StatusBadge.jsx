import React from 'react';
import { cn } from '../../utils/cn';
import { 
  Clock, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  XCircle, 
  Ban 
} from 'lucide-react';

/**
 * StatusBadge Component - Specialized badge for order status with icons
 * Follows design reference status color guidelines
 */
const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Pending',
      variant: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    },
    preparing: {
      icon: ChefHat,
      label: 'Preparing',
      variant: 'bg-blue-100 text-blue-800 border border-blue-300',
    },
    ready: {
      icon: CheckCircle2,
      label: 'Ready',
      variant: 'bg-green-100 text-green-800 border border-green-300',
    },
    delivering: {
      icon: Bike,
      label: 'Delivering',
      variant: 'bg-purple-100 text-purple-800 border border-purple-300',
    },
    completed: {
      icon: CheckCircle2,
      label: 'Completed',
      variant: 'bg-success/20 text-success border border-success/30',
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelled',
      variant: 'bg-red-100 text-red-800 border border-red-300',
    },
    rejected: {
      icon: Ban,
      label: 'Rejected',
      variant: 'bg-gray-100 text-gray-800 border border-gray-300',
    },
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        'transition-all duration-200',
        config.variant,
        sizes[size],
        className
      )}
    >
      <Icon size={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
