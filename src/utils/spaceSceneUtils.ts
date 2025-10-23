// Utility functions for space scene optimization and configuration

export interface SpaceSceneConfig {
  isMobile: boolean;
  quality: 'low' | 'medium' | 'high';
  enablePostProcessing: boolean;
  starCount: number;
  enableWarpEffect: boolean;
}

export function detectDeviceCapabilities(): SpaceSceneConfig {
  const isMobile = window.innerWidth < 768 || 
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  let quality: 'low' | 'medium' | 'high' = 'high';
  if (isMobile || isLowEnd) {
    quality = 'low';
  } else if (window.innerWidth < 1200) {
    quality = 'medium';
  }
  
  return {
    isMobile,
    quality,
    enablePostProcessing: !isMobile && quality !== 'low',
    starCount: isMobile ? 2000 : quality === 'high' ? 8000 : 5000,
    enableWarpEffect: !isMobile && quality === 'high'
  };
}

export function getOptimizedSettings(config: SpaceSceneConfig) {
  const baseSettings = {
    blackHoleRadius: 1.15,
    accretionDiskRadius: 2.6,
    spaceshipOrbitRadius: 4.0,
    cameraFov: 60,
    bloomIntensity: 1.3,
    ambientLightIntensity: 0.25,
    pointLightIntensity: 1.4
  };
  
  if (config.quality === 'low') {
    return {
      ...baseSettings,
      bloomIntensity: 0.8,
      ambientLightIntensity: 0.2,
      pointLightIntensity: 1.0,
      cameraFov: 70
    };
  }
  
  if (config.quality === 'medium') {
    return {
      ...baseSettings,
      bloomIntensity: 1.0,
      ambientLightIntensity: 0.22,
      pointLightIntensity: 1.2
    };
  }
  
  return baseSettings;
}

// Performance monitoring
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  
  update() {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }
  
  getFPS(): number {
    return this.fps;
  }
  
  shouldReduceQuality(): boolean {
    return this.fps < 30;
  }
}

// Model loading utilities
export async function loadSpaceshipModel(url: string): Promise<THREE.Object3D | null> {
  try {
    const { useGLTF } = await import('@react-three/drei');
    const gltf = useGLTF(url);
    return gltf.scene;
  } catch (error) {
    console.warn('Failed to load spaceship model:', error);
    return null;
  }
}

// Color utilities for accretion disk
export function generateAccretionColors(time: number): { colorA: THREE.Color; colorB: THREE.Color } {
  const hue1 = (time * 0.1) % 1;
  const hue2 = (time * 0.15 + 0.3) % 1;
  
  return {
    colorA: new THREE.Color().setHSL(hue1, 0.8, 0.6),
    colorB: new THREE.Color().setHSL(hue2, 0.9, 0.7)
  };
}

// Animation easing functions
export const spaceEasings = {
  blackHolePulse: (t: number) => 1 + Math.sin(t * 2) * 0.01,
  spaceshipOrbit: (t: number) => t * 0.15,
  accretionDiskRotation: (t: number) => t * 0.0008,
  cameraMovement: (t: number) => Math.sin(t * 0.2) * 0.5
};
