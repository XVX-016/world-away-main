import React from 'react';
// controls removed
import Simple3DStarfield from './Simple3DStarfield';
// solar system removed


export const AdvancedSolarCarousel: React.FC = () => {
  // state not needed after removing solar system
  // Auto-advance removed per UI cleanup; navigation via arrows only

  // navigation via page buttons only

  // optional reset kept for future use; not currently exposed

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 3D Starfield Background - Full Coverage */}
      <div className="absolute inset-0 w-full h-full">
        <Simple3DStarfield />
      </div>

      {/* Centered mount for spaceship */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div id="spaceship-mount" className="pointer-events-auto w-[50vw] max-w-[800px] h-[50vh] max-h-[600px]"></div>
      </div>

      {/* Solar system removed */}

      {/* Controls removed per request; navigation via section page buttons */}
    </div>
  );
};
