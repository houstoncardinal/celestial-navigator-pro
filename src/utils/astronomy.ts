// Astronomical calculations for planetary positions
// Using simplified calculations for initial version - can be enhanced with more precise libraries later

export interface PlanetData {
  name: string;
  symbol: string;
  color: string;
  meanDistance: number; // AU from Sun
  period: number; // Earth years
  inclination: number; // degrees
  eccentricity: number;
}

export const planets: PlanetData[] = [
  { name: 'Mercury', symbol: '☿', color: '#FFA500', meanDistance: 0.39, period: 0.24, inclination: 7.0, eccentricity: 0.206 },
  { name: 'Venus', symbol: '♀', color: '#FFC649', meanDistance: 0.72, period: 0.62, inclination: 3.4, eccentricity: 0.007 },
  { name: 'Earth', symbol: '♁', color: '#6B93D6', meanDistance: 1.00, period: 1.00, inclination: 0.0, eccentricity: 0.017 },
  { name: 'Mars', symbol: '♂', color: '#CD5C5C', meanDistance: 1.52, period: 1.88, inclination: 1.9, eccentricity: 0.094 },
  { name: 'Jupiter', symbol: '♃', color: '#D8CA9D', meanDistance: 5.20, period: 11.86, inclination: 1.3, eccentricity: 0.049 },
  { name: 'Saturn', symbol: '♄', color: '#FAD5A5', meanDistance: 9.58, period: 29.46, inclination: 2.5, eccentricity: 0.057 },
  { name: 'Uranus', symbol: '♅', color: '#4FD0E7', meanDistance: 19.22, period: 84.01, inclination: 0.8, eccentricity: 0.046 },
  { name: 'Neptune', symbol: '♆', color: '#4B70DD', meanDistance: 30.05, period: 164.8, inclination: 1.8, eccentricity: 0.010 },
  { name: 'Pluto', symbol: '♇', color: '#A0522D', meanDistance: 39.48, period: 248.1, inclination: 17.2, eccentricity: 0.244 },
  { name: 'Moon', symbol: '☽', color: '#E6E6FA', meanDistance: 0.00257, period: 0.075, inclination: 5.1, eccentricity: 0.055 }
];

export interface CoordinateSystem {
  id: string;
  name: string;
  description: string;
}

export const coordinateSystems: CoordinateSystem[] = [
  { id: 'geocentric', name: 'Geocentric', description: 'Earth-centered coordinates' },
  { id: 'heliocentric', name: 'Heliocentric', description: 'Sun-centered coordinates' },
  { id: 'right_ascension', name: 'Right Ascension', description: 'Celestial coordinate system' }
];

export interface PlanetPosition {
  planet: string;
  date: Date;
  longitude: number;
  latitude: number;
  distance: number; // AU
}

export interface AspectData {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  date: Date;
}

// Simplified planetary position calculation
// Note: This is a basic approximation for demonstration. 
// Production version should use JPL ephemeris data or libraries like Skyfield/Astropy
export function calculatePlanetPosition(
  planetName: string, 
  date: Date, 
  coordinateSystem: string = 'heliocentric'
): PlanetPosition {
  const planet = planets.find(p => p.name === planetName);
  if (!planet) throw new Error(`Planet ${planetName} not found`);

  // Days since J2000.0 epoch (January 1, 2000, 12:00 TT)
  const j2000 = new Date('2000-01-01T12:00:00Z').getTime();
  const daysSinceEpoch = (date.getTime() - j2000) / (1000 * 60 * 60 * 24);
  
  // Mean anomaly (simplified)
  const meanAnomaly = (360 * daysSinceEpoch / (planet.period * 365.25)) % 360;
  const meanAnomalyRad = (meanAnomaly * Math.PI) / 180;
  
  // True anomaly (simplified, using mean anomaly + small eccentricity correction)
  const trueAnomaly = meanAnomaly + (2 * planet.eccentricity * Math.sin(meanAnomalyRad) * 180) / Math.PI;
  
  // Heliocentric longitude
  let longitude = trueAnomaly % 360;
  if (longitude < 0) longitude += 360;
  
  // For geocentric coordinates, add Earth's position correction
  if (coordinateSystem === 'geocentric' && planetName !== 'Earth') {
    const earthPos = calculatePlanetPosition('Earth', date, 'heliocentric');
    longitude = (longitude - earthPos.longitude + 360) % 360;
  }
  
  // Distance calculation (simplified elliptical orbit)
  const distance = planet.meanDistance * (1 - planet.eccentricity * Math.cos(meanAnomalyRad));
  
  return {
    planet: planetName,
    date: new Date(date),
    longitude: Number(longitude.toFixed(2)),
    latitude: Number((planet.inclination * Math.sin(meanAnomalyRad)).toFixed(2)),
    distance: Number(distance.toFixed(3))
  };
}

export function calculateAspects(positions: PlanetPosition[], orb: number = 5): AspectData[] {
  const aspects: AspectData[] = [];
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, symbol: '☌' },
    { name: 'Sextile', angle: 60, symbol: '⚹' },
    { name: 'Square', angle: 90, symbol: '□' },
    { name: 'Trine', angle: 120, symbol: '△' },
    { name: 'Opposition', angle: 180, symbol: '☍' }
  ];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      
      if (pos1.date.getTime() !== pos2.date.getTime()) continue;
      
      let angleDiff = Math.abs(pos1.longitude - pos2.longitude);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;
      
      for (const aspectType of aspectTypes) {
        const orbDiff = Math.abs(angleDiff - aspectType.angle);
        if (orbDiff <= orb) {
          aspects.push({
            planet1: pos1.planet,
            planet2: pos2.planet,
            aspect: `${aspectType.name} ${aspectType.symbol}`,
            angle: Number(angleDiff.toFixed(2)),
            orb: Number(orbDiff.toFixed(2)),
            date: new Date(pos1.date)
          });
        }
      }
    }
  }
  
  return aspects;
}

export function generateEphemeris(
  planetNames: string[],
  startDate: Date,
  endDate: Date,
  stepDays: number = 1,
  coordinateSystem: string = 'geocentric'
): { positions: PlanetPosition[], aspects: AspectData[] } {
  const positions: PlanetPosition[] = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    for (const planetName of planetNames) {
      try {
        const position = calculatePlanetPosition(planetName, new Date(currentDate), coordinateSystem);
        positions.push(position);
      } catch (error) {
        console.warn(`Could not calculate position for ${planetName}:`, error);
      }
    }
    currentDate.setDate(currentDate.getDate() + stepDays);
  }
  
  // Calculate aspects for each date
  const aspects: AspectData[] = [];
  const dateGroups: { [key: string]: PlanetPosition[] } = {};
  
  // Group positions by date
  positions.forEach(pos => {
    const dateKey = pos.date.toISOString().split('T')[0];
    if (!dateGroups[dateKey]) dateGroups[dateKey] = [];
    dateGroups[dateKey].push(pos);
  });
  
  // Calculate aspects for each date group
  Object.values(dateGroups).forEach(dayPositions => {
    if (dayPositions.length > 1) {
      const dayAspects = calculateAspects(dayPositions, 5);
      aspects.push(...dayAspects);
    }
  });
  
  return { positions, aspects };
}