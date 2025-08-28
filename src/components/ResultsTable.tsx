import { useState } from 'react';
import { type PlanetPosition, type AspectData } from '@/utils/astronomy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, Image } from 'lucide-react';

interface ResultsTableProps {
  positions: PlanetPosition[];
  aspects: AspectData[];
}

export function ResultsTable({ positions, aspects }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 50;

  const groupedPositions = positions.reduce((acc, position) => {
    const dateKey = position.date.toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(position);
    return acc;
  }, {} as Record<string, PlanetPosition[]>);

  const dates = Object.keys(groupedPositions).sort();
  const currentPositions = dates.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const exportToCSV = () => {
    const headers = ['Date', 'Planet', 'Longitude', 'Latitude', 'Distance'];
    const csvContent = [
      headers.join(','),
      ...positions.map(pos => [
        pos.date.toISOString().split('T')[0],
        pos.planet,
        pos.longitude,
        pos.latitude,
        pos.distance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planetary_ephemeris.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-cosmic/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-stellar">Ephemeris Results</CardTitle>
          <div className="flex gap-2">
            <Button variant="space" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="space" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="positions">Positions ({positions.length})</TabsTrigger>
            <TabsTrigger value="aspects">Aspects ({aspects.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="positions" className="space-y-4">
            <ScrollArea className="h-96 rounded-md border border-cosmic/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-cosmic/20">
                    <TableHead className="text-stellar">Date</TableHead>
                    <TableHead className="text-stellar">Planet</TableHead>
                    <TableHead className="text-stellar">Longitude</TableHead>
                    <TableHead className="text-stellar">Latitude</TableHead>
                    <TableHead className="text-stellar">Distance (AU)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPositions.map(dateKey => 
                    groupedPositions[dateKey].map((position, index) => (
                      <TableRow key={`${dateKey}-${position.planet}-${index}`} className="border-cosmic/20">
                        <TableCell className="font-mono text-xs">{dateKey}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-stellar/40">
                            {position.planet}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{position.longitude.toFixed(2)}°</TableCell>
                        <TableCell className="font-mono">{position.latitude.toFixed(2)}°</TableCell>
                        <TableCell className="font-mono">{position.distance.toFixed(3)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            
            {dates.length > itemsPerPage && (
              <div className="flex justify-between items-center">
                <Button 
                  variant="space" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {Math.ceil(dates.length / itemsPerPage)}
                </span>
                <Button 
                  variant="space" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.min(Math.ceil(dates.length / itemsPerPage) - 1, currentPage + 1))}
                  disabled={currentPage >= Math.ceil(dates.length / itemsPerPage) - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="aspects" className="space-y-4">
            <ScrollArea className="h-96 rounded-md border border-cosmic/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-cosmic/20">
                    <TableHead className="text-stellar">Date</TableHead>
                    <TableHead className="text-stellar">Planets</TableHead>
                    <TableHead className="text-stellar">Aspect</TableHead>
                    <TableHead className="text-stellar">Angle</TableHead>
                    <TableHead className="text-stellar">Orb</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aspects.map((aspect, index) => (
                    <TableRow key={index} className="border-cosmic/20">
                      <TableCell className="font-mono text-xs">
                        {aspect.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="border-cosmic/40 text-xs">
                            {aspect.planet1}
                          </Badge>
                          <Badge variant="outline" className="border-cosmic/40 text-xs">
                            {aspect.planet2}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-nebula/40">
                          {aspect.aspect}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{aspect.angle}°</TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        ±{aspect.orb}°
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}