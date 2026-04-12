import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LearningDataPoint } from '../types';

interface LearningProgressChartProps {
  data: LearningDataPoint[];
}

const LearningProgressChart: React.FC<LearningProgressChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 text-center text-brand-text-secondary shadow-lg">
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Ontological Tracking</h3>
            <p>Chart will appear here once the interaction starts.</p>
        </div>
    );
  }
  
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg h-96">
      <h3 className="text-xl font-semibold text-brand-text-primary mb-4">Ontological Tracking (CFDI & BAI)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
          <XAxis dataKey="turn" stroke="#8B949E" label={{ value: 'Turns', position: 'insideBottom', offset: -15, fill: '#8B949E' }} />
          <YAxis stroke="#8B949E" label={{ value: 'Index Value', angle: -90, position: 'insideLeft', offset: 10, fill: '#8B949E' }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#161B22',
              borderColor: '#30363D',
              color: '#C9D1D9',
            }}
          />
          <Legend wrapperStyle={{ color: '#C9D1D9' }} />
          <Line type="monotone" dataKey="cfdi" name="CFDI (Divergence)" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="bai" name="BAI (Bias Amplification)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LearningProgressChart;
