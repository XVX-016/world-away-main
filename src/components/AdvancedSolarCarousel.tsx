import React, { useState } from 'react';
// controls removed
import Simple3DStarfield from './Simple3DStarfield';
import SimpleSolarSystem3D from './SimpleSolarSystem3D';


export const AdvancedSolarCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Auto-advance removed per UI cleanup; navigation via arrows only

  // navigation via page buttons only

  // optional reset kept for future use; not currently exposed

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 3D Starfield Background - Full Coverage */}
      <div className="absolute inset-0 w-full h-full">
        <Simple3DStarfield />
      </div>

      {/* 3D Solar System Model (DOM-based) */}
      <div className="absolute inset-0 w-full h-full">
        <SimpleSolarSystem3D 
          currentPlanet={currentIndex} 
          onPlanetSelect={setCurrentIndex} 
        />
      </div>

      {/* Controls removed per request; navigation via section page buttons */}
    </div>
  );
};
