'use client';

import { PostCategory } from '@/types';

interface CategoryItem {
  name: PostCategory | string;
  icon?: string;
}

interface CategoryListProps {
  categories: CategoryItem[];
  selectedCategory?: PostCategory | string | null;
  onCategorySelect?: (category: PostCategory | string) => void;
  className?: string;
}

export default function CategoryList({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  className = ''
}: CategoryListProps) {
  return (
    <div className={`flex gap-4 px-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${className}`}>
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategorySelect?.(category.name as PostCategory)}
          className="flex flex-col items-center flex-shrink-0 group"
        >
          <div className={`w-12 h-12 rounded-full mb-1 flex items-center justify-center transition-colors ${
            selectedCategory === category.name 
              ? 'bg-blue-100' 
              : 'bg-gray-200 group-hover:bg-gray-300'
          }`}>
            {category.icon ? (
              <span className="text-xl">{category.icon}</span>
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full"></div>
            )}
          </div>
          <span className={`text-xs whitespace-nowrap ${
            selectedCategory === category.name 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-700'
          }`}>
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
}