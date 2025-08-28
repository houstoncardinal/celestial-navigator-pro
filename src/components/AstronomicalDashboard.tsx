import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Sun, 
  Moon, 
  Star, 
  Satellite, 
  Globe, 
  Telescope, 
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  Share2,
  Settings,
  Database,
  Zap,
  Target,
  Compass
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

interface AstronomicalDashboardProps {
  positions: PlanetPosition[];
  aspects: AspectData[];
  selectedPlanets: string[];
}

interface DashboardMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

export const AstronomicalDashboard: React.FC<AstronomicalDashboardProps> = ({
  positions,
  aspects,
  selectedPlanets
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Real-time data states
  const [moonPhase, setMoonPhase] = useState<any>(null);
  const [issPosition, setISSPosition] = useState<any>(null);
  const [astronomicalEvents, setAstronomicalEvents] = useState<any[]>([]);
  const [apod, setAPOD] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [sunTimes, setSunTimes] = useState<any>(null);
  
  // Calculated astronomical data
  const [retrogrades, setRetrogrades] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);

  // Fetch real-time data
  const fetchRealTimeData = async () => {
    setIsLoading(true);
    try {
      // Fetch multiple data sources in parallel
      const [
        moonData,
        issData,
        eventsData,
        apodData,
        sunTimesData
      ] = await Promise.all([
        FreeAstronomicalDataService.getMoonPhase(),
        FreeAstronomicalDataService.getISSPosition(),
        AstronomicalEventsService.getUpcomingEvents(),
        NASAApiService.getAstronomyPictureOfTheDay(),
        FreeAstronomicalDataService.getSunTimes(40.7128, -74.0060) // Default to NYC coordinates
      ]);

      setMoonPhase(moonData);
      setISSPosition(issData);
      setAstronomicalEvents(eventsData);
      setAPOD(apodData);
      setSunTimes(sunTimesData);
      
      setLastUpdated(new Date());
      toast.success('Dashboard data updated successfully');
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      toast.error('Failed to update dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate astronomical phenomena
  useEffect(() => {
    if (positions.length > 0) {
      const retrogradeData = calculateRetrogrades(positions);
      const stationData = calculateStations(positions);
      const phaseData = calculatePhases(positions);
      
      setRetrogrades(retrogradeData);
      setStations(stationData);
      setPhases(phaseData);
    }
  }, [positions]);

  // Initial data fetch
  useEffect(() => {
    fetchRealTimeData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchRealTimeData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Dashboard metrics
  const getDashboardMetrics = (): DashboardMetric[] => [
    {
      label: 'Active Planets',
      value: selectedPlanets.length,
      icon: <Globe className="w-4 h-4" />,
      color: 'text-blue-500'
    },
    {
      label: 'Total Aspects',
      value: aspects.length,
      icon: <Star className="w-4 h-4" />,
      color: 'text-yellow-500'
    },
    {
      label: 'Retrograde Periods',
      value: retrogrades.length,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-red-500'
    },
    {
      label: 'Station Points',
      value: stations.length,
      icon: <Target className="w-4 h-4" />,
      color: 'text-green-500'
    }
  ];

  const getCurrentPlanetStatus = () => {
    if (positions.length === 0) return [];
    
    const currentPositions = positions.filter(pos => 
      selectedPlanets.includes(pos.planet) && 
      pos.date.getTime() === positions[positions.length - 1]?.date.getTime()
    );
    
    return currentPositions.map(pos => ({
      planet: pos.planet,
      longitude: pos.longitude,
      latitude: pos.latitude,
      distance: pos.distance,
      magnitude: pos.magnitude,
      isRetrograde: retrogrades.some(r => 
        r.planet === pos.planet && 
        r.startDate <= pos.date && 
        r.endDate >= pos.date
      )
    }));
  };

  const getUpcomingAspects = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return aspects
      .filter(asp => asp.date >= today && asp.date <= nextWeek)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const getCriticalAlerts = () => {
    const alerts = [];
    
    // Check for exact aspects (orb = 0)
    const exactAspects = aspects.filter(asp => asp.orb === 0);
    if (exactAspects.length > 0) {
      alerts.push({
        type: 'exact-aspect',
        message: `${exactAspects.length} exact planetary aspect(s) detected`,
        severity: 'high',
        icon: <Star className="w-4 h-4" />
      });
    }
    
    // Check for retrogrades starting soon
    const upcomingRetrogrades = retrogrades.filter(r => 
      r.startDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
    );
    if (upcomingRetrogrades.length > 0) {
      alerts.push({
        type: 'retrograde-warning',
        message: `${upcomingRetrogrades.length} planet(s) entering retrograde soon`,
        severity: 'medium',
        icon: <TrendingUp className="w-4 h-4" />
      });
    }
    
    // Check for stations
    const upcomingStations = stations.filter(s => 
      s.date.getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000
    );
    if (upcomingStations.length > 0) {
      alerts.push({
        type: 'station-warning',
        message: `${upcomingStations.length} planet(s) changing direction soon`,
        severity: 'medium',
        icon: <Target className="w-4 h-4" />
      });
    }
    
    return alerts;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <Card className="glass-effect border-stellar/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-stellar flex items-center gap-2">
                <Telescope className="w-6 h-6" />
                Astronomical Dashboard
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Real-time celestial data and astronomical phenomena
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-stellar/30 text-stellar">
                <Clock className="w-3 h-3 mr-1" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Badge>
              <Button
                onClick={fetchRealTimeData}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Critical Alerts */}
      {getCriticalAlerts().length > 0 && (
        <Card className="border-red-500/30 bg-red-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="font-semibold text-red-500">Critical Alerts</h4>
            </div>
            <div className="space-y-2">
              {getCriticalAlerts().map((alert, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {alert.icon}
                  <span className={alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}>
                    {alert.message}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getDashboardMetrics().map((metric, index) => (
          <Card key={index} className="bg-muted/20 border-cosmic/20 hover:border-stellar/40 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <div className={`p-2 rounded-full bg-muted/50 ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="planets">Planets</TabsTrigger>
          <TabsTrigger value="phenomena">Phenomena</TabsTrigger>
          <TabsTrigger value="real-time">Real-time</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Planet Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-stellar">Current Planet Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getCurrentPlanetStatus().map((status, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={status.isRetrograde ? 'destructive' : 'secondary'}>
                          {status.planet}
                        </Badge>
                        {status.isRetrograde && (
                          <Badge variant="destructive" className="text-xs">
                            Retrograde
                          </Badge>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <p>Long: {status.longitude.toFixed(1)}°</p>
                        <p>Lat: {status.latitude.toFixed(1)}°</p>
                        <p>Mag: {status.magnitude.toFixed(1)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Aspects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-nebula">Upcoming Aspects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getUpcomingAspects().map((aspect, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-nebula/40">
                          {aspect.aspect}
                        </Badge>
                        <span className="text-sm">
                          {aspect.planet1} - {aspect.planet2}
                        </span>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {aspect.date.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Astronomical Events Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cosmic">Upcoming Astronomical Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {astronomicalEvents.slice(0, 5).map((event, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                    <div className="p-2 bg-cosmic/20 rounded-full">
                      <Calendar className="w-4 h-4 text-cosmic" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cosmic">{event.name}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <Badge variant="outline" className="border-cosmic/40">
                      {event.date.toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Planets Tab */}
        <TabsContent value="planets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Planetary Phases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-stellar">Planetary Phases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phases.slice(0, 5).map((phase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-stellar/40">
                          {phase.phase}
                        </Badge>
                        <span className="text-sm">{phase.planet}</span>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Phase: {phase.phaseAngle.toFixed(1)}°</p>
                        <p>Elongation: {phase.elongation.toFixed(1)}°</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Retrograde Periods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Retrograde Periods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {retrogrades.slice(0, 5).map((retrograde, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive">
                          {retrograde.planet}
                        </Badge>
                        <span className="text-sm">{retrograde.duration} days</span>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Start: {retrograde.startDate.toLocaleDateString()}</p>
                        <p>End: {retrograde.endDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Phenomena Tab */}
        <TabsContent value="phenomena" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Planetary Stations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-500">Planetary Stations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stations.slice(0, 5).map((station, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={station.type === 'direct' ? 'default' : 'destructive'}>
                          {station.planet}
                        </Badge>
                        <span className="text-sm capitalize">{station.type}</span>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{station.date.toLocaleDateString()}</p>
                        <p>Long: {station.longitude.toFixed(1)}°</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Aspect Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-nebula">Aspect Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['conjunction', 'opposition', 'trine', 'square', 'sextile'].map(aspectType => {
                    const count = aspects.filter(asp => asp.aspectType === aspectType).length;
                    const percentage = aspects.length > 0 ? (count / aspects.length) * 100 : 0;
                    
                    return (
                      <div key={aspectType} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm capitalize">{aspectType}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="real-time" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moon Phase */}
            {moonPhase && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-stellar">Current Moon Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-stellar/20 to-stellar/40 rounded-full flex items-center justify-center">
                      <Moon className="w-10 h-10 text-stellar" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stellar">{moonPhase.phase}</h3>
                      <p className="text-muted-foreground">
                        {moonPhase.illumination}% illuminated • Age: {moonPhase.age} days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ISS Position */}
            {issPosition && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-nebula">ISS Live Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Satellite className="w-6 h-6 text-nebula" />
                      <span className="text-sm">International Space Station</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Latitude</p>
                        <p className="font-semibold">{issPosition.latitude.toFixed(4)}°</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Longitude</p>
                        <p className="font-semibold">{issPosition.longitude.toFixed(4)}°</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {issPosition.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sun Times */}
          {sunTimes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-500">Sun Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sunrise</p>
                    <p className="font-semibold">{sunTimes.sunrise.toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sunset</p>
                    <p className="font-semibold">{sunTimes.sunset.toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Day Length</p>
                    <p className="font-semibold">{Math.round(sunTimes.dayLength)} hours</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Civil Twilight</p>
                    <p className="font-semibold">{sunTimes.civilTwilightBegin.toLocaleTimeString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* APOD */}
          {apod && (
            <Card>
              <CardHeader>
                <CardTitle className="text-cosmic">NASA Astronomy Picture of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-cosmic">{apod.title}</h4>
                  <p className="text-sm text-muted-foreground">{apod.explanation}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {apod.date}
                    {apod.copyright && (
                      <>
                        <span>•</span>
                        <span>© {apod.copyright}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={fetchRealTimeData} disabled={isLoading} className="flex-1">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Update All Data
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share Dashboard
        </Button>
      </div>
    </div>
  );
}; 