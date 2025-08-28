// Astronomical API Services
// Integration with free astronomical data sources

import { toast } from 'sonner';

// API Configuration
const API_CONFIG = {
  NASA_API_KEY: 'DEMO_KEY', // Free demo key - users can get their own
  OPENWEATHER_API_KEY: '', // Users need to get their own free key
  ASTROBIN_API_KEY: '', // Users need to get their own free key
  TIMESTAMP: new Date().toISOString()
};

// NASA APIs - Free and available
export class NASAApiService {
  private static baseUrl = 'https://api.nasa.gov';
  private static apiKey = API_CONFIG.NASA_API_KEY;

  // Get APOD (Astronomy Picture of the Day)
  static async getAstronomyPictureOfTheDay(date?: string) {
    try {
      const url = `${this.baseUrl}/planetary/apod?api_key=${this.apiKey}${date ? `&date=${date}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        title: data.title,
        explanation: data.explanation,
        url: data.url,
        hdurl: data.hdurl,
        date: data.date,
        copyright: data.copyright,
        mediaType: data.media_type
      };
    } catch (error) {
      console.error('Error fetching APOD:', error);
      toast.error('Failed to fetch Astronomy Picture of the Day');
      return null;
    }
  }

  // Get Mars Rover Photos
  static async getMarsRoverPhotos(rover: 'curiosity' | 'opportunity' | 'spirit' = 'curiosity', sol?: number) {
    try {
      const url = `${this.baseUrl}/mars-photos/api/v1/rovers/${rover}/photos?api_key=${this.apiKey}${sol ? `&sol=${sol}` : '&sol=1000'}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.photos?.slice(0, 10) || []; // Limit to 10 photos
    } catch (error) {
      console.error('Error fetching Mars photos:', error);
      toast.error('Failed to fetch Mars rover photos');
      return [];
    }
  }

  // Get Near Earth Objects (asteroids)
  static async getNearEarthObjects(startDate: string, endDate: string) {
    try {
      const url = `${this.baseUrl}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.near_earth_objects || {};
    } catch (error) {
      console.error('Error fetching NEO data:', error);
      toast.error('Failed to fetch near-Earth objects data');
      return {};
    }
  }

  // Get Solar System Bodies
  static async getSolarSystemBodies() {
    try {
      const url = `${this.baseUrl}/planetary/rest/bodies?api_key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.bodies || [];
    } catch (error) {
      console.error('Error fetching solar system bodies:', error);
      toast.error('Failed to fetch solar system bodies');
      return [];
    }
  }

  // Get Exoplanet Data
  static async getExoplanets() {
    try {
      const url = `${this.baseUrl}/exoplanet/rest/v1/exoplanet?api_key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching exoplanet data:', error);
      toast.error('Failed to fetch exoplanet data');
      return [];
    }
  }
}

// OpenWeatherMap API - Free tier available
export class WeatherApiService {
  private static baseUrl = 'https://api.openweathermap.org/data/2.5';
  private static apiKey = API_CONFIG.OPENWEATHER_API_KEY;

  // Get current weather and atmospheric conditions
  static async getCurrentWeather(lat: number, lon: number) {
    if (!this.apiKey) {
      toast.info('Weather data requires OpenWeatherMap API key');
      return null;
    }

    try {
      const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        cloudCover: data.clouds.all,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to fetch weather data');
      return null;
    }
  }

  // Get astronomical data (sunrise, sunset, etc.)
  static async getAstronomicalData(lat: number, lon: number) {
    if (!this.apiKey) {
      toast.info('Astronomical data requires OpenWeatherMap API key');
      return null;
    }

    try {
      const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
        dayLength: (data.sys.sunset - data.sys.sunrise) / 3600, // hours
        timezone: data.timezone
      };
    } catch (error) {
      console.error('Error fetching astronomical data:', error);
      toast.error('Failed to fetch astronomical data');
      return null;
    }
  }
}

// Free Astronomical Data Sources
export class FreeAstronomicalDataService {
  
