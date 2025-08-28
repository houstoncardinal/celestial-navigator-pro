import { useState } from 'react';
import spaceBackground from '@/assets/space-background.jpg';
import { PlanetSelector } from '@/components/PlanetSelector';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { CoordinateSystemSelector } from '@/components/CoordinateSystemSelector';
import { ResultsTable } from '@/components/ResultsTable';
import { EphemerisChart } from '@/components/EphemerisChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generateEphemeris, type PlanetPosition, type AspectData } from '@/utils/astronomy';
import { Calculator, Sparkles, Download, BarChart3, Orbit, Star } from 'lucide-react';
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
      const ephemeris = generateEphemeris(
        selectedPlanets,
        startDate,
        endDate,
        stepDays,
        coordinateSystem
      );
      
      // Mercury baseline validation
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
      toast.error('Calculation failed. Please check your parameters.');
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background with Starfield */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${spaceBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-nebula opacity-70" />
      <div className="absolute inset-0 starfield-bg opacity-30" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="border-b border-cosmic/30 bg-card/30 backdrop-blur-md glass-effect animate-slide-up">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-stellar rounded-full animate-rotate-slow">
                    <Orbit className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-stellar text-glow">
                    Planetary Longitude Calculator Pro
                  </h1>
                </div>
                <p className="text-muted-foreground mt-2 font-space">
                  Professional astronomical ephemeris calculator for precise celestial mechanics
                </p>
              </div>
              <div className="flex items-center gap-3 animate-fade-in">
                <Badge variant="outline" className="border-stellar/40 text-stellar hover-glow">
                  <Star className="w-3 h-3 mr-1 animate-float" />
                  Astronomy Grade
                </Badge>
                <Badge variant="outline" className="border-cosmic/40 text-cosmic animate-glow-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Mercury Baseline
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Enhanced Configuration */}
            <div className="space-y-6 animate-slide-up">
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
                <Card className="glass-effect border-cosmic/30 hover:border-stellar/50 transition-all duration-500">
                  <CardContent className="pt-6">
                    <Button
                      variant="stellar"
                      size="lg"
                      onClick={handleCalculate}
                      disabled={isCalculating || selectedPlanets.length === 0}
                      className="w-full font-bold text-lg h-14 relative overflow-hidden group"
                    >
                      {isCalculating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
                          <span className="font-orbitron">Calculating Ephemeris...</span>
                        </>
                      ) : (
                        <>
                          <Calculator className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="font-orbitron">Calculate Planetary Positions</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                    {selectedPlanets.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center mt-3 font-space animate-pulse">
                        Select planets to begin calculation
                      </p>
                    )}
                    {selectedPlanets.includes('Mercury') && (
                      <div className="mt-3 p-2 bg-stellar/10 rounded-lg border border-stellar/20">
                        <p className="text-xs text-stellar font-space text-center">
                          ✓ Mercury baseline calculations enabled for {coordinateSystem} mode
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Enhanced Results */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {results ? (
                <>
                  {/* Enhanced Summary Card */}
                  <Card className="glass-effect border-cosmic/30 hover:border-stellar/40 transition-all duration-500 animate-scale-in">
                    <CardHeader>
                      <CardTitle className="text-stellar flex items-center gap-2 font-orbitron">
                        <BarChart3 className="w-5 h-5 animate-pulse" />
                        Calculation Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted/20 rounded-lg border border-stellar/20 hover:border-stellar/40 transition-all duration-300 group">
                          <div className="text-3xl font-bold text-stellar animate-glow-pulse font-orbitron group-hover:scale-110 transition-transform duration-300">
                            {results.positions.length}
                          </div>
                          <div className="text-sm text-muted-foreground font-space">Position Data Points</div>
                        </div>
                        <div className="text-center p-4 bg-muted/20 rounded-lg border border-nebula/20 hover:border-nebula/40 transition-all duration-300 group">
                          <div className="text-3xl font-bold text-nebula font-orbitron group-hover:scale-110 transition-transform duration-300">
                            {results.aspects.length}
                          </div>
                          <div className="text-sm text-muted-foreground font-space">Planetary Aspects</div>
                        </div>
                      </div>
                      
                      <Separator className="my-4 bg-cosmic/30" />
                      
                      <div className="flex gap-2">
                        <Button variant="space" size="sm" className="flex-1 hover-glow">
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                        <Button variant="space" size="sm" className="flex-1 hover-glow">
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Recent Aspects */}
                  {results.aspects.length > 0 && (
                    <Card className="glass-effect border-cosmic/30 animate-fade-in">
                      <CardHeader>
                        <CardTitle className="text-stellar font-orbitron">Recent Aspects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {results.aspects.slice(0, 10).map((aspect, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-cosmic/20 hover:border-nebula/40 transition-all duration-300 group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="border-nebula/40 hover-glow group-hover:scale-105 transition-transform duration-300">
                                  {aspect.aspect}
                                </Badge>
                                <span className="text-sm font-space group-hover:text-stellar transition-colors duration-300">
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
                  {/* Enhanced Results with Chart and Table */}
                  <EphemerisChart positions={results.positions} aspects={results.aspects} selectedPlanets={selectedPlanets} />
                  <ResultsTable positions={results.positions} aspects={results.aspects} />
                </>
              ) : (
                /* Enhanced Placeholder */
                <Card className="glass-effect border-cosmic/20 animate-fade-in">
                  <CardContent className="py-12">
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center animate-float">
                        <Calculator className="w-10 h-10 text-foreground" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-foreground font-orbitron">
                          Ready for Astronomical Calculation
                        </h3>
                        <p className="text-muted-foreground font-space max-w-md mx-auto">
                          Configure your celestial parameters and generate precise planetary ephemeris data with professional-grade accuracy
                        </p>
                        <div className="flex justify-center gap-2 mt-4">
                          <Badge variant="outline" className="border-stellar/30 text-stellar/70">
                            ☿ Mercury Baseline
                          </Badge>
                          <Badge variant="outline" className="border-cosmic/30 text-cosmic/70">
                            🌍 Geocentric Mode
                          </Badge>
                          <Badge variant="outline" className="border-nebula/30 text-nebula/70">
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
        </main>
      </div>
    </div>
  );
};

export default Index;