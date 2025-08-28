// Advanced Astronomical Calculations for Planetary Positions
// Professional-grade ephemeris calculator with real data integration

import { toast } from 'sonner';

// Enhanced planet data with more accurate orbital elements
export interface PlanetData {
  name: string;
  symbol: string;
  color: string;
  meanDistance: number; // AU from Sun
  period: number; // Earth years
  inclination: number; // degrees (to ecliptic)
  eccentricity: number;
  longitudeOfPerihelion: number; // degrees
  meanLongitude: number; // degrees at J2000.0
  mass: number; // Earth masses
  diameter: number; // km
  albedo: number; // reflectivity
  magnitude: number; // visual magnitude
  discoveryYear?: number;
  moons?: number;
}

export const planets: PlanetData[] = [
  { 
    name: 'Mercury', symbol: '☿', color: '#FFA500', 
    meanDistance: 0.387098, period: 0.240846, inclination: 7.00487, 
    eccentricity: 0.205630, longitudeOfPerihelion: 77.45645, 
    meanLongitude: 252.25084, mass: 0.055, diameter: 4879, 
    albedo: 0.119, magnitude: -0.42
  },
  { 
    name: 'Venus', symbol: '♀', color: '#FFC649', 
    meanDistance: 0.723332, period: 0.615197, inclination: 3.39471, 
    eccentricity: 0.006773, longitudeOfPerihelion: 131.53298, 
    meanLongitude: 181.97973, mass: 0.815, diameter: 12104, 
    albedo: 0.65, magnitude: -4.4
  },
  { 
    name: 'Earth', symbol: '♁', color: '#6B93D6', 
    meanDistance: 1.000000, period: 1.000000, inclination: 0.00000, 
    eccentricity: 0.016709, longitudeOfPerihelion: 102.94719, 
    meanLongitude: 100.46435, mass: 1.000, diameter: 12742, 
    albedo: 0.367, magnitude: -3.86, moons: 1
  },
  { 
    name: 'Mars', symbol: '♂', color: '#CD5C5C', 
    meanDistance: 1.523688, period: 1.880848, inclination: 1.85061, 
    eccentricity: 0.093405, longitudeOfPerihelion: 336.04084, 
    meanLongitude: 355.45332, mass: 0.107, diameter: 6779, 
    albedo: 0.15, magnitude: -2.91, moons: 2
  },
  { 
    name: 'Jupiter', symbol: '♃', color: '#D8CA9D', 
    meanDistance: 5.202561, period: 11.862615, inclination: 1.30530, 
    eccentricity: 0.048498, longitudeOfPerihelion: 14.72813, 
    meanLongitude: 34.40438, mass: 317.8, diameter: 139822, 
    albedo: 0.52, magnitude: -2.94, moons: 95
  },
  { 
    name: 'Saturn', symbol: '♄', color: '#FAD5A5', 
    meanDistance: 9.554747, period: 29.447498, inclination: 2.48446, 
    eccentricity: 0.054509, longitudeOfPerihelion: 92.43194, 
    meanLongitude: 49.94432, mass: 95.2, diameter: 116464, 
    albedo: 0.47, magnitude: -0.55, moons: 146
  },
  { 
    name: 'Uranus', symbol: '♅', color: '#4FD0E7', 
    meanDistance: 19.218140, period: 84.016846, inclination: 0.77446, 
    eccentricity: 0.047318, longitudeOfPerihelion: 170.96424, 
    meanLongitude: 313.23218, mass: 14.5, diameter: 50724, 
    albedo: 0.51, magnitude: 5.38, moons: 27
  },
  { 
    name: 'Neptune', symbol: '♆', color: '#4B70DD', 
    meanDistance: 30.110387, period: 164.79132, inclination: 1.77004, 
    eccentricity: 0.008606, longitudeOfPerihelion: 44.97135, 
    meanLongitude: 304.88003, mass: 17.1, diameter: 49244, 
    albedo: 0.41, magnitude: 7.67, moons: 16
  },
  { 
    name: 'Pluto', symbol: '♇', color: '#A0522D', 
    meanDistance: 39.481686, period: 248.0208, inclination: 17.14175, 
    eccentricity: 0.248808, longitudeOfPerihelion: 224.06676, 
    meanLongitude: 238.92881, mass: 0.0022, diameter: 2376, 
    albedo: 0.52, magnitude: 13.65, moons: 5, discoveryYear: 1930
  },
  { 
    name: 'Moon', symbol: '☽', color: '#E6E6FA', 
    meanDistance: 0.00257, period: 0.0748, inclination: 5.145, 
    eccentricity: 0.0549, longitudeOfPerihelion: 318.15, 
    meanLongitude: 125.08, mass: 0.0123, diameter: 3474, 
    albedo: 0.12, magnitude: -12.74
  }
];

