import { coordinateSystems, type CoordinateSystem } from '@/utils/astronomy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Sun, Navigation } from 'lucide-react';

interface CoordinateSystemSelectorProps {
  selectedSystem: string;
  onSystemChange: (systemId: string) => void;
}

export function CoordinateSystemSelector({ selectedSystem, onSystemChange }: CoordinateSystemSelectorProps) {
  const getIcon = (systemId: string) => {
    switch (systemId) {
      case 'geocentric':
        return <Globe className="w-5 h-5" />;
      case 'heliocentric':
        return <Sun className="w-5 h-5" />;
      case 'right_ascension':
        return <Navigation className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-cosmic/20">
      <CardHeader>
        <CardTitle className="text-stellar font-bold">Coordinate System</CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose the reference frame for planetary positions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {coordinateSystems.map((system) => {
            const isSelected = selectedSystem === system.id;
            
            return (
              <Button
                key={system.id}
                variant={isSelected ? "stellar" : "space"}
                className="h-auto p-4 flex flex-col items-start gap-2 relative"
                onClick={() => onSystemChange(system.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  {getIcon(system.id)}
                  <span className="font-semibold">{system.name}</span>
                  {isSelected && (
                    <Badge variant="secondary" className="ml-auto">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-left opacity-80">
                  {system.description}
                </p>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-cosmic/20">
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Geocentric:</strong> Positions as seen from Earth's center</p>
            <p><strong>Heliocentric:</strong> Positions relative to the Sun</p>
            <p><strong>Right Ascension:</strong> Celestial coordinates (RA/Dec)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}