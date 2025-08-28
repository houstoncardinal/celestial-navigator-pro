import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import { type PlanetPosition, type AspectData, planets } from '@/utils/astronomy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Globe, Zap } from 'lucide-react';

interface EphemerisChartProps {
  positions: PlanetPosition[];
  aspects: AspectData[];
  selectedPlanets: string[];
}

export function EphemerisChart({ positions, aspects, selectedPlanets }: EphemerisChartProps) {
  const chartData = useMemo(() => {
    const groupedData: Record<string, any> = {};
    
    positions.forEach(pos => {
      const dateKey = pos.date.toISOString().split('T')[0];
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { date: dateKey, dateObj: pos.date };
      }
      groupedData[dateKey][`${pos.planet}_longitude`] = pos.longitude;
      groupedData[dateKey][`${pos.planet}_distance`] = pos.distance;
    });
    
    return Object.values(groupedData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [positions]);

  const aspectData = useMemo(() => {
    return aspects.map(aspect => ({
      date: aspect.date.toISOString().split('T')[0],
      dateObj: aspect.date,
      planet1: aspect.planet1,
      planet2: aspect.planet2,
      aspect: aspect.aspect,
      angle: aspect.angle,
      orb: aspect.orb,
      y: aspect.angle // for scatter plot
    }));
  }, [aspects]);

  const getPlanetColor = (planetName: string) => {
    const planet = planets.find(p => p.name === planetName);
    return planet?.color || '#ffffff';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect p-3 rounded-lg border border-cosmic/20">
          <p className="text-stellar font-semibold">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value.toFixed(2)}°`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const AspectTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-effect p-3 rounded-lg border border-cosmic/20">
          <p className="text-stellar font-semibold">{`Date: ${data.date}`}</p>
          <p className="text-nebula">{`Aspect: ${data.aspect}`}</p>
          <p className="text-cosmic">{`Planets: ${data.planet1} - ${data.planet2}`}</p>
          <p className="text-muted-foreground text-sm">{`Angle: ${data.angle.toFixed(2)}° (±${data.orb.toFixed(2)}°)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-effect border-cosmic/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-stellar flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Ephemeris Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="longitude" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/20">
            <TabsTrigger value="longitude" className="font-space">
              <Globe className="w-4 h-4 mr-2" />
              Longitude
            </TabsTrigger>
            <TabsTrigger value="distance" className="font-space">
              <Zap className="w-4 h-4 mr-2" />
              Distance
            </TabsTrigger>
            <TabsTrigger value="aspects" className="font-space">
              <TrendingUp className="w-4 h-4 mr-2" />
              Aspects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="longitude" className="space-y-4">
            <div className="h-96 animate-scale-in">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--cosmic-purple) / 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tick={{ fontFamily: 'Space Grotesk' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tick={{ fontFamily: 'Space Grotesk' }}
                    label={{ value: 'Longitude (°)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: 'Space Grotesk' }} />
                  
                  {selectedPlanets.map((planetName, index) => (
                    <Line
                      key={planetName}
                      type="monotone"
                      dataKey={`${planetName}_longitude`}
                      stroke={getPlanetColor(planetName)}
                      strokeWidth={2}
                      dot={{ r: 3, fill: getPlanetColor(planetName) }}
                      activeDot={{ r: 5, stroke: getPlanetColor(planetName), strokeWidth: 2 }}
                      name={planetName}
                    />
                  ))}
                  
                  {/* Reference lines for key angles */}
                  <ReferenceLine y={0} stroke="hsl(var(--stellar-gold) / 0.5)" strokeDasharray="5 5" />
                  <ReferenceLine y={90} stroke="hsl(var(--cosmic-blue) / 0.5)" strokeDasharray="5 5" />
                  <ReferenceLine y={180} stroke="hsl(var(--nebula-violet) / 0.5)" strokeDasharray="5 5" />
                  <ReferenceLine y={270} stroke="hsl(var(--cosmic-blue) / 0.5)" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="distance" className="space-y-4">
            <div className="h-96 animate-scale-in">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--cosmic-purple) / 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tick={{ fontFamily: 'Space Grotesk' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tick={{ fontFamily: 'Space Grotesk' }}
                    label={{ value: 'Distance (AU)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: 'Space Grotesk' }} />
                  
                  {selectedPlanets.map((planetName) => (
                    <Line
                      key={planetName}
                      type="monotone"
                      dataKey={`${planetName}_distance`}
                      stroke={getPlanetColor(planetName)}
                      strokeWidth={2}
                      dot={{ r: 3, fill: getPlanetColor(planetName) }}
                      activeDot={{ r: 5, stroke: getPlanetColor(planetName), strokeWidth: 2 }}
                      name={`${planetName} Distance`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="aspects" className="space-y-4">
            {aspectData.length > 0 ? (
              <div className="h-96 animate-scale-in">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={aspectData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--cosmic-purple) / 0.2)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tick={{ fontFamily: 'Space Grotesk' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tick={{ fontFamily: 'Space Grotesk' }}
                      label={{ value: 'Aspect Angle (°)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<AspectTooltip />} />
                    <Scatter 
                      dataKey="y" 
                      fill="hsl(var(--nebula-violet))" 
                      stroke="hsl(var(--stellar-gold))"
                      strokeWidth={1}
                    />
                    
                    {/* Reference lines for major aspects */}
                    <ReferenceLine y={0} stroke="hsl(var(--stellar-gold))" label="Conjunction" />
                    <ReferenceLine y={60} stroke="hsl(var(--cosmic-blue))" label="Sextile" />
                    <ReferenceLine y={90} stroke="hsl(var(--destructive))" label="Square" />
                    <ReferenceLine y={120} stroke="hsl(var(--cosmic-blue))" label="Trine" />
                    <ReferenceLine y={180} stroke="hsl(var(--destructive))" label="Opposition" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No aspects found in the selected time range</p>
                  <p className="text-sm text-muted-foreground">Try extending the date range or reducing the orb tolerance</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Legend for aspect significance */}
        <div className="mt-4 p-3 glass-effect rounded-lg border border-cosmic/20">
          <h4 className="text-sm font-semibold text-stellar mb-2">Aspect Legend</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-stellar/40">
              0° Conjunction ☌
            </Badge>
            <Badge variant="outline" className="border-cosmic/40">
              60° Sextile ⚹
            </Badge>
            <Badge variant="outline" className="border-destructive/40">
              90° Square □
            </Badge>
            <Badge variant="outline" className="border-cosmic/40">
              120° Trine △
            </Badge>
            <Badge variant="outline" className="border-destructive/40">
              180° Opposition ☍
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}