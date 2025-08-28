import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type PlanetPosition, type AspectData } from '@/utils/astronomy';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Filter, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultsTableProps {
  positions: PlanetPosition[];
  aspects: AspectData[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ positions, aspects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState<string>('all');
  const [showPositions, setShowPositions] = useState(true);
  const [showAspects, setShowAspects] = useState(true);
  const [sortField, setSortField] = useState<keyof PlanetPosition>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter positions based on search and planet selection
  const filteredPositions = positions.filter(pos => {
    const matchesSearch = pos.planet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pos.coordinateSystem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlanet = selectedPlanet === 'all' || pos.planet === selectedPlanet;
    return matchesSearch && matchesPlanet;
  });

  // Filter aspects based on search
  const filteredAspects = aspects.filter(aspect => {
    return aspect.planet1.toLowerCase().includes(searchTerm.toLowerCase()) ||
           aspect.planet2.toLowerCase().includes(searchTerm.toLowerCase()) ||
           aspect.aspect.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort positions
  const sortedPositions = [...filteredPositions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  // Get unique planets for filter
  const uniquePlanets = [...new Set(positions.map(pos => pos.planet))];

  // Handle sorting
  const handleSort = (field: keyof PlanetPosition) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: keyof PlanetPosition) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <Card className="card-futuristic border-neon-orange/30 hover:border-neon-orange/40">
      <CardHeader>
        <CardTitle className="text-neon-orange flex items-center gap-2 font-orbitron">
          <Eye className="w-5 h-5" />
          Results Data Table
        </CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">
          Detailed view of calculated planetary positions and aspects
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search planets, coordinates, aspects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-futuristic pl-10 border-neon-orange/30 focus:border-neon-orange"
            />
          </div>

          {/* Planet Filter */}
          <div className="flex-shrink-0">
            <select
              value={selectedPlanet}
              onChange={(e) => setSelectedPlanet(e.target.value)}
              className="input-futuristic border-neon-orange/30 focus:border-neon-orange"
            >
              <option value="all">All Planets</option>
              {uniquePlanets.map(planet => (
                <option key={planet} value={planet}>{planet}</option>
              ))}
            </select>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2">
            <Button
              variant={showPositions ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPositions(!showPositions)}
              className={showPositions ? "bg-neon-orange text-primary-foreground" : "border-neon-orange/30 text-neon-orange"}
            >
              {showPositions ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
              Positions
            </Button>
            <Button
              variant={showAspects ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAspects(!showAspects)}
              className={showAspects ? "bg-neon-orange text-primary-foreground" : "border-neon-orange/30 text-neon-orange"}
            >
              {showAspects ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
              Aspects
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg border border-neon-orange/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-orange font-orbitron">
              {positions.length}
            </div>
            <div className="text-xs text-muted-foreground font-space">Total Positions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-orange font-orbitron">
              {aspects.length}
            </div>
            <div className="text-xs text-muted-foreground font-space">Total Aspects</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-orange font-orbitron">
              {uniquePlanets.length}
            </div>
            <div className="text-xs text-muted-foreground font-space">Planets</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-orange font-orbitron">
              {filteredPositions.length}
            </div>
            <div className="text-xs text-muted-foreground font-space">Filtered</div>
          </div>
        </div>

        {/* Positions Table */}
        {showPositions && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground font-orbitron">Planetary Positions</h3>
              <Button variant="outline" size="sm" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neon-orange/20">
                    <TableHead 
                      className="cursor-pointer hover:bg-neon-orange/10 transition-colors duration-200"
                      onClick={() => handleSort('planet')}
                    >
                      <div className="flex items-center gap-1">
                        Planet
                        {getSortIcon('planet')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-neon-orange/10 transition-colors duration-200"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {getSortIcon('date')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-neon-orange/10 transition-colors duration-200"
                      onClick={() => handleSort('longitude')}
                    >
                      <div className="flex items-center gap-1">
                        Longitude
                        {getSortIcon('longitude')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-neon-orange/10 transition-colors duration-200"
                      onClick={() => handleSort('latitude')}
                    >
                      <div className="flex items-center gap-1">
                        Latitude
                        {getSortIcon('latitude')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-neon-orange/10 transition-colors duration-200"
                      onClick={() => handleSort('distance')}
                    >
                      <div className="flex items-center gap-1">
                        Distance
                        {getSortIcon('distance')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-neon-orange/10 transition-colors duration-200"
                      onClick={() => handleSort('coordinateSystem')}
                    >
                      <div className="flex items-center gap-1">
                        System
                        {getSortIcon('coordinateSystem')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPositions.map((position, index) => (
                    <TableRow key={index} className="border-muted/20 hover:bg-muted/10 transition-colors duration-200">
                      <TableCell className="font-medium font-orbitron">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPlanetSymbol(position.planet)}</span>
                          {position.planet}
                        </div>
                      </TableCell>
                      <TableCell className="font-space">
                        {position.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono">
                        {position.longitude.toFixed(2)}°
                      </TableCell>
                      <TableCell className="font-mono">
                        {position.latitude.toFixed(2)}°
                      </TableCell>
                      <TableCell className="font-mono">
                        {position.distance.toFixed(4)} AU
                      </TableCell>
                      <TableCell>
                        <Badge className="badge-futuristic text-xs">
                          {position.coordinateSystem}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Aspects Table */}
        {showAspects && aspects.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground font-orbitron">Planetary Aspects</h3>
              <Button variant="outline" size="sm" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neon-orange/20">
                    <TableHead>Planets</TableHead>
                    <TableHead>Aspect</TableHead>
                    <TableHead>Angle</TableHead>
                    <TableHead>Orb</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Strength</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAspects.map((aspect, index) => (
                    <TableRow key={index} className="border-muted/20 hover:bg-muted/10 transition-colors duration-200">
                      <TableCell className="font-medium font-orbitron">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPlanetSymbol(aspect.planet1)}</span>
                          {aspect.planet1}
                          <span className="text-muted-foreground">-</span>
                          <span className="text-lg">{getPlanetSymbol(aspect.planet2)}</span>
                          {aspect.planet2}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="badge-futuristic text-xs">
                          {aspect.aspect}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {aspect.angle.toFixed(1)}°
                      </TableCell>
                      <TableCell className="font-mono">
                        ±{aspect.orb.toFixed(1)}°
                      </TableCell>
                      <TableCell className="font-space">
                        {aspect.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`badge-futuristic text-xs ${
                            aspect.strength === 'exact' ? 'border-neon-green/50 text-neon-green' :
                            aspect.strength === 'strong' ? 'border-neon-blue/50 text-neon-blue' :
                            aspect.strength === 'moderate' ? 'border-neon-orange/50 text-neon-orange' :
                            'border-muted/50 text-muted-foreground'
                          }`}
                        >
                          {aspect.strength}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {filteredPositions.length === 0 && filteredAspects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No results match your current filters</p>
            <p className="text-xs">Try adjusting your search terms or planet selection</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to get planet symbols
const getPlanetSymbol = (planetName: string): string => {
  const planetSymbols: { [key: string]: string } = {
    'Mercury': '☿',
    'Venus': '♀',
    'Earth': '♁',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇',
    'Moon': '☽'
  };
  return planetSymbols[planetName] || '☄';
};