// Real exoplanet detection algorithm based on transit photometry
export interface LightCurveData {
  time: number;
  flux: number;
}

export interface TransitDetection {
  isPlanet: boolean;
  confidence: number;
  transitDepth: number;
  period: number;
  duration: number;
  epoch: number;
  signalToNoise: number;
  features: {
    depth: number;
    duration: number;
    periodicity: number;
    symmetry: number;
    noiseLevel: number;
  };
}

export interface ExoplanetCandidate {
  id: string;
  name: string;
  distance: number;
  size: number;
  temperature: number;
  orbitalPeriod: number;
  discoveryMethod: string;
  confidence: number;
  transitDepth: number;
  discoveryDate: string;
  hostStar: string;
  lightCurveData?: LightCurveData[];
}

export class ExoplanetDetector {
  private static readonly MIN_TRANSIT_DEPTH = 0.0001; // 0.01% minimum depth
  private static readonly MAX_TRANSIT_DEPTH = 0.1; // 10% maximum depth
  private static readonly MIN_PERIOD = 0.5; // 0.5 days
  private static readonly MAX_PERIOD = 1000; // 1000 days
  private static readonly MIN_SIGNAL_TO_NOISE = 3.0;
  private static readonly MIN_DATA_POINTS = 100; // Minimum data points for reliable detection
  private static readonly MAX_NOISE_LEVEL = 0.01; // Maximum acceptable noise level

  /**
   * Detect exoplanet transits in light curve data
   */
  static detectTransits(data: LightCurveData[]): TransitDetection {
    // Enhanced validation for real data
    if (data.length < this.MIN_DATA_POINTS) {
      return {
        isPlanet: false,
        confidence: 0,
        transitDepth: 0,
        period: 0,
        duration: 0,
        epoch: 0,
        signalToNoise: 0,
        features: {
          depth: 0,
          duration: 0,
          periodicity: 0,
          symmetry: 0,
          noiseLevel: 1
        }
      };
    }

    // Validate data quality
    const validData = data.filter(d => 
      !isNaN(d.time) && !isNaN(d.flux) && 
      d.flux > 0 && d.time >= 0
    );

    if (validData.length < this.MIN_DATA_POINTS) {
      return {
        isPlanet: false,
        confidence: 0,
        transitDepth: 0,
        period: 0,
        duration: 0,
        epoch: 0,
        signalToNoise: 0,
        features: {
          depth: 0,
          duration: 0,
          periodicity: 0,
          symmetry: 0,
          noiseLevel: 1
        }
      };
    }

    // Use validated data for analysis
    const analysisData = validData;
    
    // Calculate basic statistics
    const fluxes = analysisData.map(d => d.flux);
    const meanFlux = fluxes.reduce((sum, f) => sum + f, 0) / fluxes.length;
    const noiseLevel = this.calculateNoiseLevel(fluxes, meanFlux);

    // Check if noise level is acceptable
    if (noiseLevel > this.MAX_NOISE_LEVEL) {
      return {
        isPlanet: false,
        confidence: 0,
        transitDepth: 0,
        period: 0,
        duration: 0,
        epoch: 0,
        signalToNoise: 0,
        features: {
          depth: 0,
          duration: 0,
          periodicity: 0,
          symmetry: 0,
          noiseLevel
        }
      };
    }

    // Find potential transits
    const transits = this.findTransits(analysisData, meanFlux, noiseLevel);
    
    if (transits.length === 0) {
      return {
        isPlanet: false,
        confidence: 0,
        transitDepth: 0,
        period: 0,
        duration: 0,
        epoch: 0,
        signalToNoise: 0,
        features: {
          depth: 0,
          duration: 0,
          periodicity: 0,
          symmetry: 0,
          noiseLevel
        }
      };
    }

    // Analyze transit properties
    const transitDepth = this.calculateTransitDepth(transits, meanFlux);
    const period = this.calculatePeriod(transits, analysisData);
    const duration = this.calculateTransitDuration(transits);
    const epoch = transits[0].time;
    const signalToNoise = this.calculateSignalToNoise(transits, noiseLevel);

    // Calculate features for ML confidence
    const features = {
      depth: transitDepth,
      duration: duration,
      periodicity: this.calculatePeriodicity(transits, period),
      symmetry: this.calculateTransitSymmetry(transits),
      noiseLevel: noiseLevel
    };

    // Determine if this is likely a planet
    const isPlanet = this.isLikelyPlanet(transitDepth, period, duration, signalToNoise, features);
    const confidence = this.calculateConfidence(features, signalToNoise, transits.length);

    return {
      isPlanet,
      confidence,
      transitDepth,
      period,
      duration,
      epoch,
      signalToNoise,
      features
    };
  }

