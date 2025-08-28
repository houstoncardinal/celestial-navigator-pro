import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Calendar, Clock, CalendarDays } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  stepDays: number;
  onStepDaysChange: (days: number) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  stepDays,
  onStepDaysChange
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (newDate <= endDate) {
      onStartDateChange(newDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (newDate >= startDate) {
      onEndDateChange(newDate);
    }
  };

  const calculateDuration = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDataPoints = () => {
    const duration = calculateDuration();
    return Math.floor(duration / stepDays) + 1;
  };

  return (
    <Card className="card-futuristic border-neon-cyan/30 hover:border-neon-cyan/40">
      <CardHeader>
        <CardTitle className="text-neon-cyan flex items-center gap-2 font-orbitron">
          <Calendar className="w-5 h-5" />
          Date Range & Step
        </CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">
          Configure calculation period and time resolution
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-sm font-medium text-neon-cyan">
              Start Date
            </Label>
            <div className="relative">
              <Input
                id="start-date"
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={handleStartDateChange}
                className="input-futuristic border-neon-cyan/30 focus:border-neon-cyan"
                min={new Date('1900-01-01').toISOString().split('T')[0]}
                max={endDate.toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neon-cyan/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-sm font-medium text-neon-cyan">
              End Date
            </Label>
            <div className="relative">
              <Input
                id="end-date"
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={handleEndDateChange}
                className="input-futuristic border-neon-cyan/30 focus:border-neon-cyan"
                min={startDate.toISOString().split('T')[0]}
                max={new Date('2100-12-31').toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neon-cyan/50" />
            </div>
          </div>
        </div>

        {/* Step Days Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-neon-cyan flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Step: {stepDays} day{stepDays !== 1 ? 's' : ''}
            </Label>
            <div className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
              {calculateDataPoints()} data points
            </div>
          </div>
          
          <Slider
            value={[stepDays]}
            onValueChange={([value]) => onStepDaysChange(value)}
            min={1}
            max={30}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Daily (1 day)</span>
            <span>Weekly (7 days)</span>
            <span>Monthly (30 days)</span>
          </div>
        </div>

        {/* Summary Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border border-neon-cyan/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-cyan font-orbitron">
              {calculateDuration()}
            </div>
            <div className="text-xs text-muted-foreground font-space">Total Days</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-cyan font-orbitron">
              {stepDays}
            </div>
            <div className="text-xs text-muted-foreground font-space">Step Size</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-cyan font-orbitron">
              {calculateDataPoints()}
            </div>
            <div className="text-xs text-muted-foreground font-space">Data Points</div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-neon-cyan flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Quick Presets
          </Label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '1 Week', days: 7, step: 1 },
              { label: '1 Month', days: 30, step: 1 },
              { label: '3 Months', days: 90, step: 3 },
              { label: '1 Year', days: 365, step: 7 }
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const newEndDate = new Date(startDate);
                  newEndDate.setDate(startDate.getDate() + preset.days);
                  onEndDateChange(newEndDate);
                  onStepDaysChange(preset.step);
                }}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all duration-300"
              >
                {preset.label}
              </button>
            ))}
            
            {/* Reference Data Preset */}
            <button
              onClick={() => {
                onStartDateChange(new Date('2013-11-07'));
                onEndDateChange(new Date('2014-02-03'));
                onStepDaysChange(1);
              }}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 hover:border-neon-orange/50 transition-all duration-300"
            >
              Reference Data (2013-2014)
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};