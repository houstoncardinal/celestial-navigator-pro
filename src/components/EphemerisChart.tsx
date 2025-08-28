import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type PlanetPosition, type AspectData } from '@/utils/astronomy';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Globe, Star, Zap } from 'lucide-react';

interface EphemerisChartProps {
  positions: PlanetPosition[];
  aspects: AspectData[];
  selectedPlanets: string[];
}

export const EphemerisChart: React.FC<EphemerisChartProps> = ({
  positions,
  aspects,
  selectedPlanets
}) => {
  // Prepare chart data for selected planets
  const chartData = positions
    .filter(pos => selectedPlanets.includes(pos.planet))
    .map(pos => ({
      date: pos.date.toLocaleDateString(),
      [pos.planet]: pos.longitude,
      timestamp: pos.date.getTime()
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Get unique planets for chart lines
  const planetsInChart = [...new Set(positions.map(pos => pos.planet))].filter(planet => 
    selectedPlanets.includes(planet)
  );

  // Color mapping for planets
  const planetColors: { [key: string]: string } = {
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

  // Calculate statistics
  const totalPositions = positions.length;
  const totalAspects = aspects.length;
  const dateRange = positions.length > 0 ? {
    start: new Date(Math.min(...positions.map(p => p.date.getTime()))),
    end: new Date(Math.max(...positions.map(p => p.date.getTime())))
  } : null;

  return (
    <Card className="card-futuristic border-neon-green/30 hover:border-neon-green/40">
      <CardHeader>
        <CardTitle className="text-neon-green flex items-center gap-2 font-orbitron">
          <TrendingUp className="w-5 h-5" />
          Planetary Motion Chart
        </CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">
          Visual representation of planetary longitudes over time
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border border-neon-green/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green font-orbitron">
              {totalPositions}
            </div>
            <div className="text-xs text-muted-foreground font-space">Data Points</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green font-orbitron">
              {planetsInChart.length}
            </div>
            <div className="text-xs text-muted-foreground font-space">Planets</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green font-orbitron">
              {totalAspects}
            </div>
            <div className="text-xs text-muted-foreground font-space">Aspects</div>
          </div>
        </div>

        {/* Date Range Info */}
        {dateRange && (
          <div className="p-3 bg-muted/10 rounded-lg border border-muted/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                <Globe className="w-4 h-4 inline mr-1" />
                Date Range
              </span>
              <span className="text-foreground font-medium">
                {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Chart Container */}
        <div className="w-full h-80 sm:h-96 bg-muted/10 rounded-lg border border-muted/20 p-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground) / 0.6)"
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--muted-foreground) / 0.8)' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground) / 0.6)"
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--muted-foreground) / 0.8)' }}
                  label={{ 
                    value: 'Longitude (degrees)', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: 'hsl(var(--muted-foreground) / 0.8)',
                    fontSize: 12
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '10px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                {planetsInChart.map((planet, index) => (
                  <Line
                    key={planet}
                    type="monotone"
                    dataKey={planet}
                    stroke={planetColors[planet] || '#8884d8'}
                    strokeWidth={2}
                    dot={{ fill: planetColors[planet] || '#8884d8', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: planetColors[planet] || '#8884d8', strokeWidth: 2 }}
                    name={planet}
                    animationDuration={1000 + index * 200}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No chart data available</p>
                <p className="text-xs">Select planets and calculate positions first</p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Legend */}
        {planetsInChart.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground font-orbitron">Planet Legend</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {planetsInChart.map((planet) => (
                <div key={planet} className="flex items-center gap-2 p-2 bg-muted/20 rounded border border-muted/30">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: planetColors[planet] || '#8884d8' }}
                  />
                  <span className="text-xs font-medium font-space">{planet}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Aspects Summary */}
        {aspects.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground font-orbitron flex items-center gap-2">
              <Star className="w-4 h-4" />
              Recent Planetary Aspects
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {aspects.slice(0, 6).map((aspect, index) => (
                <div 
                  key={index}
                  className="p-3 bg-muted/20 rounded-lg border border-muted/30 hover:border-neon-green/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="badge-futuristic text-xs">
                      {aspect.aspect}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-space">
                      {aspect.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium font-space">
                    {aspect.planet1} - {aspect.planet2}
                  </div>
                  <div className="text-xs text-muted-foreground font-space">
                    Orb: {aspect.orb.toFixed(1)}° • {aspect.strength}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-muted/20">
          <button className="px-4 py-2 text-sm font-medium rounded-lg border border-neon-green/30 text-neon-green hover:bg-neon-green/10 hover:border-neon-green/50 transition-all duration-300">
            <Zap className="w-4 h-4 inline mr-2" />
            Export Chart
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg border border-muted/30 text-muted-foreground hover:bg-muted/20 hover:border-muted/50 transition-all duration-300">
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Full Screen
          </button>
        </div>
      </CardContent>
    </Card>
  );
};