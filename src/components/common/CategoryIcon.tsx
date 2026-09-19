import React from 'react';
import {
  Car,
  GraduationCap,
  MoreHorizontal,
  PiggyBank,
  Receipt,
  ShieldAlert,
  ShoppingBag,
  ShoppingCart,
  User,
  Utensils,
} from 'lucide-react';
import { CategoryId } from '../../types';
import { CATEGORY_MAP } from '../../constants/categories';

interface CategoryIconProps {
  categoryId: CategoryId;
  size?: number;
  showBg?: boolean;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryId,
  size = 18,
  showBg = true,
  className = '',
}) => {
  const cat = CATEGORY_MAP[categoryId] || CATEGORY_MAP.other;

  const renderIcon = () => {
    switch (categoryId) {
      case 'essentials':
        return <ShoppingCart size={size} />;
      case 'food':
        return <Utensils size={size} />;
      case 'transport':
        return <Car size={size} />;
      case 'education':
        return <GraduationCap size={size} />;
      case 'personal':
        return <User size={size} />;
      case 'shopping':
        return <ShoppingBag size={size} />;
      case 'bills':
        return <Receipt size={size} />;
      case 'savings':
        return <PiggyBank size={size} />;
      case 'emergency':
        return <ShieldAlert size={size} />;
      default:
        return <MoreHorizontal size={size} />;
    }
  };

  if (!showBg) {
    return (
      <span style={{ color: cat.color }} className={className}>
        {renderIcon()}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 border ${className}`}
      style={{
        backgroundColor: cat.bgLight,
        color: cat.color,
        borderColor: `${cat.color}33`,
        boxShadow: `0 2px 10px -2px ${cat.color}25`,
      }}
    >
      {renderIcon()}
    </div>
  );
};
