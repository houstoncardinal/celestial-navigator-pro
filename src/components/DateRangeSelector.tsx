import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  stepDays: number;
  onStepDaysChange: (step: number) => void;
}

export function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  stepDays,
  onStepDaysChange
}: DateRangeSelectorProps) {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onStartDateChange(newDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onEndDateChange(newDate);
    }
  };

  const setQuickRange = (days: number) => {
    const now = new Date();
    const future = new Date(now);
    future.setDate(now.getDate() + days);
    onStartDateChange(now);
    onEndDateChange(future);
  };

  return (
    <Card className="glass-effect border-cosmic/30 hover:border-stellar/40 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-stellar font-orbitron font-bold flex items-center gap-2">
          <CalendarDays className="w-5 h-5 animate-pulse" />
          Date Range & Step
        </CardTitle>
        <CardDescription className="text-muted-foreground font-space">
          Define the calculation period and time resolution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-foreground font-medium font-space">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formatDateForInput(startDate)}
              onChange={handleStartDateChange}
              className="bg-muted/30 border-cosmic/30 focus:border-stellar hover:border-cosmic/50 transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-foreground font-medium font-space">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formatDateForInput(endDate)}
              onChange={handleEndDateChange}
              className="bg-muted/30 border-cosmic/30 focus:border-stellar hover:border-cosmic/50 transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stepDays" className="text-foreground font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Step (days)
          </Label>
          <Input
            id="stepDays"
            type="number"
            min="1"
            max="365"
            value={stepDays}
            onChange={(e) => onStepDaysChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="bg-muted/30 border-cosmic/30 focus:border-stellar"
          />
          <p className="text-xs text-muted-foreground">
            Smaller steps provide more precise data but longer calculation time
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Quick Ranges</Label>
          <div className="flex flex-wrap gap-2">
            <Button variant="space" size="sm" onClick={() => setQuickRange(7)}>
              1 Week
            </Button>
            <Button variant="space" size="sm" onClick={() => setQuickRange(30)}>
              1 Month
            </Button>
            <Button variant="space" size="sm" onClick={() => setQuickRange(90)}>
              3 Months
            </Button>
            <Button variant="space" size="sm" onClick={() => setQuickRange(365)}>
              1 Year
            </Button>
          </div>
        </div>

        <div className="p-3 bg-muted/20 rounded-lg border border-cosmic/20">
          <p className="text-sm text-muted-foreground">
            <strong>Duration:</strong> {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Data points:</strong> {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * stepDays))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}