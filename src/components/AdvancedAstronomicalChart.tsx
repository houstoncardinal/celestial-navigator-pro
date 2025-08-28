import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Orbit, 
  Globe, 
  Sun, 
  Moon, 
  Star, 
  Satellite, 
  Telescope, 
  Compass,
  RotateCcw,
  Play,
  Pause,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';
import { 
  PlanetPosition, 
  AspectData, 
  calculateRetrogrades, 
  calculateStations, 
  calculatePhases 
} from '@/utils/astronomy';
import { 
  NASAApiService, 
  FreeAstronomicalDataService, 
  AstronomicalEventsService 
} from '@/utils/astronomical-apis';
import { toast } from 'sonner';

interface AdvancedAstronomicalChartProps {
  positions: PlanetPosition[];
  aspects: AspectData[];
  selectedPlanets: string[];
}

interface ChartView {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const chartViews: ChartView[] = [
  { id: 'solar-system', name: 'Solar System', description: '3D solar system view', icon: <Globe className="w-4 h-4" /> },
  { id: 'ecliptic', name: 'Ecliptic View', description: '2D ecliptic plane projection', icon: <Orbit className="w-4 h-4" /> },
  { id: 'constellation', name: 'Constellation', description: 'Star map with constellations', icon: <Star className="w-4 h-4" /> },
  { id: 'satellite', name: 'Satellite Tracker', description: 'Real-time satellite positions', icon: <Satellite className="w-4 h-4" /> },
  { id: 'telescope', name: 'Telescope View', description: 'Observer perspective', icon: <Telescope className="w-4 h-4" /> }
];

export const AdvancedAstronomicalChart: React.FC<AdvancedAstronomicalChartProps> = ({
  positions,
  aspects,
  selectedPlanets
}) => {
  const [activeView, setActiveView] = useState('solar-system');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showAspects, setShowAspects] = useState(true);
  const [showRetrogrades, setShowRetrogrades] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [timeStep, setTimeStep] = useState(1);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  
  // Real-time data states
  const [moonPhase, setMoonPhase] = useState<any>(null);
  const [issPosition, setISSPosition] = useState<any>(null);
  const [astronomicalEvents, setAstronomicalEvents] = useState<any[]>([]);
  const [apod, setAPOD] = useState<any>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Fetch real-time astronomical data
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // Fetch moon phase
        const moonData = await FreeAstronomicalDataService.getMoonPhase();
        setMoonPhase(moonData);
        
        // Fetch ISS position
        const issData = await FreeAstronomicalDataService.getISSPosition();
        setISSPosition(issData);
        
        // Fetch astronomical events
        const events = await AstronomicalEventsService.getUpcomingEvents();
        setAstronomicalEvents(events);
        