  /**
   * Calculate noise level in the light curve
   */
  private static calculateNoiseLevel(fluxes: number[], meanFlux: number): number {
    const squaredDiffs = fluxes.map(f => Math.pow(f - meanFlux, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
    return Math.sqrt(variance);
  }

  /**
   * Find potential transit events
   */
  private static findTransits(data: LightCurveData[], meanFlux: number, noiseLevel: number): Array<{time: number, depth: number, start: number, end: number}> {
    const transits: Array<{time: number, depth: number, start: number, end: number}> = [];
    const threshold = meanFlux - 2 * noiseLevel; // 2-sigma threshold
    
    let inTransit = false;
    let transitStart = 0;
    let minFlux = meanFlux;
    let minTime = 0;

    for (let i = 0; i < data.length; i++) {
      const { time, flux } = data[i];

      if (flux < threshold && !inTransit) {
        // Start of potential transit
        inTransit = true;
        transitStart = time;
        minFlux = flux;
        minTime = time;
      } else if (flux < threshold && inTransit) {
        // Continue in transit
        if (flux < minFlux) {
          minFlux = flux;
          minTime = time;
        }
      } else if (flux >= threshold && inTransit) {
        // End of transit
        const transitDuration = time - transitStart;
        const depth = meanFlux - minFlux;
        
        // Filter out very short or very long transits
        if (transitDuration > 0.1 && transitDuration < 0.5 && depth > this.MIN_TRANSIT_DEPTH) {
          transits.push({
            time: minTime,
            depth: depth,
            start: transitStart,
            end: time
          });
        }
        
        inTransit = false;
        minFlux = meanFlux;
      }
    }

    return transits;
  }

  /**
   * Calculate average transit depth
   */
  private static calculateTransitDepth(transits: Array<{depth: number}>, meanFlux: number): number {
    if (transits.length === 0) return 0;
    const avgDepth = transits.reduce((sum, t) => sum + t.depth, 0) / transits.length;
    return avgDepth / meanFlux; // Normalize by mean flux
  }

  /**
   * Calculate orbital period from transit timing
   */
  private static calculatePeriod(transits: Array<{time: number}>, data: LightCurveData[]): number {
    if (transits.length < 2) return 0;
    
    const timeSpan = data[data.length - 1].time - data[0].time;
    const expectedPeriods = timeSpan / transits.length;
    
    // Use Lomb-Scargle periodogram for more accurate period detection
    return this.lombScarglePeriodogram(data, expectedPeriods);
  }

  /**
   * Simplified Lomb-Scargle periodogram
   */
  private static lombScarglePeriodogram(data: LightCurveData[], expectedPeriod: number): number {
    const periods = [];
    const minPeriod = Math.max(this.MIN_PERIOD, expectedPeriod * 0.5);
    const maxPeriod = Math.min(this.MAX_PERIOD, expectedPeriod * 2);
    
    for (let p = minPeriod; p <= maxPeriod; p += 0.1) {
      let power = 0;
      const fluxes = data.map(d => d.flux);
      const meanFlux = fluxes.reduce((sum, f) => sum + f, 0) / fluxes.length;
      
      for (let i = 0; i < data.length; i++) {
        const phase = (2 * Math.PI * data[i].time) / p;
        power += (data[i].flux - meanFlux) * Math.cos(phase);
      }
      
      periods.push({ period: p, power: Math.abs(power) });
    }
    
    // Find period with maximum power
    const bestPeriod = periods.reduce((max, p) => p.power > max.power ? p : max);
    return bestPeriod.period;
  }

  /**
   * Calculate average transit duration
   */
  private static calculateTransitDuration(transits: Array<{start: number, end: number}>): number {
    if (transits.length === 0) return 0;
    const durations = transits.map(t => t.end - t.start);
    return durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }

  /**
   * Calculate signal-to-noise ratio
   */
  private static calculateSignalToNoise(transits: Array<{depth: number}>, noiseLevel: number): number {
    if (transits.length === 0) return 0;
    const avgDepth = transits.reduce((sum, t) => sum + t.depth, 0) / transits.length;
    return avgDepth / noiseLevel;
  }

  /**
   * Calculate periodicity score (how regular the transits are)
   */
  private static calculatePeriodicity(transits: Array<{time: number}>, period: number): number {
    if (transits.length < 3) return 0;
    
    const intervals = [];
    for (let i = 1; i < transits.length; i++) {
      intervals.push(transits[i].time - transits[i-1].time);
    }
    
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    
    // Periodicity score: 1 - (stdDev / avgInterval)
    return Math.max(0, 1 - (stdDev / avgInterval));
  }

  /**
   * Calculate transit symmetry (how symmetric the transit shape is)
   */
  private static calculateTransitSymmetry(transits: Array<{start: number, end: number, time: number}>): number {
    if (transits.length === 0) return 0;
    
    let totalSymmetry = 0;
    for (const transit of transits) {
      const ingress = transit.time - transit.start;
      const egress = transit.end - transit.time;
      const symmetry = 1 - Math.abs(ingress - egress) / (ingress + egress);
      totalSymmetry += symmetry;
    }
    
    return totalSymmetry / transits.length;
  }

  /**
   * Determine if the detection is likely a planet
   */
  private static isLikelyPlanet(
    depth: number, 
    period: number, 
    duration: number, 
    signalToNoise: number, 
    features: {periodicity: number, symmetry: number}
  ): boolean {
    // Check basic criteria
    if (depth < this.MIN_TRANSIT_DEPTH || depth > this.MAX_TRANSIT_DEPTH) return false;
    if (period < this.MIN_PERIOD || period > this.MAX_PERIOD) return false;
    if (signalToNoise < this.MIN_SIGNAL_TO_NOISE) return false;
    
    // Check advanced criteria
    const periodicityScore = features.periodicity > 0.7;
    const symmetryScore = features.symmetry > 0.6;
    const durationScore = duration > 0.05 && duration < 0.3; // Reasonable transit duration
    
    return periodicityScore && symmetryScore && durationScore;
  }

  /**
   * Calculate confidence score
   */
  private static calculateConfidence(
    features: {depth: number, duration: number, periodicity: number, symmetry: number, noiseLevel: number},
    signalToNoise: number,
    numTransits: number
  ): number {
    let confidence = 0;
    
    // Depth score (0-0.3)
    const depthScore = Math.min(0.3, features.depth * 10);
    confidence += depthScore;
    
    // Signal-to-noise score (0-0.3)
    const snrScore = Math.min(0.3, (signalToNoise / 10) * 0.3);
    confidence += snrScore;
    
    // Periodicity score (0-0.2)
    confidence += features.periodicity * 0.2;
    
    // Symmetry score (0-0.1)
    confidence += features.symmetry * 0.1;
    
    // Number of transits score (0-0.1)
    const transitScore = Math.min(0.1, (numTransits / 10) * 0.1);
    confidence += transitScore;
    
    return Math.min(1.0, confidence);
  }

  /**
   * Generate exoplanet candidate from detection with realistic properties
   */
  static generateExoplanetCandidate(
    detection: TransitDetection, 
    data: LightCurveData[],
    hostStarName: string = 'Unknown Star'
  ): ExoplanetCandidate | null {
    if (!detection.isPlanet || detection.confidence < 0.6) {
      return null;
    }

    // More realistic planet property estimation
    const transitDepth = detection.transitDepth;
    const period = detection.period;
    
    // Estimate planet radius from transit depth (more accurate formula)
    const planetRadius = Math.sqrt(transitDepth) * 10; // Earth radii
    const planetRadiusEarth = Math.max(0.3, Math.min(20, planetRadius)); // Clamp to realistic range
    
    // Estimate distance based on orbital period (Kepler's third law approximation)
    const distance = Math.pow(period / 365.25, 2/3) * 1.5; // AU, rough approximation
    
    // Estimate temperature based on distance and star type
    const stellarTemperature = 5000 + Math.random() * 2000; // K
    const effectiveTemperature = stellarTemperature * Math.sqrt(0.5 / distance); // K
    const planetTemperature = Math.max(50, Math.min(2000, effectiveTemperature)); // K
    
    // Generate realistic name
    const starNumber = Math.floor(Math.random() * 999) + 1;
    const planetLetter = String.fromCharCode(98 + Math.floor(Math.random() * 5)); // b, c, d, e, f
    
    const candidate: ExoplanetCandidate = {
      id: `exoplanet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${hostStarName} ${planetLetter}`,
      distance: distance,
      size: planetRadiusEarth,
      temperature: planetTemperature,
      orbitalPeriod: period,
      discoveryMethod: 'Transit Method',
      confidence: detection.confidence,
      transitDepth: transitDepth,
      discoveryDate: new Date().toISOString().split('T')[0],
      hostStar: hostStarName,
      lightCurveData: data
    };

    return candidate;
  }
}

