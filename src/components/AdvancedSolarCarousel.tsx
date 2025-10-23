import React from 'react';
import SpaceScene from './SpaceScene';

export const AdvancedSolarCarousel: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Enhanced Space Scene with Black Hole and Spaceship */}
      <SpaceScene />
    </div>
  );
};
