import { useState } from "react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  Label
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MedicalTerm } from "@shared/schema";

interface DataVisualizationProps {
  terms: MedicalTerm[];
}

export default function DataVisualization({ terms }: DataVisualizationProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  
  // Filter out only terms with numerical values
  const numericalTerms = terms.filter(term => {
    const value = term.value && parseFloat(term.value.replace(/[^\d.-]/g, ''));
    return !isNaN(value as number) && term.normalRange;
  });
  
  if (numericalTerms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-neutral-500">No visualizable data available in this report.</p>
          <p className="text-neutral-400 text-sm mt-2">
            Reports with numerical values like cholesterol, blood pressure, or glucose levels will display charts here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Create data for visualizations
  const chartData = numericalTerms.map(term => {
    // Extract numeric value
    const rawValue = term.value || "0";
    const numericValue = parseFloat(rawValue.replace(/[^\d.-]/g, ''));
    
    // Extract normal range (if available)
    let minRange = 0;
    let maxRange = 0;
    
    if (term.normalRange) {
      const rangeMatch = term.normalRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
      if (rangeMatch) {
        minRange = parseFloat(rangeMatch[1]);
        maxRange = parseFloat(rangeMatch[2]);
      }
    }
    
    // Determine status color
    let color = "#22c55e"; // Green for normal
    
    if (term.status === "high" || term.status === "borderline-high") {
      color = "#ef4444"; // Red for high
    } else if (term.status === "low" || term.status === "borderline-low") {
      color = "#3b82f6"; // Blue for low
    } else if (term.status === "abnormal") {
      color = "#f97316"; // Orange for abnormal
    }
    
    return {
      name: term.term,
      value: numericValue,
      minRange,
      maxRange,
      normalRange: term.normalRange,
      color,
      status: term.status || "normal"
    };
  });
  
  // Create normalized data for the bar chart (percentage of normal range)
  const normalizedData = chartData.map(item => {
    if (item.minRange && item.maxRange) {
      const rangeMiddle = (item.maxRange + item.minRange) / 2;
      const rangeSize = item.maxRange - item.minRange;
      
      // Normalize to percentage of normal range
      let normalizedValue = ((item.value - rangeMiddle) / (rangeSize / 2)) * 100;
      
      // Cap at +/- 150% for visualization purposes
      normalizedValue = Math.max(Math.min(normalizedValue, 150), -150);
      
      return {
        ...item,
        normalizedValue
      };
    }
    
    return {
      ...item,
      normalizedValue: 0
    };
  });
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-md shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p>Value: {data.value}</p>
          {data.normalRange && <p>Normal Range: {data.normalRange}</p>}
          <Badge variant={data.status as any}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1).replace('-', ' ')}
          </Badge>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Health Metrics Visualization</CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={chartType === 'bar' ? 'default' : 'outline'} 
              onClick={() => setChartType('bar')}
            >
              Bar
            </Button>
            <Button 
              size="sm" 
              variant={chartType === 'line' ? 'default' : 'outline'} 
              onClick={() => setChartType('line')}
            >
              Line
            </Button>
            <Button 
              size="sm" 
              variant={chartType === 'pie' ? 'default' : 'outline'} 
              onClick={() => setChartType('pie')}
            >
              Pie
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartType === 'bar' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={normalizedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis>
                  <Label
                    value="% Deviation from Normal Range"
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="normalizedValue" name="Deviation from Normal Range">
                  {normalizedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {chartType === 'line' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Measured Value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Line>
              </LineChart>
            </ResponsiveContainer>
          )}
          
          {chartType === 'pie' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Legend</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs">Normal</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-xs">Abnormal</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}