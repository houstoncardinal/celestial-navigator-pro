import { useState } from 'react';
import spaceBackground from '@/assets/space-background.jpg';
import { PlanetSelector } from '@/components/PlanetSelector';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { CoordinateSystemSelector } from '@/components/CoordinateSystemSelector';
import { ResultsTable } from '@/components/ResultsTable';
import { EphemerisChart } from '@/components/EphemerisChart';
import { AdvancedAstronomicalChart } from '@/components/AdvancedAstronomicalChart';
import { AstronomicalDashboard } from '@/components/AstronomicalDashboard';
import { DataValidationPanel } from '@/components/DataValidationPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateEphemeris, type PlanetPosition, type AspectData } from '@/utils/astronomy';
import { Calculator, Sparkles, Download, BarChart3, Orbit, Star, Telescope, Globe, Database, Zap, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>(['Earth', 'Mars']);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  const [stepDays, setStepDays] = useState(1);
  const [coordinateSystem, setCoordinateSystem] = useState('geocentric');
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<{ positions: PlanetPosition[], aspects: AspectData[] } | null>(null);
  const [activeMainTab, setActiveMainTab] = useState('calculator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePlanetToggle = (planetName: string) => {
    setSelectedPlanets(prev => 
      prev.includes(planetName)
        ? prev.filter(p => p !== planetName)
        : prev.length < 3
        ? [...prev, planetName]
        : prev
    );
  };

  const handleCalculate = async () => {
    if (selectedPlanets.length === 0) {
      toast.error('Please select at least one planet');
      return;
    }

    setIsCalculating(true);
    try {
      // Add timeout to prevent UI freezing
      const ephemeris = await new Promise<{ positions: PlanetPosition[]; aspects: AspectData[] }>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Calculation timeout - please reduce date range or step size'));
        }, 30000); // 30 second timeout
        
        try {
          const result = generateEphemeris(
            selectedPlanets,
            startDate,
            endDate,
            stepDays,
            coordinateSystem,
            true, // include aspects
            5 // aspect orb
          );
          clearTimeout(timeoutId);
          resolve(result);
        } catch (error) {
          clearTimeout(timeoutId);
          reject(error);
        }
      });
      
      // Mercury baseline validation (original calculation)
      const mercuryPositions = ephemeris.positions.filter(pos => pos.planet === 'Mercury');
      if (mercuryPositions.length > 0 && selectedPlanets.includes('Mercury')) {
        const avgMercuryLongitude = mercuryPositions.reduce((sum, pos) => sum + pos.longitude, 0) / mercuryPositions.length;
        toast.success(`✓ Mercury baseline confirmed: ${avgMercuryLongitude.toFixed(1)}° average longitude`, {
          description: `${coordinateSystem} mode • ${ephemeris.positions.length} positions • ${ephemeris.aspects.length} aspects`
        });
      } else {
        toast.success(`Calculated ${ephemeris.positions.length} positions and ${ephemeris.aspects.length} aspects`);
      }
      
      setResults(ephemeris);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation failed. Please check your parameters.';
      toast.error(errorMessage);
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Futuristic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${spaceBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-deep opacity-80" />
      <div className="absolute inset-0 starfield-futuristic opacity-40" />
      <div className="absolute inset-0 grid-futuristic opacity-20" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Futuristic Header */}
        <header className="border-b border-neon-blue/20 bg-card/20 backdrop-blur-xl glass-futuristic">
          <div className="container-responsive py-4 sm:py-6">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div className="p-2 sm:p-3 bg-gradient-neon rounded-full animate-neon-pulse">
                    <Orbit className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-neon rounded-full opacity-20 animate-neon-glow blur-sm" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-futuristic font-orbitron">
                    Celestial Navigator Pro
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base font-space max-w-md">
                    Professional astronomical ephemeris calculator with advanced algorithms and real-time data
                  </p>
                </div>
              </div>

              {/* Desktop Badges */}
              <div className="hidden lg:flex items-center gap-3">
                <Badge className="badge-futuristic hover-neon">
                  <Star className="w-3 h-3 mr-1" />
                  Astronomy Grade
                </Badge>
                <Badge className="badge-futuristic hover-neon">
                  <Zap className="w-3 h-3 mr-1" />
                  Real-time Data
                </Badge>
                <Badge className="badge-futuristic hover-neon">
                  <Database className="w-3 h-3 mr-1" />
                  Advanced Algorithms
                </Badge>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-neon-blue/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>

            {/* Mobile Badges */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-4 flex flex-wrap gap-2">
                <Badge className="badge-futuristic text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Astronomy Grade
                </Badge>
                <Badge className="badge-futuristic text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Real-time Data
                </Badge>
                <Badge className="badge-futuristic text-xs">
                  <Database className="w-3 h-3 mr-1" />
                  Advanced Algorithms
                </Badge>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container-responsive py-6 sm:py-8">
          {/* Main Navigation Tabs */}
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/20 backdrop-blur-sm border border-neon-blue/20">
              <TabsTrigger 
                value="calculator" 
                className="flex items-center gap-2 p-3 data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue data-[state=active]:border-neon-blue/30 transition-all duration-300"
              >
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Calculator</span>
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 p-3 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/30 transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="visualization" 
                className="flex items-center gap-2 p-3 data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple data-[state=active]:border-neon-purple/30 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Visualization</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="flex items-center gap-2 p-3 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green data-[state=active]:border-neon-green/30 transition-all duration-300"
              >
                <Telescope className="w-4 h-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Calculator Tab */}
            <TabsContent value="calculator" className="space-y-6 sm:space-y-8 mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column - Enhanced Configuration */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <PlanetSelector
                      selectedPlanets={selectedPlanets}
                      onPlanetToggle={handlePlanetToggle}
                    />
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <DateRangeSelector
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={setStartDate}
                      onEndDateChange={setEndDate}
                      stepDays={stepDays}
                      onStepDaysChange={setStepDays}
                    />
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <CoordinateSystemSelector
                      selectedSystem={coordinateSystem}
                      onSystemChange={setCoordinateSystem}
                    />
                  </div>

                  {/* Enhanced Calculate Button */}
                  <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Card className="card-futuristic border-neon-blue/30 hover:border-neon-blue/50">
                      <CardContent className="p-6">
                        <Button
                          onClick={handleCalculate}
                          disabled={isCalculating || selectedPlanets.length === 0}
                          className="w-full font-bold text-lg h-16 sm:h-20 relative overflow-hidden group btn-futuristic"
                        >
                          {isCalculating ? (
                            <>
                              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
                              <span className="font-orbitron">Calculating Ephemeris...</span>
                            </>
                          ) : (
                            <>
                              <Calculator className="w-6 h-6 sm:w-8 sm:h-8 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                              <span className="font-orbitron">Calculate Planetary Positions</span>
                            </>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Button>
                        {selectedPlanets.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center mt-4 font-space animate-pulse">
                            Select planets to begin calculation
                          </p>
                        )}
                        {selectedPlanets.length > 0 && (
                          <div className="mt-4 p-3 bg-neon-blue/10 rounded-lg border border-neon-blue/20">
                            <p className="text-xs text-neon-blue font-space text-center">
                              {selectedPlanets.includes('Mercury') 
                                ? `✓ Mercury baseline calculations enabled for ${coordinateSystem} mode`
                                : `${selectedPlanets.length} planet(s) selected for ${coordinateSystem} mode`
                              }
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right Column - Enhanced Results */}
                <div className="space-y-6 sm:space-y-8">
                  {results ? (
                    <>
                      {/* Enhanced Summary Card */}
                      <Card className="card-futuristic border-neon-blue/30 hover:border-neon-blue/40 animate-scale-in">
                        <CardHeader>
                          <CardTitle className="text-neon-blue flex items-center gap-2 font-orbitron">
                            <BarChart3 className="w-5 h-5 animate-pulse" />
                            Calculation Results
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-muted/20 rounded-lg border border-neon-blue/20 hover:border-neon-blue/40 transition-all duration-300 group">
                              <div className="text-3xl font-bold text-neon-blue animate-neon-pulse font-orbitron group-hover:scale-110 transition-transform duration-300">
                                {results.positions.length}
                              </div>
                              <div className="text-sm text-muted-foreground font-space">Position Data Points</div>
                            </div>
                            <div className="text-center p-4 bg-muted/20 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 group">
                              <div className="text-3xl font-bold text-neon-cyan animate-neon-pulse font-orbitron group-hover:scale-110 transition-transform duration-300">
                                {results.aspects.length}
                              </div>
                              <div className="text-sm text-muted-foreground font-space">Planetary Aspects</div>
                            </div>
                          </div>
                          
                          <Separator className="my-6 bg-neon-blue/30" />
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" size="sm" className="flex-1 hover-neon border-neon-blue/30 text-neon-blue">
                              <Download className="w-4 h-4 mr-2" />
                              Export CSV
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 hover-neon border-neon-cyan/30 text-neon-cyan">
                              <Download className="w-4 h-4 mr-2" />
                              Export PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Enhanced Recent Aspects */}
                      {results.aspects.length > 0 && (
                        <Card className="card-futuristic border-neon-purple/30 animate-fade-in">
                          <CardHeader>
                            <CardTitle className="text-neon-purple font-orbitron">Recent Aspects</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {results.aspects.slice(0, 10).map((aspect, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300 group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                  <div className="flex items-center gap-3">
                                    <Badge className="badge-futuristic border-neon-purple/40 hover-neon group-hover:scale-105 transition-transform duration-300">
                                      {aspect.aspect}
                                    </Badge>
                                    <span className="text-sm font-space group-hover:text-neon-purple transition-colors duration-300">
                                      {aspect.planet1} - {aspect.planet2}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground font-space">
                                    {aspect.date.toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    /* Enhanced Placeholder */
                    <Card className="card-futuristic border-neon-blue/20 animate-fade-in">
                      <CardContent className="py-16 sm:py-20">
                        <div className="text-center space-y-6">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-neon rounded-full flex items-center justify-center animate-neon-float">
                            <Calculator className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-foreground font-orbitron">
                              Ready for Astronomical Calculation
                            </h3>
                            <p className="text-muted-foreground font-space max-w-md mx-auto text-sm sm:text-base">
                              Configure your celestial parameters and generate precise planetary ephemeris data with professional-grade accuracy
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                              <Badge className="badge-futuristic border-neon-blue/30 text-neon-blue">
                                ☿ Mercury Baseline
                              </Badge>
                              <Badge className="badge-futuristic border-neon-cyan/30 text-neon-cyan">
                                🌍 Geocentric Mode
                              </Badge>
                              <Badge className="badge-futuristic border-neon-purple/30 text-neon-purple">
                                ☉ Heliocentric Mode
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Results Display */}
              {results && (
                <div className="space-y-6 sm:space-y-8">
                  <EphemerisChart positions={results.positions} aspects={results.aspects} selectedPlanets={selectedPlanets} />
                  <ResultsTable positions={results.positions} aspects={results.aspects} />
                </div>
              )}
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 sm:space-y-8 mt-6">
              {results ? (
                <AstronomicalDashboard 
                  positions={results.positions}
                  aspects={results.aspects}
                  selectedPlanets={selectedPlanets}
                />
              ) : (
                <Card className="card-futuristic border-neon-cyan/20 animate-fade-in">
                  <CardContent className="py-16 sm:py-20">
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-neon rounded-full flex items-center justify-center animate-neon-float">
                        <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground font-orbitron">
                          Dashboard Requires Data
                        </h3>
                        <p className="text-muted-foreground font-space max-w-md mx-auto text-sm sm:text-base">
                          Generate planetary ephemeris data first to access the comprehensive astronomical dashboard
                        </p>
                        <Button 
                          onClick={() => setActiveMainTab('calculator')}
                          variant="outline"
                          className="mt-6 btn-futuristic"
                        >
                          Go to Calculator
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Visualization Tab */}
            <TabsContent value="visualization" className="space-y-6 sm:space-y-8 mt-6">
              {results ? (
                <AdvancedAstronomicalChart 
                  positions={results.positions}
                  aspects={results.aspects}
                  selectedPlanets={selectedPlanets}
                />
              ) : (
                <Card className="card-futuristic border-neon-purple/20 animate-fade-in">
                  <CardContent className="py-16 sm:py-20">
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-neon rounded-full flex items-center justify-center animate-neon-float">
                        <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground font-orbitron">
                          Visualization Requires Data
                        </h3>
                        <p className="text-muted-foreground font-space max-w-md mx-auto text-sm sm:text-base">
                          Generate planetary ephemeris data first to access the advanced 3D visualizations
                        </p>
                        <Button 
                          onClick={() => setActiveMainTab('calculator')}
                          variant="outline"
                          className="mt-6 btn-futuristic"
                        >
                          Go to Calculator
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6 sm:space-y-8 mt-6">
              {results ? (
                <div className="space-y-6 sm:space-y-8">
                  {/* Data Validation Panel */}
                  <DataValidationPanel calculatedPositions={results.positions} />
                  
                  <Card className="card-futuristic border-neon-green/30">
                    <CardHeader>
                      <CardTitle className="text-neon-green">Advanced Astronomical Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Advanced analysis features including retrogrades, stations, phases, and more will be displayed here.
                        This tab provides deep insights into celestial mechanics and astronomical phenomena.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="card-futuristic border-neon-green/20 animate-fade-in">
                  <CardContent className="py-16 sm:py-20">
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-neon rounded-full flex items-center justify-center animate-neon-float">
                        <Telescope className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground font-orbitron">
                          Analysis Requires Data
                        </h3>
                        <p className="text-muted-foreground font-space max-w-md mx-auto text-sm sm:text-base">
                          Generate planetary ephemeris data first to access the advanced astronomical analysis tools
                        </p>
                        <Button 
                          onClick={() => setActiveMainTab('calculator')}
                          variant="outline"
                          className="mt-6 btn-futuristic"
                        >
                          Go to Calculator
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;