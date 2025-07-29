'use client';

import { useState } from 'react';
import { Reaction } from '@/types';

interface ReactionButtonsProps {
  reactions: {
    cheer: number;
    empathy: number;
    helpful: number;
    funny: number;
  };
  userReactions: Reaction['type'][];
  onReactionToggle: (type: Reaction['type']) => void;
}

const reactionConfig = [
  { type: 'cheer' as const, label: '응원해요', icon: '●' },
  { type: 'empathy' as const, label: '공감해요', icon: '●' },
  { type: 'helpful' as const, label: '유익해요', icon: '●' },
  { type: 'funny' as const, label: '재밌어요', icon: '●' }
];

export default function ReactionButtons({ reactions, userReactions, onReactionToggle }: ReactionButtonsProps) {
  return (
    <div className="flex gap-1 mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {reactionConfig.map(({ type, label, icon }) => {
        const isActive = userReactions.includes(type);
        const count = reactions[type];
        
        return (
          <button
            key={type}
            onClick={() => onReactionToggle(type)}
            className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors border whitespace-nowrap flex-shrink-0 ${
              isActive
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-gray-400 text-xs">{icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}