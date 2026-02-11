import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from 'recharts';

/**
 * EngagementBarChart
 * A reusable bar chart with exact axis labels similar to the provided screenshot.
 */
export default function EngagementBarChart({
  data,
  height = 320,
  xKey = 'date',
  yKey = 'value',
  yLabel = 'Number of engaged\nmembers on date',
  xLabel = 'Date',
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={18}
          margin={{ top: 16, right: 24, left: 24, bottom: 32 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            angle={-35}
            textAnchor="end"
            height={60}
            interval={0}
          >
            <Label value={xLabel} offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']}>
            <Label
              value={yLabel}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip />
          <Bar dataKey={yKey} name="Engaged members" fill="#1677ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

