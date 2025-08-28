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
    <Card className="glass-effect border-cosmic/30 hover:border-stellar/40 transition-all duration-500 animate-scale-in">
      <CardHeader>
        <CardTitle className="text-stellar font-orbitron font-bold">Select Planets</CardTitle>
        <CardDescription className="text-muted-foreground font-space">
          Choose up to {maxSelection} celestial bodies for calculation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {planets.map((planet, index) => {
            const isSelected = selectedPlanets.includes(planet.name);
            const canSelect = !isSelected && selectedPlanets.length < maxSelection;
            
            return (
              <Button
                key={planet.name}
                variant={isSelected ? "stellar" : "space"}
                className={`h-auto p-4 flex flex-col items-center gap-2 relative group animate-fade-in hover:scale-105 transition-all duration-300 ${
                  !canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => canSelect || isSelected ? onPlanetToggle(planet.name) : null}
                disabled={!canSelect && !isSelected}
              >
                <div 
                  className="text-2xl font-bold group-hover:animate-float transition-all duration-300" 
                  style={{ color: planet.color }}
                >
                  {planet.symbol}
                </div>
                <div className="text-xs font-medium text-center font-space">
                  {planet.name}
                </div>
                {isSelected && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center animate-scale-in">
                    ✓
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            );
          })}
        </div>
        {selectedPlanets.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg animate-slide-up border border-cosmic/20">
            <p className="text-sm text-muted-foreground mb-2 font-space">Selected planets:</p>
            <div className="flex flex-wrap gap-2">
              {selectedPlanets.map((planetName, index) => {
                const planet = planets.find(p => p.name === planetName);
                return planet ? (
                  <Badge key={planetName} variant="outline" className="border-stellar/40 hover-glow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
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