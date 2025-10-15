import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ExoplanetCandidate } from '../utils/exoplanetDetector';

interface ExoplanetContextType {
  discoveredExoplanets: ExoplanetCandidate[];
  addExoplanet: (exoplanet: ExoplanetCandidate) => void;
  removeExoplanet: (id: string) => void;
  updateExoplanet: (id: string, updates: Partial<ExoplanetCandidate>) => void;
  getExoplanet: (id: string) => ExoplanetCandidate | undefined;
  getTotalCount: () => number;
  getAnalyzedCount: () => number;
}

const ExoplanetContext = createContext<ExoplanetContextType | undefined>(undefined);

interface ExoplanetProviderProps {
  children: ReactNode;
}

export const ExoplanetProvider: React.FC<ExoplanetProviderProps> = ({ children }) => {
  const [discoveredExoplanets, setDiscoveredExoplanets] = useState<ExoplanetCandidate[]>([
    // Initial sample exoplanets
    {
      id: '1',
      name: 'Kepler-452b',
      distance: 1402,
      size: 1.6,
      temperature: 265,
      orbitalPeriod: 385,
      discoveryMethod: 'Transit Method',
      confidence: 0.95,
      transitDepth: 0.008,
      discoveryDate: '2015-07-23',
      hostStar: 'Kepler-452'
    },
    {
      id: '2',
      name: 'Proxima Centauri b',
      distance: 4.2,
      size: 1.3,
      temperature: 234,
      orbitalPeriod: 11.2,
      discoveryMethod: 'Radial Velocity',
      confidence: 0.88,
      transitDepth: 0.0,
      discoveryDate: '2016-08-24',
      hostStar: 'Proxima Centauri'
    },
    {
      id: '3',
      name: 'TRAPPIST-1e',
      distance: 39,
      size: 0.9,
      temperature: 251,
      orbitalPeriod: 6.1,
      discoveryMethod: 'Transit Method',
      confidence: 0.92,
      transitDepth: 0.006,
      discoveryDate: '2017-02-22',
      hostStar: 'TRAPPIST-1'
    },
    {
      id: '4',
      name: 'HD 209458 b',
      distance: 159,
      size: 1.4,
      temperature: 1130,
      orbitalPeriod: 3.5,
      discoveryMethod: 'Transit Method',
      confidence: 0.78,
      transitDepth: 0.015,
      discoveryDate: '1999-11-05',
      hostStar: 'HD 209458'
    }
  ]);

  const addExoplanet = (exoplanet: ExoplanetCandidate) => {
    setDiscoveredExoplanets(prev => {
      // Check if exoplanet already exists
      const exists = prev.some(ep => ep.id === exoplanet.id);
      if (exists) {
        return prev;
      }
      return [...prev, exoplanet];
    });
  };

  const removeExoplanet = (id: string) => {
    setDiscoveredExoplanets(prev => prev.filter(ep => ep.id !== id));
  };

  const updateExoplanet = (id: string, updates: Partial<ExoplanetCandidate>) => {
    setDiscoveredExoplanets(prev => 
      prev.map(ep => ep.id === id ? { ...ep, ...updates } : ep)
    );
  };

  const getExoplanet = (id: string) => {
    return discoveredExoplanets.find(ep => ep.id === id);
  };

  const getTotalCount = () => {
    return discoveredExoplanets.length;
  };

  const getAnalyzedCount = () => {
    return discoveredExoplanets.filter(ep => ep.confidence > 0.7).length;
  };

  const value: ExoplanetContextType = {
    discoveredExoplanets,
    addExoplanet,
    removeExoplanet,
    updateExoplanet,
    getExoplanet,
    getTotalCount,
    getAnalyzedCount
  };

  return (
    <ExoplanetContext.Provider value={value}>
      {children}
    </ExoplanetContext.Provider>
  );
};

export const useExoplanets = (): ExoplanetContextType => {
  const context = useContext(ExoplanetContext);
  if (context === undefined) {
    throw new Error('useExoplanets must be used within an ExoplanetProvider');
  }
  return context;
};