        // Fetch APOD
        const apodData = await NASAApiService.getAstronomyPictureOfTheDay();
        setAPOD(apodData);
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Animation loop
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setCurrentTimeIndex(prev => (prev + timeStep) % positions.length);
        setRotationAngle(prev => prev + animationSpeed);
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animationSpeed, timeStep, positions.length]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Render based on active view
    switch (activeView) {
      case 'solar-system':
        renderSolarSystemView(ctx, canvas);
        break;
      case 'ecliptic':
        renderEclipticView(ctx, canvas);
        break;
      case 'constellation':
        renderConstellationView(ctx, canvas);
        break;
      case 'satellite':
        renderSatelliteView(ctx, canvas);
        break;
      case 'telescope':
        renderTelescopeView(ctx, canvas);
        break;
    }
  }, [activeView, positions, aspects, currentTimeIndex, rotationAngle, zoomLevel, showOrbits, showAspects, showRetrogrades]);

  const renderSolarSystemView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 50 * zoomLevel;
    
    // Draw Sun at center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    if (showLabels) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Sun', centerX, centerY + 35);
    }
    
    // Draw planets
    const currentPositions = positions.filter(pos => 
      selectedPlanets.includes(pos.planet) && 
      pos.date.getTime() === positions[currentTimeIndex]?.date.getTime()
    );
    
    currentPositions.forEach(pos => {
      const x = centerX + Math.cos(pos.longitude * Math.PI / 180) * pos.distance * scale;
      const y = centerY + Math.sin(pos.longitude * Math.PI / 180) * pos.distance * scale;
      
      // Draw orbit
      if (showOrbits) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, pos.distance * scale, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw planet
      const planetSize = Math.max(5, 15 - pos.distance * 2);
      ctx.beginPath();
      ctx.arc(x, y, planetSize, 0, 2 * Math.PI);
      ctx.fillStyle = getPlanetColor(pos.planet);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (showLabels) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pos.planet, x, y + planetSize + 15);
      }
    });
    
    // Draw aspects
    if (showAspects) {
      const currentAspects = aspects.filter(asp => 
        asp.date.getTime() === positions[currentTimeIndex]?.date.getTime()
      );
      
      currentAspects.forEach(asp => {
        const pos1 = currentPositions.find(p => p.planet === asp.planet1);
        const pos2 = currentPositions.find(p => p.planet === asp.planet2);
        
        if (pos1 && pos2) {
          const x1 = centerX + Math.cos(pos1.longitude * Math.PI / 180) * pos1.distance * scale;
          const y1 = centerY + Math.sin(pos1.longitude * Math.PI / 180) * pos1.distance * scale;
          const x2 = centerX + Math.cos(pos2.longitude * Math.PI / 180) * pos2.distance * scale;
          const y2 = centerY + Math.sin(pos2.longitude * Math.PI / 180) * pos2.distance * scale;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = getAspectColor(asp.aspectType);
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }
  };

  const renderEclipticView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    
    // Draw ecliptic circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw zodiac divisions
    const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                         'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    
    zodiacSigns.forEach((sign, index) => {
      const angle = (index * 30 - 90) * Math.PI / 180;
      const x = centerX + Math.cos(angle) * (radius + 20);
      const y = centerY + Math.sin(angle) * (radius + 20);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(sign, x, y);
    });
    
    // Draw planets on ecliptic
    const currentPositions = positions.filter(pos => 
      selectedPlanets.includes(pos.planet) && 
      pos.date.getTime() === positions[currentTimeIndex]?.date.getTime()
    );
    
    currentPositions.forEach(pos => {
      const angle = (pos.longitude - 90) * Math.PI / 180;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Draw planet
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = getPlanetColor(pos.planet);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (showLabels) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pos.planet, x, y + 20);
      }
    });
  };

  const renderConstellationView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw star field background
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const brightness = Math.random();
      
      ctx.beginPath();
      ctx.arc(x, y, brightness * 2, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fill();
    }
    
    // Draw constellation lines (simplified)
    const constellations = [
      { name: 'Ursa Major', stars: [[100, 100], [150, 120], [200, 100], [180, 150]] },
      { name: 'Orion', stars: [[300, 200], [350, 180], [400, 200], [350, 250]] }
    ];
    
    constellations.forEach(constellation => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      constellation.stars.forEach((star, index) => {
        if (index === 0) {
          ctx.moveTo(star[0], star[1]);
        } else {
          ctx.lineTo(star[0], star[1]);
        }
      });
      
      ctx.stroke();
    });
  };

  const renderSatelliteView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw Earth
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, 2 * Math.PI);
    ctx.fillStyle = '#4A90E2';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (showLabels) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Earth', centerX, centerY + 100);
    }
    
    // Draw ISS if available
    if (issPosition) {
      const issX = centerX + (issPosition.longitude / 180) * 200;
      const issY = centerY + (issPosition.latitude / 90) * 200;
      
      ctx.beginPath();
      ctx.arc(issX, issY, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (showLabels) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ISS', issX, issY + 15);
      }
    }
  };

  const renderTelescopeView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw telescope viewport
    ctx.beginPath();
    ctx.arc(centerX, centerY, 120, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw crosshairs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 120);
    ctx.lineTo(centerX, centerY + 120);
    ctx.stroke();
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(centerX - 120, centerY);
    ctx.lineTo(centerX + 120, centerY);
    ctx.stroke();
    
    // Draw current target (first selected planet)
    if (selectedPlanets.length > 0) {
      const targetPlanet = positions.find(pos => 
        pos.planet === selectedPlanets[0] && 
        pos.date.getTime() === positions[currentTimeIndex]?.date.getTime()
      );
      
      if (targetPlanet) {
        const x = centerX + (targetPlanet.longitude / 360) * 200;
        const y = centerY + (targetPlanet.latitude / 180) * 200;
        
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = getPlanetColor(targetPlanet.planet);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        if (showLabels) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(targetPlanet.planet, x, y + 20);
        }
      }
    }
  };

  const getPlanetColor = (planetName: string): string => {
    const colors: { [key: string]: string } = {
      'Mercury': '#FFA500',
      'Venus': '#FFC649',
      'Earth': '#6B93D6',
      'Mars': '#CD5C5C',
      'Jupiter': '#D8CA9D',
      'Saturn': '#FAD5A5',
      'Uranus': '#4FD0E7',
      'Neptune': '#4B70DD',
      'Pluto': '#A0522D',
      'Moon': '#E6E6FA'
    };
    return colors[planetName] || '#FFFFFF';
  };

  const getAspectColor = (aspectType: string): string => {
    const colors: { [key: string]: string } = {
      'conjunction': '#FF6B6B',
      'sextile': '#4ECDC4',
      'square': '#FFE66D',
      'trine': '#95E1D3',
      'opposition': '#F38181',
      'quincunx': '#A8E6CF',
      'semi-sextile': '#DCEDC1',
      'semi-square': '#FFD3B6',
      'sesquiquadrate': '#FFAAA5'
    };
    return colors[aspectType] || '#FFFFFF';
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const resetView = () => {
    setRotationAngle(0);
    setZoomLevel(1);
    setCurrentTimeIndex(0);
  };

  const exportChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `astronomical-chart-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="glass-effect border-cosmic/30">
      <CardHeader>
        <CardTitle className="text-stellar flex items-center gap-2">
          <Telescope className="w-5 h-5" />
          Advanced Astronomical Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* View Selector */}
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList className="grid w-full grid-cols-5">
            {chartViews.map(view => (
              <TabsTrigger key={view.id} value={view.id} className="flex items-center gap-2">
                {view.icon}
                <span className="hidden sm:inline">{view.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {chartViews.map(view => (
            <TabsContent key={view.id} value={view.id} className="mt-4">
              <p className="text-sm text-muted-foreground">{view.description}</p>
            </TabsContent>
          ))}
        </Tabs>

        {/* Chart Canvas */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-96 cursor-crosshair"
            style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
          />
          
          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={toggleAnimation}
              className="w-8 h-8 p-0"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={resetView}
              className="w-8 h-8 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Options */}
          <div className="space-y-4">
            <h4 className="font-semibold text-stellar">Display Options</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-orbits">Show Orbits</Label>
              <Switch
                id="show-orbits"
                checked={showOrbits}
                onCheckedChange={setShowOrbits}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-aspects">Show Aspects</Label>
              <Switch
                id="show-aspects"
                checked={showAspects}
                onCheckedChange={setShowAspects}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-labels">Show Labels</Label>
              <Switch
                id="show-labels"
                checked={showLabels}
                onCheckedChange={setShowLabels}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-retrogrades">Show Retrogrades</Label>
              <Switch
                id="show-retrogrades"
                checked={showRetrogrades}
                onCheckedChange={setShowRetrogrades}
              />
            </div>
          </div>

          {/* Animation Controls */}
          <div className="space-y-4">
            <h4 className="font-semibold text-stellar">Animation Controls</h4>
            
            <div className="space-y-2">
              <Label htmlFor="animation-speed">Speed: {animationSpeed}x</Label>
              <Slider
                id="animation-speed"
                min={0.1}
                max={5}
                step={0.1}
                value={[animationSpeed]}
                onValueChange={([value]) => setAnimationSpeed(value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time-step">Time Step: {timeStep} day(s)</Label>
              <Slider
                id="time-step"
                min={1}
                max={7}
                step={1}
                value={[timeStep]}
                onValueChange={([value]) => setTimeStep(value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zoom-level">Zoom: {zoomLevel.toFixed(1)}x</Label>
              <Slider
                id="zoom-level"
                min={0.1}
                max={3}
                step={0.1}
                value={[zoomLevel]}
                onValueChange={([value]) => setZoomLevel(value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Real-time Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Moon Phase */}
          {moonPhase && (
            <Card className="bg-muted/20 border-stellar/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Moon className="w-6 h-6 text-stellar" />
                  <div>
                    <p className="font-semibold text-stellar">{moonPhase.phase}</p>
                    <p className="text-sm text-muted-foreground">
                      {moonPhase.illumination}% illuminated • Age: {moonPhase.age} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ISS Position */}
          {issPosition && (
            <Card className="bg-muted/20 border-nebula/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Satellite className="w-6 h-6 text-nebula" />
                  <div>
                    <p className="font-semibold text-nebula">ISS Position</p>
                    <p className="text-sm text-muted-foreground">
                      Lat: {issPosition.latitude.toFixed(2)}° • Lon: {issPosition.longitude.toFixed(2)}°
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={exportChart} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export Chart
          </Button>
          <Button onClick={resetView} variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 