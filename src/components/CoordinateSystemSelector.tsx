import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { coordinateSystems } from '@/utils/astronomy';
import { Globe, Compass, Satellite, Orbit } from 'lucide-react';

interface CoordinateSystemSelectorProps {
  selectedSystem: string;
  onSystemChange: (system: string) => void;
}

export const CoordinateSystemSelector: React.FC<CoordinateSystemSelectorProps> = ({
  selectedSystem,
  onSystemChange
}) => {
  const getSystemIcon = (systemName: string) => {
    switch (systemName.toLowerCase()) {
      case 'geocentric':
        return <Globe className="w-4 h-4" />;
      case 'heliocentric':
        return <Orbit className="w-4 h-4" />;
      case 'barycentric':
        return <Compass className="w-4 h-4" />;
      case 'topocentric':
        return <Satellite className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getSystemColor = (systemName: string) => {
    switch (systemName.toLowerCase()) {
      case 'geocentric':
        return 'border-neon-blue/30 text-neon-blue hover:border-neon-blue/50';
      case 'heliocentric':
        return 'border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan/50';
      case 'barycentric':
        return 'border-neon-purple/30 text-neon-purple hover:border-neon-purple/50';
      case 'topocentric':
        return 'border-neon-green/30 text-neon-green hover:border-neon-green/50';
      default:
        return 'border-neon-blue/30 text-neon-blue hover:border-neon-blue/50';
    }
  };

  const getSystemBgColor = (systemName: string) => {
    switch (systemName.toLowerCase()) {
      case 'geocentric':
        return 'bg-neon-blue/10';
      case 'heliocentric':
        return 'bg-neon-cyan/10';
      case 'barycentric':
        return 'bg-neon-purple/10';
      case 'topocentric':
        return 'bg-neon-green/10';
      default:
        return 'bg-neon-blue/10';
    }
  };

  return (
    <Card className="card-futuristic border-neon-purple/30 hover:border-neon-purple/40">
      <CardHeader>
        <CardTitle className="text-neon-purple flex items-center gap-2 font-orbitron">
          <Compass className="w-5 h-5" />
          Coordinate System
        </CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">
          Choose the reference frame for astronomical calculations
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {coordinateSystems.map((system) => {
            const isSelected = selectedSystem === system.name;
            const colorClass = getSystemColor(system.name);
            const bgClass = getSystemBgColor(system.name);
            
            return (
              <button
                key={system.name}
                onClick={() => onSystemChange(system.name)}
                className={`
                  relative group p-4 sm:p-5 rounded-xl border transition-all duration-300
                  ${isSelected 
                    ? `${bgClass} border-current shadow-neon-pulse` 
                    : 'bg-muted/20 border-muted/30 hover:scale-105'
                  }
                  ${colorClass}
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-current rounded-full animate-pulse" />
                )}

                {/* System Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${isSelected ? 'bg-current/20' : 'bg-muted/30 group-hover:bg-current/10'}
                  `}>
                    {getSystemIcon(system.name)}
                  </div>
                                     <div>
                     <h3 className={`
                       font-semibold text-sm sm:text-base font-orbitron transition-colors duration-300
                       ${isSelected ? 'text-current' : 'text-foreground group-hover:text-current'}
                     `}>
                       {system.name}
                     </h3>
                     <p className="text-xs text-muted-foreground font-space">
                       {system.id}
                     </p>
                   </div>
                </div>

                {/* System Description */}
                <p className="text-xs text-muted-foreground text-left leading-relaxed font-space">
                  {system.description}
                </p>

                {/* Hover Effect */}
                <div className={`
                  absolute inset-0 rounded-xl transition-opacity duration-300
                  ${isSelected ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}
                  bg-gradient-to-br from-current to-transparent
                `} />
              </button>
            );
          })}
        </div>

        {/* Selected System Info */}
        {selectedSystem && (
          <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-current/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-current/20 rounded-lg">
                {getSystemIcon(selectedSystem)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm font-orbitron mb-1">
                  {selectedSystem} System Selected
                </h4>
                <p className="text-xs text-muted-foreground font-space leading-relaxed">
                  {coordinateSystems.find(s => s.name === selectedSystem)?.description}
                </p>
                
                {/* System-specific recommendations */}
                {selectedSystem === 'Geocentric' && (
                  <div className="mt-2 p-2 bg-neon-blue/10 rounded border border-neon-blue/20">
                    <p className="text-xs text-neon-blue font-space">
                      🌍 Perfect for Earth-based observations and astrological calculations
                    </p>
                  </div>
                )}
                
                {selectedSystem === 'Heliocentric' && (
                  <div className="mt-2 p-2 bg-neon-cyan/10 rounded border border-neon-cyan/20">
                    <p className="text-xs text-neon-cyan font-space">
                      ☉ Ideal for solar system dynamics and orbital mechanics
                    </p>
                  </div>
                )}
                
                {selectedSystem === 'Barycentric' && (
                  <div className="mt-2 p-2 bg-neon-purple/10 rounded border border-neon-purple/20">
                    <p className="text-xs text-neon-purple font-space">
                      ⚖️ Best for precise astronomical calculations and research
                    </p>
                  </div>
                )}
                
                {selectedSystem === 'Topocentric' && (
                  <div className="mt-2 p-2 bg-neon-green/10 rounded border border-neon-green/20">
                    <p className="text-xs text-neon-green font-space">
                      📍 Excellent for specific location-based observations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* System Comparison */}
        <div className="mt-4 p-3 bg-muted/10 rounded-lg border border-muted/20">
          <h5 className="text-xs font-medium text-muted-foreground mb-2 font-orbitron">
            System Comparison
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-neon-blue">Geocentric</div>
              <div className="text-muted-foreground">Earth-based</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-neon-cyan">Heliocentric</div>
              <div className="text-muted-foreground">Sun-based</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-neon-purple">Barycentric</div>
              <div className="text-muted-foreground">Mass center</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-neon-green">Topocentric</div>
              <div className="text-muted-foreground">Location-based</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};