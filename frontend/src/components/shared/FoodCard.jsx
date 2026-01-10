import React from 'react';
import { cn } from '../../utils/cn';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import Badge from './Badge';

/**
 * FoodCard Component - Modern food item card with image, price, and actions
 * Following design reference food card specifications
 */
const FoodCard = ({ 
  item,
  quantity = 0,
  onAdd,
  onRemove,
  showActions = true,
  className = ''
}) => {
  const {
    name,
    description,
    price,
    image,
    category,
    isAvailable = true,
    isVegetarian,
    isSpicy,
  } = item;

  return (
    <div
      className={cn(
        'card group overflow-hidden',
        'transition-all duration-300',
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
              <div className="text-5xl mb-1">🍔</div>
              <p className="text-xs font-medium">No Image</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {isVegetarian && (
            <Badge variant="success" size="sm">
              🌱 Veg
            </Badge>
          )}
          {isSpicy && (
            <Badge variant="error" size="sm">
              🌶️ Spicy
            </Badge>
          )}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="default" size="lg">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {category && (
          <span className="text-xs font-medium text-primary-500 uppercase tracking-wide">
            {category}
          </span>
        )}

        {/* Name */}
        <h4 className="font-heading font-semibold text-base text-gray-900 line-clamp-1">
          {name}
        </h4>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {description}
          </p>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <div className="font-heading font-bold text-xl text-primary-500">
            ৳{price}
          </div>

          {/* Add to Cart Actions */}
          {showActions && isAvailable && (
            <div className="flex items-center gap-2">
              {quantity === 0 ? (
                <button
                  onClick={onAdd}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
                >
                  <ShoppingCart size={16} />
                  Add
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onRemove}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors active:scale-95"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-gray-900 min-w-[1.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={onAdd}
                    className="w-8 h-8 rounded-lg bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
