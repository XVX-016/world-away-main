import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Target, Zap, AlertTriangle, BarChart3 } from 'lucide-react';

interface SimulationParameters {
  asteroidSize: number; // km
  asteroidVelocity: number; // km/s
  asteroidDensity: number; // kg/m³
  impactAngle: number; // degrees
  targetType: 'ocean' | 'land' | 'city';
  targetDensity: number; // kg/m³
}

interface ImpactResults {
  craterDiameter: number; // km
  craterDepth: number; // km
  energyReleased: number; // megatons TNT
  fireballRadius: number; // km
  shockwaveRadius: number; // km
  earthquakeMagnitude: number;
  tsunamiHeight: number; // m
  debrisEjected: number; // km³
  atmosphericEffects: string[];
  globalConsequences: string[];
}

const ImpactSimulationPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [parameters, setParameters] = useState<SimulationParameters>({
    asteroidSize: 1,
    asteroidVelocity: 17,
    asteroidDensity: 3000,
    impactAngle: 45,
    targetType: 'land',
    targetDensity: 2700
  });
  const [results, setResults] = useState<ImpactResults | null>(null);
  const [simulationHistory, setSimulationHistory] = useState<ImpactResults[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Realistic impact simulation based on physics
  const calculateImpact = (params: SimulationParameters): ImpactResults => {
    const { asteroidSize, asteroidVelocity, asteroidDensity, impactAngle, targetType, targetDensity } = params;
    
    // Convert to SI units
    const radius = asteroidSize * 1000; // m
    const velocity = asteroidVelocity * 1000; // m/s
    const density = asteroidDensity; // kg/m³
    const angle = (impactAngle * Math.PI) / 180; // rad
    
    // Calculate asteroid mass
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * density;
    
    // Calculate kinetic energy
    const kineticEnergy = 0.5 * mass * Math.pow(velocity, 2);
    const energyMegatons = kineticEnergy / (4.184e15); // Convert to megatons TNT
    
    // Calculate crater dimensions (simplified scaling laws)
    const craterDiameter = 2 * Math.pow(energyMegatons, 0.294) * 0.1; // km
    const craterDepth = craterDiameter * 0.2; // km
    
    // Calculate fireball radius
    const fireballRadius = Math.pow(energyMegatons, 0.4) * 0.1; // km
    
    // Calculate shockwave radius
    const shockwaveRadius = Math.pow(energyMegatons, 0.33) * 0.5; // km
    
    // Calculate earthquake magnitude
    const earthquakeMagnitude = 0.67 * Math.log10(energyMegatons) + 4.0;
    
    // Calculate tsunami height (for ocean impacts)
    const tsunamiHeight = targetType === 'ocean' ? 
      Math.pow(energyMegatons, 0.5) * 0.1 : 0; // m
    
    // Calculate debris ejected
    const debrisEjected = Math.pow(craterDiameter, 3) * 0.1; // km³
    
    // Determine atmospheric effects
    const atmosphericEffects: string[] = [];
    if (energyMegatons > 100) atmosphericEffects.push('Global firestorm');
    if (energyMegatons > 1000) atmosphericEffects.push('Nuclear winter');
    if (energyMegatons > 10000) atmosphericEffects.push('Mass extinction event');
    if (energyMegatons > 100000) atmosphericEffects.push('Planetary devastation');
    
    // Determine global consequences
    const globalConsequences: string[] = [];
    if (energyMegatons > 10) globalConsequences.push('Regional devastation');
    if (energyMegatons > 100) globalConsequences.push('Continental effects');
    if (energyMegatons > 1000) globalConsequences.push('Global climate change');
    if (energyMegatons > 10000) globalConsequences.push('Mass extinction');
    
    return {
      craterDiameter,
      craterDepth,
      energyReleased: energyMegatons,
      fireballRadius,
      shockwaveRadius,
      earthquakeMagnitude,
      tsunamiHeight,
      debrisEjected,
      atmosphericEffects,
      globalConsequences
    };
  };

  const runSimulation = () => {
    setIsRunning(true);
    setSimulationStep(0);
    
    // Simulate impact in steps
    const steps = 100;
    const stepDuration = 50; // ms
    
    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        setSimulationStep(i);
        if (i === steps) {
          const impactResults = calculateImpact(parameters);
          setResults(impactResults);
          setSimulationHistory(prev => [impactResults, ...prev.slice(0, 9)]);
          setIsRunning(false);
        }
      }, i * stepDuration);
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationStep(0);
    setResults(null);
  };

  // Draw simulation visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSimulation = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Earth
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const earthRadius = 100;
      
      // Earth surface
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#4A90E2';
      ctx.fill();
      
      // Land masses
      ctx.beginPath();
      ctx.arc(centerX - 30, centerY - 20, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#8B4513';
      ctx.fill();
      
      // Draw asteroid trajectory
      const progress = simulationStep / 100;
      const asteroidX = centerX + (200 - progress * 200) * Math.cos(parameters.impactAngle * Math.PI / 180);
      const asteroidY = centerY - progress * 200 * Math.sin(parameters.impactAngle * Math.PI / 180);
      
      ctx.beginPath();
      ctx.arc(asteroidX, asteroidY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6B6B';
      ctx.fill();
      
      // Draw impact effects if simulation is running
      if (isRunning && progress > 0.8) {
        const impactRadius = (progress - 0.8) * 50;
        ctx.beginPath();
        ctx.arc(centerX, centerY, impactRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Draw results if available
      if (results && !isRunning) {
        const craterRadius = Math.min(results.craterDiameter * 2, 50);
        ctx.beginPath();
        ctx.arc(centerX, centerY, craterRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.fill();
      }
    };

    drawSimulation();
  }, [simulationStep, isRunning, parameters, results]);

  const getSeverityColor = (energy: number) => {
    if (energy < 1) return 'text-green-400';
    if (energy < 10) return 'text-yellow-400';
    if (energy < 100) return 'text-orange-400';
    if (energy < 1000) return 'text-red-400';
    return 'text-purple-400';
  };

  const getSeverityBg = (energy: number) => {
    if (energy < 1) return 'bg-green-500/20 border-green-500/30';
    if (energy < 10) return 'bg-yellow-500/20 border-yellow-500/30';
    if (energy < 100) return 'bg-orange-500/20 border-orange-500/30';
    if (energy < 1000) return 'bg-red-500/20 border-red-500/30';
    return 'bg-purple-500/20 border-purple-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl font-bold">Impact Simulation</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Simulate asteroid impacts and analyze their effects on Earth using real physics models.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Simulation Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Parameters */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Impact Parameters</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Asteroid Size: {parameters.asteroidSize} km
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={parameters.asteroidSize}
                    onChange={(e) => setParameters(prev => ({ ...prev, asteroidSize: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Velocity: {parameters.asteroidVelocity} km/s
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={parameters.asteroidVelocity}
                    onChange={(e) => setParameters(prev => ({ ...prev, asteroidVelocity: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Impact Angle: {parameters.impactAngle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="5"
                    value={parameters.impactAngle}
                    onChange={(e) => setParameters(prev => ({ ...prev, impactAngle: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Type
                  </label>
                  <select
                    value={parameters.targetType}
                    onChange={(e) => setParameters(prev => ({ ...prev, targetType: e.target.value as 'ocean' | 'land' | 'city' }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="land">Land</option>
                    <option value="ocean">Ocean</option>
                    <option value="city">Urban Area</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Play className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">Simulation Controls</h3>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300"
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? 'Running...' : 'Run Simulation'}
                </button>
                
                <button
                  onClick={resetSimulation}
                  disabled={isRunning}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
              
              {isRunning && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Simulation Progress</span>
                    <span className="text-blue-300">{simulationStep}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-300"
                      style={{ width: `${simulationStep}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Simulation Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Impact Visualization</h3>
              </div>
              
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border border-white/10 rounded-lg"
                />
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="mt-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-semibold text-white">Impact Results</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">Energy Released</span>
                      </div>
                      <p className={`text-2xl font-bold ${getSeverityColor(results.energyReleased)}`}>
                        {results.energyReleased.toFixed(1)} MT
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">Crater Diameter</span>
                      </div>
                      <p className="text-white text-xl font-bold">
                        {results.craterDiameter.toFixed(1)} km
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300 text-sm">Earthquake Magnitude</span>
                      </div>
                      <p className="text-white text-xl font-bold">
                        {results.earthquakeMagnitude.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {results.atmosphericEffects.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Atmospheric Effects</h4>
                        <ul className="space-y-1">
                          {results.atmosphericEffects.map((effect, index) => (
                            <li key={index} className="text-red-300 text-sm">• {effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {results.globalConsequences.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Global Consequences</h4>
                        <ul className="space-y-1">
                          {results.globalConsequences.map((consequence, index) => (
                            <li key={index} className="text-orange-300 text-sm">• {consequence}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Simulation History */}
            {simulationHistory.length > 0 && (
              <div className="mt-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Simulations</h3>
                <div className="space-y-3">
                  {simulationHistory.slice(0, 5).map((sim, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <span className="text-white font-medium">Simulation {index + 1}</span>
                        <span className="text-gray-400 text-sm ml-2">
                          {sim.asteroidSize}km, {sim.asteroidVelocity}km/s
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm border ${getSeverityBg(sim.energyReleased)}`}>
                        <span className={getSeverityColor(sim.energyReleased)}>
                          {sim.energyReleased.toFixed(1)} MT
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactSimulationPage;
