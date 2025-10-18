import React from 'react';
import { Home, Brain, BookOpen, Target, Star } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const pages = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'demo', name: 'AI Lab', icon: Brain },
    { id: 'wiki', name: 'Wiki', icon: BookOpen },
    { id: 'impact', name: 'Impact Sim', icon: Target }
  ];

  return (
    <nav className="fixed top-4 left-4 z-50">
      <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-2">
        <div className="flex flex-col gap-2">
          {pages.map(page => {
            const Icon = page.icon;
            const isActive = currentPage === page.id;
            
            return (
              <button
                key={page.id}
                onClick={() => onPageChange(page.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{page.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