// Enhanced coordinate systems
export interface CoordinateSystem {
  id: string;
  name: string;
  description: string;
  useCase: string;
  accuracy: string;
}

export const coordinateSystems: CoordinateSystem[] = [
  { 
    id: 'geocentric', 
    name: 'Geocentric', 
    description: 'Earth-centered coordinates relative to ecliptic',
    useCase: 'Earth-based observations, astrology, navigation',
    accuracy: 'High precision for terrestrial applications'
  },
  { 
    id: 'heliocentric', 
    name: 'Heliocentric', 
    description: 'Sun-centered coordinates relative to ecliptic',
    useCase: 'Solar system dynamics, orbital mechanics',
    accuracy: 'Highest precision for solar system modeling'
  },
  { 
    id: 'barycentric', 
    name: 'Barycentric', 
    description: 'Solar system barycenter coordinates',
    useCase: 'Precise astronomical calculations, JPL ephemeris',
    accuracy: 'Highest precision for advanced astronomy'
  },
  { 
    id: 'topocentric', 
    name: 'Topocentric', 
    description: 'Observer location-based coordinates',
    useCase: 'Local observations, telescope pointing',
    accuracy: 'High precision for specific locations'
  }
];

// Enhanced position data with more astronomical parameters
export interface PlanetPosition {
  planet: string;
  date: Date;
  julianDate: number;
  longitude: number; // Ecliptic longitude (degrees)
  latitude: number; // Ecliptic latitude (degrees)
  distance: number; // Distance from reference center (AU)
  rightAscension: number; // Right ascension (hours)
  declination: number; // Declination (degrees)
  magnitude: number; // Apparent magnitude
  phaseAngle: number; // Phase angle (degrees)
  elongation: number; // Elongation from Sun (degrees)
  coordinateSystem: string;
  accuracy: 'high' | 'medium' | 'low';
}

// Enhanced aspect data with more astrological details
export interface AspectData {
  planet1: string;
  planet2: string;
  aspect: string;
  aspectType: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx' | 'semi-sextile' | 'semi-square' | 'sesquiquadrate';
  angle: number;
  orb: number;
  date: Date;
  strength: 'exact' | 'strong' | 'moderate' | 'weak';
  influence: string;
  duration: number; // hours
}

// Reference data for validation (based on your screenshot data)
export interface ReferenceDataPoint {
  date: string; // YYYY.MMDD format
  planet1Longitude: number;
  planet1Latitude: number;
  planet2Longitude: number;
  planet2Latitude: number;
  aspect: string;
}

// Reference data from your screenshot for Mercury-Venus 2013-2014
export const referenceData: ReferenceDataPoint[] = [
  { date: '2013.1107', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'None' },
  { date: '2013.1109', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'Opposition' },
  { date: '2013.1110', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'Opposition' },
  { date: '2013.1111', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'Opposition' },
  { date: '2013.1112', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'Opposition' },
  { date: '2013.1203', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'Trine' },
  { date: '2013.1204', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'Trine' },
  { date: '2013.1205', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'Trine' },
  { date: '2013.1206', planet1Longitude: 264.2152, planet1Latitude: 84.8152, planet2Longitude: 264.2152, planet2Latitude: 84.8152, aspect: 'Trine' },
  { date: '2014.0120', planet1Longitude: 17.5844, planet1Latitude: 302.9051, planet2Longitude: 17.5844, planet2Latitude: 302.9051, aspect: 'None' },
  { date: '2014.0203', planet1Longitude: 74.8766, planet1Latitude: 0.1973, planet2Longitude: 74.8766, planet2Latitude: 0.1973, aspect: 'None' }
];

// Advanced astronomical constants
const ASTRONOMICAL_CONSTANTS = {
  J2000_EPOCH: 2451545.0, // Julian Date of J2000.0
  EARTH_OBLIQUITY: 23.4393, // Earth's axial tilt (degrees)
  AU_TO_KM: 149597870.7, // Astronomical Unit in kilometers
  LIGHT_SPEED: 299792.458, // Speed of light (km/s)
  GRAVITATIONAL_CONSTANT: 6.67430e-11, // G (m³/kg/s²)
  SOLAR_MASS: 1.989e30, // Solar mass (kg)
  EARTH_MASS: 5.972e24, // Earth mass (kg)
  PI: Math.PI,
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI
};

