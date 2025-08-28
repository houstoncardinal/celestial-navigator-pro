import { useState } from 'react';
import spaceBackground from '@/assets/space-background.jpg';
import { PlanetSelector } from '@/components/PlanetSelector';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { CoordinateSystemSelector } from '@/components/CoordinateSystemSelector';
import { ResultsTable } from '@/components/ResultsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generateEphemeris, type PlanetPosition, type AspectData } from '@/utils/astronomy';
import { Calculator, Sparkles, Download, BarChart3 } from 'lucide-react';
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
      setResults(ephemeris);
      toast.success(`Calculated ${ephemeris.positions.length} positions and ${ephemeris.aspects.length} aspects`);
    } catch (error) {
      toast.error('Calculation failed. Please check your parameters.');
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${spaceBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-nebula opacity-60" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cosmic/20 bg-card/20 backdrop-blur-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-stellar">
                  Planetary Longitude Calculator Pro
                </h1>
                <p className="text-muted-foreground mt-2">
                  Professional astronomical ephemeris calculator for precise celestial mechanics
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-stellar/40 text-stellar">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Astronomy Grade
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              <PlanetSelector
                selectedPlanets={selectedPlanets}
                onPlanetToggle={handlePlanetToggle}
              />
              
              <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                stepDays={stepDays}
                onStepDaysChange={setStepDays}
              />
              
              <CoordinateSystemSelector
                selectedSystem={coordinateSystem}
                onSystemChange={setCoordinateSystem}
              />

              {/* Calculate Button */}
              <Card className="bg-card/50 backdrop-blur-sm border-cosmic/20">
                <CardContent className="pt-6">
                  <Button
                    variant="stellar"
                    size="lg"
                    onClick={handleCalculate}
                    disabled={isCalculating || selectedPlanets.length === 0}
                    className="w-full font-bold"
                  >
                    {isCalculating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Calculating Ephemeris...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate Planetary Positions
                      </>
                    )}
                  </Button>
                  {selectedPlanets.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Select planets to begin calculation
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {results ? (
                <>
                  {/* Summary Card */}
                  <Card className="bg-card/50 backdrop-blur-sm border-cosmic/20">
                    <CardHeader>
                      <CardTitle className="text-stellar flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Calculation Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold text-stellar">{results.positions.length}</div>
                          <div className="text-sm text-muted-foreground">Position Data Points</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold text-nebula">{results.aspects.length}</div>
                          <div className="text-sm text-muted-foreground">Planetary Aspects</div>
                        </div>
                      </div>
                      
                      <Separator className="my-4 bg-cosmic/20" />
                      
                      <div className="flex gap-2">
                        <Button variant="space" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                        <Button variant="space" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Aspects */}
                  {results.aspects.length > 0 && (
                    <Card className="bg-card/50 backdrop-blur-sm border-cosmic/20">
                      <CardHeader>
                        <CardTitle className="text-stellar">Recent Aspects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {results.aspects.slice(0, 10).map((aspect, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-nebula/40">
                                  {aspect.aspect}
                                </Badge>
                                <span className="text-sm">
                                  {aspect.planet1} - {aspect.planet2}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {aspect.date.toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {/* Enhanced Results with Table */}
                  <ResultsTable positions={results.positions} aspects={results.aspects} />
                </>
              ) : (
                /* Placeholder */
                <Card className="bg-card/50 backdrop-blur-sm border-cosmic/20">
                  <CardContent className="py-12">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center">
                        <Calculator className="w-8 h-8 text-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Ready for Calculation
                        </h3>
                        <p className="text-muted-foreground">
                          Configure your parameters and click calculate to generate precise planetary ephemeris data
                        </p>
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