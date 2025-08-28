import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  validateCalculations, 
  referenceData, 
  parseAstronomicalDate, 
  formatAstronomicalDate,
  type PlanetPosition 
} from '@/utils/astronomy';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface DataValidationPanelProps {
  calculatedPositions: PlanetPosition[];
}

export const DataValidationPanel: React.FC<DataValidationPanelProps> = ({ calculatedPositions }) => {
  const [tolerance, setTolerance] = useState(1.0);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runValidation = async () => {
    if (calculatedPositions.length === 0) {
      setError('No calculated positions available for validation');
      return;
    }

    setIsValidating(true);
    setError(null);
    
    try {
      // Run validation in a timeout to prevent UI freezing
      const results = await new Promise((resolve) => {
        setTimeout(() => {
          try {
            const validationResults = validateCalculations(calculatedPositions, referenceData, tolerance);
            resolve(validationResults);
          } catch (err) {
            resolve({ 
              accuracy: 0, 
              discrepancies: [], 
              summary: `Validation error: ${err instanceof Error ? err.message : 'Unknown error'}` 
            });
          }
        }, 100);
      });
      
      setValidationResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-neon-green';
    if (accuracy >= 80) return 'text-neon-orange';
    return 'text-neon-red';
  };

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 95) return <Badge className="badge-futuristic border-neon-green/50 text-neon-green">Excellent</Badge>;
    if (accuracy >= 80) return <Badge className="badge-futuristic border-neon-orange/50 text-neon-orange">Good</Badge>;
    return <Badge className="badge-futuristic border-neon-red/50 text-neon-red">Needs Improvement</Badge>;
  };

  return (
    <Card className="card-futuristic border-neon-purple/30 hover:border-neon-purple/40">
      <CardHeader>
        <CardTitle className="text-neon-purple flex items-center gap-2 font-orbitron">
          <Target className="w-5 h-5" />
          Data Validation & Accuracy
        </CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">
          Compare our calculations with reference astronomical data for Mercury-Venus 2013-2014
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-neon-purple">Tolerance:</label>
            <select
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value))}
              className="input-futuristic border-neon-purple/30 focus:border-neon-purple"
            >
              <option value={0.1}>±0.1° (High Precision)</option>
              <option value={0.5}>±0.5° (Medium Precision)</option>
              <option value={1.0}>±1.0° (Standard)</option>
              <option value={2.0}>±2.0° (Loose)</option>
              <option value={5.0}>±5.0° (Very Loose)</option>
            </select>
          </div>
          
          <Button 
            onClick={runValidation}
            className="btn-futuristic"
            disabled={calculatedPositions.length === 0 || isValidating}
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Validating...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Run Validation
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-red-500 text-sm font-medium">⚠️ Validation Error: {error}</p>
          </div>
        )}

        {/* Reference Data Summary */}
        <div className="p-4 bg-muted/20 rounded-lg border border-neon-purple/20">
          <h4 className="text-sm font-semibold text-neon-purple mb-3 font-orbitron">Reference Data Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Data Points:</span>
              <span className="ml-2 font-semibold text-foreground">{referenceData.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Date Range:</span>
              <span className="ml-2 font-semibold text-foreground">
                {referenceData[0]?.date} - {referenceData[referenceData.length - 1]?.date}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Planets:</span>
              <span className="ml-2 font-semibold text-foreground">Mercury & Venus</span>
            </div>
          </div>
        </div>

        {/* Validation Results */}
        {validationResults && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg border border-neon-purple/20">
              <div className="text-center">
                <div className={`text-3xl font-bold font-orbitron ${getAccuracyColor(validationResults.accuracy)}`}>
                  {validationResults.accuracy.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground font-space">Accuracy</div>
                {getAccuracyBadge(validationResults.accuracy)}
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-purple font-orbitron">
                  {validationResults.discrepancies.length}
                </div>
                <div className="text-xs text-muted-foreground font-space">Comparisons</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-green font-orbitron">
                  {validationResults.discrepancies.filter((d: any) => d.withinTolerance).length}
                </div>
                <div className="text-xs text-muted-foreground font-space">Within Tolerance</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-red font-orbitron">
                  {validationResults.discrepancies.filter((d: any) => !d.withinTolerance).length}
                </div>
                <div className="text-xs text-muted-foreground font-space">Outside Tolerance</div>
              </div>
            </div>

            {/* Detailed Results Table */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground font-orbitron">Detailed Comparison Results</h4>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neon-purple/20">
                      <TableHead>Date</TableHead>
                      <TableHead>Planet</TableHead>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Calculated</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Difference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults.discrepancies.map((discrepancy: any, index: number) => (
                      <TableRow key={index} className="border-muted/20 hover:bg-muted/10">
                        <TableCell className="font-space text-sm">
                          {discrepancy.date}
                        </TableCell>
                        <TableCell className="font-medium">
                          {discrepancy.planet}
                        </TableCell>
                        <TableCell>
                          {discrepancy.planet === 'Mercury' ? 
                            (discrepancy.calculated === discrepancy.reference ? 'Longitude' : 'Latitude') : 
                            'Position'
                          }
                        </TableCell>
                        <TableCell className="font-mono">
                          {discrepancy.calculated.toFixed(4)}°
                        </TableCell>
                        <TableCell className="font-mono">
                          {discrepancy.reference.toFixed(4)}°
                        </TableCell>
                        <TableCell className="font-mono">
                          <span className={discrepancy.withinTolerance ? 'text-neon-green' : 'text-neon-red'}>
                            ±{discrepancy.difference.toFixed(4)}°
                          </span>
                        </TableCell>
                        <TableCell>
                          {discrepancy.withinTolerance ? (
                            <CheckCircle className="w-4 h-4 text-neon-green" />
                          ) : (
                            <XCircle className="w-4 h-4 text-neon-red" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Validation Summary */}
            <div className="p-4 bg-muted/20 rounded-lg border border-neon-purple/20">
              <h4 className="text-sm font-semibold text-neon-purple mb-3 font-orbitron">Validation Summary</h4>
              <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap bg-muted/30 p-3 rounded border">
                {validationResults.summary}
              </pre>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-muted/20 rounded-lg border border-neon-purple/20">
              <h4 className="text-sm font-semibold text-neon-purple mb-3 font-orbitron flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Recommendations
              </h4>
              <div className="space-y-2 text-sm">
                {validationResults.accuracy >= 95 ? (
                  <p className="text-neon-green">✅ Excellent accuracy! Our calculations are highly reliable for astronomical work.</p>
                ) : validationResults.accuracy >= 80 ? (
                  <p className="text-neon-orange">⚠️ Good accuracy. Consider using for general astronomical applications.</p>
                ) : (
                  <p className="text-neon-red">❌ Accuracy needs improvement. Consider using professional ephemeris data for critical applications.</p>
                )}
                
                <p className="text-muted-foreground">
                  <strong>Note:</strong> This validation compares our simplified calculations with reference data. 
                  For professional astronomical work, consider using JPL ephemeris data or specialized astronomical libraries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reference Data Table */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground font-orbitron">Reference Data (Mercury-Venus 2013-2014)</h4>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-neon-purple/20">
                  <TableHead>Date</TableHead>
                  <TableHead>Mercury Longitude</TableHead>
                  <TableHead>Mercury Latitude</TableHead>
                  <TableHead>Venus Longitude</TableHead>
                  <TableHead>Venus Latitude</TableHead>
                  <TableHead>Aspect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referenceData.map((ref, index) => (
                  <TableRow key={index} className="border-muted/20 hover:bg-muted/10">
                    <TableCell className="font-space text-sm font-medium">
                      {ref.date}
                    </TableCell>
                    <TableCell className="font-mono">
                      {ref.planet1Longitude.toFixed(4)}°
                    </TableCell>
                    <TableCell className="font-mono">
                      {ref.planet1Latitude.toFixed(4)}°
                    </TableCell>
                    <TableCell className="font-mono">
                      {ref.planet2Longitude.toFixed(4)}°
                    </TableCell>
                    <TableCell className="font-mono">
                      {ref.planet2Latitude.toFixed(4)}°
                    </TableCell>
                    <TableCell>
                      <Badge className={`badge-futuristic text-xs ${
                        ref.aspect === 'None' ? 'border-muted/50 text-muted-foreground' :
                        ref.aspect === 'Opposition' ? 'border-neon-red/50 text-neon-red' :
                        ref.aspect === 'Trine' ? 'border-neon-green/50 text-neon-green' :
                        'border-neon-blue/50 text-neon-blue'
                      }`}>
                        {ref.aspect}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 