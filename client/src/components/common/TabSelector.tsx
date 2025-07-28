'use client';

interface Tab {
  label: string;
  value: string;
  count?: number;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export default function TabSelector({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = ''
}: TabSelectorProps) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`flex-1 py-3 text-sm font-medium text-center relative transition-colors ${
              activeTab === tab.value 
                ? 'text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1 text-xs">({tab.count})</span>
            )}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}