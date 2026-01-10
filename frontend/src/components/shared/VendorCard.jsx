import React from 'react';
import { cn } from '../../utils/cn';
import { Star, Clock, MapPin } from 'lucide-react';
import Badge from './Badge';

/**
 * VendorCard Component - Modern vendor card with image, ratings, and details
 * Following design reference vendor card specifications
 */
const VendorCard = ({ 
  vendor,
  onClick,
  className = ''
}) => {
  const {
    name,
    description,
    image,
    rating = 0,
    reviewCount = 0,
    location,
    preparationTime = '20-30',
    isAvailable = true,
  } = vendor;

  return (
    <div
      onClick={onClick}
      className={cn(
        'card group cursor-pointer overflow-hidden',
        'transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        !isAvailable && 'opacity-60',
        className
      )}
    >
      {/* Image Section */}
      <div className="relative h-44 bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-2">🍽️</div>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
        
        {/* Availability Badge */}
        {!isAvailable && (
          <div className="absolute top-3 right-3">
            <Badge variant="error" size="sm">
              Closed
            </Badge>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Vendor Name */}
        <h3 className="font-heading font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-500 transition-colors">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
            <span>({reviewCount})</span>
          </div>

          {/* Preparation Time */}
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{preparationTime} min</span>
          </div>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin size={14} />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCard;
