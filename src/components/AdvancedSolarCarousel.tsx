import React from 'react';
import AdvancedSpaceScene from './AdvancedSpaceScene';

export const AdvancedSolarCarousel: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Advanced Space Scene with Shader-based Black Hole and Spaceship */}
      <AdvancedSpaceScene />
    </div>
  );
};