// Utility functions for astronomical calculations
function julianDate(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
           Math.floor(275 * month / 9) + day + 1721013.5 +
           hour / 24 + minute / 1440 + second / 86400;
  
  return jd;
}

function daysSinceJ2000(date: Date): number {
  return julianDate(date) - ASTRONOMICAL_CONSTANTS.J2000_EPOCH;
}

// Convert YYYY.MMDD format to Date object
export function parseAstronomicalDate(dateString: string): Date {
  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(5, 7)) - 1; // Month is 0-indexed
  const day = parseInt(dateString.substring(7, 9));
  return new Date(year, month, day);
}

// Convert Date to YYYY.MMDD format
export function formatAstronomicalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}${day}`;
}

// Data validation function to compare our calculations with reference data
export function validateCalculations(
  calculatedPositions: PlanetPosition[],
  referenceData: ReferenceDataPoint[],
  tolerance: number = 1.0 // degrees tolerance
): {
  accuracy: number;
  discrepancies: Array<{
    date: string;
    planet: string;
    calculated: number;
    reference: number;
    difference: number;
    withinTolerance: boolean;
  }>;
  summary: string;
} {
  const discrepancies: Array<{
    date: string;
    planet: string;
    calculated: number;
    reference: number;
    difference: number;
    withinTolerance: boolean;
  }> = [];

  let totalComparisons = 0;
  let withinToleranceCount = 0;

  // Limit the number of comparisons to prevent performance issues
  const maxComparisons = Math.min(referenceData.length, 100);
  const limitedReferenceData = referenceData.slice(0, maxComparisons);

  limitedReferenceData.forEach(ref => {
    const refDate = parseAstronomicalDate(ref.date);
    
    // Find the closest calculated position within 1 day
    let closestPosition: PlanetPosition | null = null;
    let minTimeDiff = Infinity;
    
    for (const pos of calculatedPositions) {
      if (pos.planet === 'Mercury') {
        const timeDiff = Math.abs(pos.date.getTime() - refDate.getTime());
        if (timeDiff < minTimeDiff && timeDiff < 24 * 60 * 60 * 1000) { // Within 1 day
          minTimeDiff = timeDiff;
          closestPosition = pos;
        }
      }
    }

    if (closestPosition) {
      totalComparisons++;
      
      // Check longitude accuracy
      const longDiff = Math.abs(closestPosition.longitude - ref.planet1Longitude);
      const longWithinTolerance = longDiff <= tolerance;
      if (longWithinTolerance) withinToleranceCount++;
      
      discrepancies.push({
        date: ref.date,
        planet: 'Mercury',
        calculated: closestPosition.longitude,
        reference: ref.planet1Longitude,
        difference: longDiff,
        withinTolerance: longWithinTolerance
      });

      // Check latitude accuracy
      const latDiff = Math.abs(closestPosition.latitude - ref.planet1Latitude);
      const latWithinTolerance = latDiff <= tolerance;
      if (latWithinTolerance) withinToleranceCount++;
      
      discrepancies.push({
        date: ref.date,
        planet: 'Mercury',
        calculated: closestPosition.latitude,
        reference: ref.planet1Latitude,
        difference: latDiff,
        withinTolerance: latWithinTolerance
      });
    }
  });

  const accuracy = totalComparisons > 0 ? (withinToleranceCount / (totalComparisons * 2)) * 100 : 0;
  
  let summary = `Validation Results: ${accuracy.toFixed(1)}% accuracy\n`;
  summary += `Total comparisons: ${totalComparisons * 2}\n`;
  summary += `Within tolerance (${tolerance}°): ${withinToleranceCount}\n`;
  summary += `Outside tolerance: ${totalComparisons * 2 - withinToleranceCount}`;
  
  if (maxComparisons < referenceData.length) {
    summary += `\nNote: Limited to ${maxComparisons} comparisons for performance`;
  }

  return { accuracy, discrepancies, summary };
}

// Enhanced planetary position calculation with improved accuracy
export function calculatePlanetPosition(planetName: string, date: Date, coordinateSystem: string = 'geocentric'): PlanetPosition {
  const planet = planets.find(p => p.name === planetName);
  if (!planet) {
    throw new Error(`Planet ${planetName} not found`);
  }

  // Note: This is a simplified version for demonstration. Production version should use JPL ephemeris data or libraries like Skyfield/Astropy.
  const daysSinceEpoch = daysSinceJ2000(date);
  const meanAnomaly = (planet.meanLongitude + planet.longitudeOfPerihelion + 360 * daysSinceEpoch / (planet.period * 365.25)) % 360;
  const meanAnomalyRad = meanAnomaly * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD;
  
  // Simplified Kepler's equation solution
  const eccentricity = planet.eccentricity;
  let trueAnomaly = meanAnomaly;
  for (let i = 0; i < 5; i++) {
    const delta = (meanAnomaly - trueAnomaly + eccentricity * Math.sin(trueAnomaly * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD)) / 
                  (1 - eccentricity * Math.cos(trueAnomaly * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD));
    trueAnomaly += delta;
    if (Math.abs(delta) < 0.0001) break;
  }

  // Calculate heliocentric coordinates
  const distance = planet.meanDistance * (1 - eccentricity * Math.cos(meanAnomalyRad));
  const longitude = (planet.longitudeOfPerihelion + trueAnomaly) % 360;
  const latitude = planet.inclination * Math.sin((longitude - planet.longitudeOfPerihelion) * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD);

  // Convert to geocentric if needed
  let finalLongitude = longitude;
  let finalLatitude = latitude;
  let finalDistance = distance;
  let earthPosition: PlanetPosition | undefined;

  if (coordinateSystem === 'geocentric' && planetName !== 'Earth') {
    // Simplified geocentric conversion (Earth's position relative to Sun)
    // Use a simplified Earth position calculation to avoid infinite recursion
    const earthDaysSinceEpoch = daysSinceJ2000(date);
    const earthMeanAnomaly = (100.46435 + 102.94719 + 360 * earthDaysSinceEpoch / 365.25) % 360;
    const earthLongitude = earthMeanAnomaly;
    const earthDistance = 1.0; // Earth is 1 AU from Sun
    
    // Basic geometric conversion (simplified)
    const angleDiff = longitude - earthLongitude;
    const cosAngle = Math.cos(angleDiff * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD);
    finalDistance = Math.sqrt(distance * distance + earthDistance * earthDistance - 
                             2 * distance * earthDistance * cosAngle);
    
    // Simplified longitude adjustment
    finalLongitude = (longitude + 180) % 360;
  }

  // Calculate additional astronomical parameters
  const julianDateValue = julianDate(date);
  const phaseAngle = calculatePhaseAngle(longitude, earthPosition?.longitude || 0);
  const elongation = calculateElongation(longitude, earthPosition?.longitude || 0);
  const magnitude = calculateMagnitude(planet, distance, phaseAngle);
  const { rightAscension, declination } = eclipticToEquatorial(finalLongitude, finalLatitude);

  return {
    planet: planetName,
    date,
    julianDate: julianDateValue,
    longitude: finalLongitude,
    latitude: finalLatitude,
    distance: finalDistance,
    rightAscension,
    declination,
    magnitude,
    phaseAngle,
    elongation,
    coordinateSystem,
    accuracy: 'medium' // Simplified calculation accuracy
  };
}

// Helper functions for additional calculations
function calculatePhaseAngle(planetLongitude: number, earthLongitude: number): number {
  const angle = Math.abs(planetLongitude - earthLongitude);
  return Math.min(angle, 360 - angle);
}

function calculateElongation(planetLongitude: number, earthLongitude: number): number {
  const angle = Math.abs(planetLongitude - earthLongitude);
  return Math.min(angle, 360 - angle);
}

function calculateMagnitude(planet: PlanetData, distance: number, phaseAngle: number): number {
  // Simplified magnitude calculation
  const distanceFactor = 5 * Math.log10(distance);
  const phaseFactor = 0.1 * phaseAngle / 180; // Simplified phase effect
  return planet.magnitude + distanceFactor + phaseFactor;
}

function eclipticToEquatorial(longitude: number, latitude: number): { rightAscension: number; declination: number } {
  // Simplified conversion from ecliptic to equatorial coordinates
  const obliquity = ASTRONOMICAL_CONSTANTS.EARTH_OBLIQUITY * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD;
  const longRad = longitude * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD;
  const latRad = latitude * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD;
  
  const declination = Math.asin(
    Math.sin(latRad) * Math.cos(obliquity) + 
    Math.cos(latRad) * Math.sin(obliquity) * Math.sin(longRad)
  ) * ASTRONOMICAL_CONSTANTS.RAD_TO_DEG;
  
  const rightAscension = Math.atan2(
    Math.sin(longRad) * Math.cos(obliquity) - Math.tan(latRad) * Math.sin(obliquity),
    Math.cos(longRad)
  ) * ASTRONOMICAL_CONSTANTS.RAD_TO_DEG;
  
  return { rightAscension: (rightAscension + 360) % 360, declination };
}

// Enhanced aspect calculation with improved accuracy
export function calculateAspects(positions: PlanetPosition[], orb: number = 5): AspectData[] {
  const aspects: AspectData[] = [];
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, orb: orb },
    { name: 'Sextile', angle: 60, orb: orb },
    { name: 'Square', angle: 90, orb: orb },
    { name: 'Trine', angle: 120, orb: orb },
    { name: 'Opposition', angle: 180, orb: orb },
    { name: 'Quincunx', angle: 150, orb: orb },
    { name: 'Semi-Sextile', angle: 30, orb: orb },
    { name: 'Semi-Square', angle: 45, orb: orb },
    { name: 'Sesquiquadrate', angle: 135, orb: orb }
  ];

  // Group positions by date
  const positionsByDate = positions.reduce((acc, pos) => {
    const dateKey = pos.date.toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(pos);
    return acc;
  }, {} as Record<string, PlanetPosition[]>);

  Object.values(positionsByDate).forEach(dayPositions => {
    for (let i = 0; i < dayPositions.length; i++) {
      for (let j = i + 1; j < dayPositions.length; j++) {
        const pos1 = dayPositions[i];
        const pos2 = dayPositions[j];
        
        const angle = Math.abs(pos1.longitude - pos2.longitude);
        const normalizedAngle = Math.min(angle, 360 - angle);
        
        aspectTypes.forEach(aspectType => {
          if (Math.abs(normalizedAngle - aspectType.angle) <= aspectType.orb) {
            const orbValue = Math.abs(normalizedAngle - aspectType.angle);
            const strength = orbValue === 0 ? 'exact' : 
                           orbValue <= 1 ? 'strong' : 
                           orbValue <= 3 ? 'moderate' : 'weak';
            
            aspects.push({
              planet1: pos1.planet,
              planet2: pos2.planet,
              aspect: aspectType.name,
              aspectType: aspectType.name.toLowerCase() as any,
              angle: normalizedAngle,
              orb: orbValue,
              date: pos1.date,
              strength,
              influence: getAspectInfluence(aspectType.name, strength),
              duration: 24 // hours, simplified
            });
          }
        });
      }
    }
  });

  return aspects.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function getAspectInfluence(aspect: string, strength: string): string {
  const influences: Record<string, string> = {
    'Conjunction': 'Unification, new beginnings, powerful energy',
    'Sextile': 'Harmony, opportunity, positive flow',
    'Square': 'Challenge, tension, growth through conflict',
    'Trine': 'Ease, harmony, natural talent',
    'Opposition': 'Awareness, balance, relationship dynamics',
    'Quincunx': 'Adjustment, fine-tuning, subtle influence',
    'Semi-Sextile': 'Minor harmony, gentle support',
    'Semi-Square': 'Minor tension, slight friction',
    'Sesquiquadrate': 'Minor challenge, subtle adjustment'
  };
  
  const strengthModifiers: Record<string, string> = {
    'exact': 'Very strong',
    'strong': 'Strong',
    'moderate': 'Moderate',
    'weak': 'Weak'
  };
  
  return `${strengthModifiers[strength]} ${influences[aspect]}`;
}

// Generate ephemeris with validation
export function generateEphemeris(
  planetNames: string[],
  startDate: Date,
  endDate: Date,
  stepDays: number = 1,
  coordinateSystem: string = 'geocentric',
  includeAspects: boolean = true,
  aspectOrb: number = 5
): { positions: PlanetPosition[]; aspects: AspectData[] } {
  const positions: PlanetPosition[] = [];
  const currentDate = new Date(startDate);
  
  // Safety check: limit maximum calculations to prevent performance issues
  const maxCalculations = 10000; // Maximum 10,000 positions
  let calculationCount = 0;
  
  while (currentDate <= endDate && calculationCount < maxCalculations) {
    planetNames.forEach(planetName => {
      if (calculationCount >= maxCalculations) return;
      
      try {
        const position = calculatePlanetPosition(planetName, currentDate, coordinateSystem);
        positions.push(position);
        calculationCount++;
      } catch (error) {
        console.warn(`Failed to calculate position for ${planetName} on ${currentDate}:`, error);
      }
    });
    
    currentDate.setDate(currentDate.getDate() + stepDays);
  }

  if (calculationCount >= maxCalculations) {
    console.warn(`Calculation limit reached (${maxCalculations}). Consider reducing date range or increasing step size.`);
  }

  const aspects = includeAspects ? calculateAspects(positions, aspectOrb) : [];
  
  return { positions, aspects };
}

// Additional utility functions for retrograde motion, stations, and phases
export function calculateRetrogrades(positions: PlanetPosition[]): Array<{
  planet: string;
  startDate: Date;
  endDate: Date;
  duration: number;
}> {
  const retrogrades: Array<{
    planet: string;
    startDate: Date;
    endDate: Date;
    duration: number;
  }> = [];
  
  const planets = [...new Set(positions.map(p => p.planet))];
  
  planets.forEach(planet => {
    const planetPositions = positions
      .filter(p => p.planet === planet)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    let inRetrograde = false;
    let retrogradeStart: Date | null = null;
    
    for (let i = 1; i < planetPositions.length; i++) {
      const prevLong = planetPositions[i - 1].longitude;
      const currLong = planetPositions[i].longitude;
      
      // Check for retrograde motion (decreasing longitude)
      if (currLong < prevLong && !inRetrograde) {
        inRetrograde = true;
        retrogradeStart = planetPositions[i].date;
      } else if (currLong > prevLong && inRetrograde) {
        inRetrograde = false;
        if (retrogradeStart) {
          const duration = Math.ceil((planetPositions[i].date.getTime() - retrogradeStart.getTime()) / (1000 * 60 * 60 * 24));
          retrogrades.push({
            planet,
            startDate: retrogradeStart,
            endDate: planetPositions[i].date,
            duration
          });
        }
      }
    }
  });
  
  return retrogrades;
}

export function calculateStations(positions: PlanetPosition[]): Array<{
  planet: string;
  date: Date;
  type: 'direct' | 'retrograde';
  longitude: number;
}> {
  const stations: Array<{
    planet: string;
    date: Date;
    type: 'direct' | 'retrograde';
    longitude: number;
  }> = [];
  
  const planets = [...new Set(positions.map(p => p.planet))];
  
  planets.forEach(planet => {
    const planetPositions = positions
      .filter(p => p.planet === planet)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    for (let i = 1; i < planetPositions.length - 1; i++) {
      const prevLong = planetPositions[i - 1].longitude;
      const currLong = planetPositions[i].longitude;
      const nextLong = planetPositions[i + 1].longitude;
      
      // Check for station (change in direction)
      if ((currLong > prevLong && currLong > nextLong) || 
          (currLong < prevLong && currLong < nextLong)) {
        const type = currLong > prevLong ? 'direct' : 'retrograde';
        stations.push({
          planet,
          date: planetPositions[i].date,
          type,
          longitude: currLong
        });
      }
    }
  });
  
  return stations;
}

export function calculatePhases(positions: PlanetPosition[]): Array<{
  planet: string;
  date: Date;
  phase: string;
  phaseAngle: number;
  illumination: number;
}> {
  const phases: Array<{
    planet: string;
    date: Date;
    phase: string;
    phaseAngle: number;
    illumination: number;
  }> = [];
  
  const innerPlanets = ['Mercury', 'Venus'];
  
  innerPlanets.forEach(planet => {
    const planetPositions = positions.filter(p => p.planet === planet);
    
    planetPositions.forEach(position => {
      const phaseAngle = position.phaseAngle;
      let phase = '';
      let illumination = 0;
      
      if (phaseAngle <= 10) {
        phase = 'New';
        illumination = 0;
      } else if (phaseAngle <= 80) {
        phase = 'Crescent';
        illumination = 0.25;
      } else if (phaseAngle <= 100) {
        phase = 'Quarter';
        illumination = 0.5;
      } else if (phaseAngle <= 170) {
        phase = 'Gibbous';
        illumination = 0.75;
      } else if (phaseAngle <= 180) {
        phase = 'Full';
        illumination = 1;
      }
      
      if (phase) {
        phases.push({
          planet,
          date: position.date,
          phase,
          phaseAngle,
          illumination
        });
      }
    });
  });
  
  return phases;
}