  // Get current moon phase data
  static async getMoonPhase() {
    try {
      // Using a free moon phase API
      const response = await fetch('https://www.farmsense.net/v1/moonphases/?d1=' + Math.floor(Date.now() / 1000));
      
      if (!response.ok) {
        throw new Error(`Moon phase API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error('Error fetching moon phase:', error);
      // Fallback to calculated moon phase
      return this.calculateMoonPhase(new Date());
    }
  }

  // Calculate moon phase (fallback method)
  private static calculateMoonPhase(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simplified moon phase calculation
    const c = Math.floor(year / 100);
    const y = year % 100;
    const m = month < 3 ? month + 12 : month;
    const d = day;
    
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d - 1524.5;
    const daysSinceNewMoon = (jd - 2451550.1) % 29.530588853;
    const phase = daysSinceNewMoon / 29.530588853;
    
    let phaseName = '';
    if (phase < 0.0625) phaseName = 'New Moon';
    else if (phase < 0.1875) phaseName = 'Waxing Crescent';
    else if (phase < 0.3125) phaseName = 'First Quarter';
    else if (phase < 0.4375) phaseName = 'Waxing Gibbous';
    else if (phase < 0.5625) phaseName = 'Full Moon';
    else if (phase < 0.6875) phaseName = 'Waning Gibbous';
    else if (phase < 0.8125) phaseName = 'Last Quarter';
    else if (phase < 0.9375) phaseName = 'Waning Crescent';
    else phaseName = 'New Moon';
    
    return {
      phase: phaseName,
      illumination: Math.round(phase * 100),
      age: Math.round(daysSinceNewMoon),
      date: date.toISOString()
    };
  }

  // Get sunrise/sunset times for a location
  static async getSunTimes(lat: number, lon: number, date: Date = new Date()) {
    try {
      // Using sunrise-sunset.org API (free)
      const dateStr = date.toISOString().split('T')[0];
      const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${dateStr}&formatted=0`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Sun times API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        return {
          sunrise: new Date(data.results.sunrise),
          sunset: new Date(data.results.sunset),
          civilTwilightBegin: new Date(data.results.civil_twilight_begin),
          civilTwilightEnd: new Date(data.results.civil_twilight_end),
          nauticalTwilightBegin: new Date(data.results.nautical_twilight_begin),
          nauticalTwilightEnd: new Date(data.results.nautical_twilight_end),
          astronomicalTwilightBegin: new Date(data.results.astronomical_twilight_begin),
          astronomicalTwilightEnd: new Date(data.results.astronomical_twilight_end),
          dayLength: data.results.day_length
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching sun times:', error);
      toast.error('Failed to fetch sun times');
      return null;
    }
  }

  // Get ISS (International Space Station) position
  static async getISSPosition() {
    try {
      const response = await fetch('http://api.open-notify.org/iss-now.json');
      
      if (!response.ok) {
        throw new Error(`ISS API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        timestamp: new Date(data.timestamp * 1000)
      };
    } catch (error) {
      console.error('Error fetching ISS position:', error);
      toast.error('Failed to fetch ISS position');
      return null;
    }
  }

  // Get visible satellites for a location
  static async getVisibleSatellites(lat: number, lon: number, alt: number = 0) {
    try {
      // Using N2YO API (free tier available)
      const url = `https://www.n2yo.com/rest/v1/satellite/above/${lat}/${lon}/${alt}/0/20/&apiKey=`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Satellite API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.above || [];
    } catch (error) {
      console.error('Error fetching satellite data:', error);
      toast.error('Failed to fetch satellite data');
      return [];
    }
  }
}

// Astronomical Events Service
export class AstronomicalEventsService {
  
  // Get upcoming astronomical events
  static async getUpcomingEvents() {
    try {
      // Using a free astronomical events API or calculated events
      const events = this.calculateUpcomingEvents();
      return events;
    } catch (error) {
      console.error('Error calculating astronomical events:', error);
      return [];
    }
  }

  // Calculate upcoming astronomical events
  private static calculateUpcomingEvents() {
    const events = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Add some common astronomical events
    events.push({
      name: 'Vernal Equinox',
      date: new Date(currentYear, 2, 20), // March 20-21
      type: 'equinox',
      description: 'Spring begins in Northern Hemisphere'
    });
    
    events.push({
      name: 'Summer Solstice',
      date: new Date(currentYear, 5, 21), // June 20-21
      type: 'solstice',
      description: 'Longest day in Northern Hemisphere'
    });
    
    events.push({
      name: 'Autumnal Equinox',
      date: new Date(currentYear, 8, 22), // September 22-23
      type: 'equinox',
      description: 'Fall begins in Northern Hemisphere'
    });
    
    events.push({
      name: 'Winter Solstice',
      date: new Date(currentYear, 11, 21), // December 21-22
      type: 'solstice',
      description: 'Shortest day in Northern Hemisphere'
    });
    
    // Filter to upcoming events only
    return events.filter(event => event.date > now);
  }

  // Get meteor shower information
  static async getMeteorShowers() {
    try {
      const currentYear = new Date().getFullYear();
      // Return major meteor showers
      return [
        {
          name: 'Perseids',
          peakDate: new Date(currentYear, 7, 12), // August 12-13
          description: 'One of the most reliable meteor showers',
          rate: '60-100 meteors per hour',
          radiant: 'Perseus constellation'
        },
        {
          name: 'Geminids',
          peakDate: new Date(currentYear, 11, 14), // December 13-14
          description: 'Bright, colorful meteors',
          rate: '120 meteors per hour',
          radiant: 'Gemini constellation'
        },
        {
          name: 'Leonids',
          peakDate: new Date(currentYear, 10, 17), // November 17-18
          description: 'Fast meteors with long trails',
          rate: '15 meteors per hour',
          radiant: 'Leo constellation'
        }
      ];
    } catch (error) {
      console.error('Error getting meteor shower data:', error);
      return [];
    }
  }
} 