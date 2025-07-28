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
  { type: 'cheer' as const, label: '응원해요', icon: '👏' },
  { type: 'empathy' as const, label: '공감해요', icon: '🤝' },
  { type: 'helpful' as const, label: '유익해요', icon: '💡' },
  { type: 'funny' as const, label: '웃겨요', icon: '😄' }
];

export default function ReactionButtons({ reactions, userReactions, onReactionToggle }: ReactionButtonsProps) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {reactionConfig.map(({ type, label, icon }) => {
        const isActive = userReactions.includes(type);
        const count = reactions[type];
        
        return (
          <button
            key={type}
            onClick={() => onReactionToggle(type)}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
            {count > 0 && <span className="font-medium">({count})</span>}
          </button>
        );
      })}
    </div>
  );
}