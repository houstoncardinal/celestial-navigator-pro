import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { planets } from '@/utils/astronomy';

interface PlanetSelectorProps {
  selectedPlanets: string[];
  onPlanetToggle: (planetName: string) => void;
}

export const PlanetSelector: React.FC<PlanetSelectorProps> = ({
  selectedPlanets,
  onPlanetToggle
}) => {
  return (
    <Card className="card-futuristic border-neon-blue/30 hover:border-neon-blue/40">
      <CardHeader>
        <CardTitle className="text-neon-blue flex items-center gap-2 font-orbitron">
          <span className="text-2xl">☿</span>
          Planet Selection
        </CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">
          Select up to 3 planets for calculation (Mercury recommended for baseline)
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {planets.map((planet) => {
            const isSelected = selectedPlanets.includes(planet.name);
            const isMercury = planet.name === 'Mercury';
            
            return (
              <button
                key={planet.name}
                onClick={() => onPlanetToggle(planet.name)}
                disabled={!isSelected && selectedPlanets.length >= 3}
                className={`
                  relative group p-3 sm:p-4 rounded-xl border transition-all duration-300
                  ${isSelected 
                    ? 'bg-neon-blue/20 border-neon-blue/50 shadow-neon-pulse' 
                    : 'bg-muted/20 border-muted/30 hover:border-neon-blue/30 hover:bg-neon-blue/10'
                  }
                  ${!isSelected && selectedPlanets.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  ${isMercury ? 'ring-2 ring-neon-orange/30' : ''}
                `}
              >
                {/* Planet Symbol */}
                <div className="text-center mb-2">
                  <div className={`
                    text-2xl sm:text-3xl mb-1 transition-transform duration-300
                    ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {planet.symbol}
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-neon-blue rounded-full animate-pulse" />
                  )}
                </div>

                {/* Planet Name */}
                <div className="text-center">
                  <h3 className={`
                    font-semibold text-sm sm:text-base font-orbitron transition-colors duration-300
                    ${isSelected ? 'text-neon-blue' : 'text-foreground group-hover:text-neon-blue'}
                  `}>
                    {planet.name}
                  </h3>
                  
                  {/* Mercury Badge */}
                  {isMercury && (
                    <Badge className="badge-futuristic mt-1 text-xs border-neon-orange/30 text-neon-orange">
                      Baseline
                    </Badge>
                  )}
                </div>

                {/* Hover Effect */}
                <div className={`
                  absolute inset-0 rounded-xl transition-opacity duration-300
                  ${isSelected ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}
                  bg-gradient-to-br from-neon-blue to-neon-cyan
                `} />
              </button>
            );
          })}
        </div>

        {/* Selection Summary */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-neon-blue/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Selected: <span className="text-neon-blue font-semibold">{selectedPlanets.length}/3</span>
            </span>
            {selectedPlanets.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedPlanets.map((planet) => (
                  <Badge 
                    key={planet} 
                    className="badge-futuristic text-xs"
                    onClick={() => onPlanetToggle(planet)}
                  >
                    {planet}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Mercury Recommendation */}
          {!selectedPlanets.includes('Mercury') && selectedPlanets.length < 3 && (
            <p className="text-xs text-neon-orange mt-2 font-space">
              💡 Consider adding Mercury for baseline validation
            </p>
          )}
          
          {/* Reference Data Preset */}
          <div className="mt-3 p-2 bg-neon-orange/10 rounded border border-neon-orange/20">
            <p className="text-xs text-neon-orange font-space mb-2">
              🎯 <strong>Reference Data Match:</strong> Select Mercury & Venus for 2013-2014 validation
            </p>
            <button
              onClick={() => {
                if (selectedPlanets.length === 0) {
                  onPlanetToggle('Mercury');
                  onPlanetToggle('Venus');
                }
              }}
              disabled={selectedPlanets.length > 0}
              className="px-2 py-1 text-xs font-medium rounded border border-neon-orange/30 text-neon-orange hover:bg-neon-orange/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Set Mercury + Venus
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};