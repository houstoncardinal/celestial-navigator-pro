import { useState } from 'react';
import { planets, type PlanetData } from '@/utils/astronomy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlanetSelectorProps {
  selectedPlanets: string[];
  onPlanetToggle: (planetName: string) => void;
  maxSelection?: number;
}

export function PlanetSelector({ selectedPlanets, onPlanetToggle, maxSelection = 3 }: PlanetSelectorProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-cosmic/20">
      <CardHeader>
        <CardTitle className="text-stellar font-bold">Select Planets</CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose up to {maxSelection} celestial bodies for calculation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {planets.map((planet) => {
            const isSelected = selectedPlanets.includes(planet.name);
            const canSelect = !isSelected && selectedPlanets.length < maxSelection;
            
            return (
              <Button
                key={planet.name}
                variant={isSelected ? "stellar" : "space"}
                className={`h-auto p-4 flex flex-col items-center gap-2 relative ${
                  !canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => canSelect || isSelected ? onPlanetToggle(planet.name) : null}
                disabled={!canSelect && !isSelected}
              >
                <div 
                  className="text-2xl font-bold" 
                  style={{ color: planet.color }}
                >
                  {planet.symbol}
                </div>
                <div className="text-xs font-medium text-center">
                  {planet.name}
                </div>
                {isSelected && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
        {selectedPlanets.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Selected planets:</p>
            <div className="flex flex-wrap gap-2">
              {selectedPlanets.map((planetName) => {
                const planet = planets.find(p => p.name === planetName);
                return planet ? (
                  <Badge key={planetName} variant="outline" className="border-stellar/40">
                    <span style={{ color: planet.color }} className="mr-1">{planet.symbol}</span>
                    {planet.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}