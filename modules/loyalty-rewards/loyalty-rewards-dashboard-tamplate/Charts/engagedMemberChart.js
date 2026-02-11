import moment from 'moment';
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

export default function BarChartComponent({ chartData, label = '' }) {
  const data = chartData.slice(1).map(([date, value]) => ({
    date,
    value,
  }));

  return (
    <div style={{ width: '100%', height: 450 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data?.length > 0 ? data : []}
          barSize={18}
          margin={{ top: 16, right: 24, left: 24, bottom: 32 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
            tickFormatter={(tick) =>
              moment(tick, 'MM-DD-YYYY').format('MMM DD')
            }
          >
            <Label
              value="Date"
              offset={-10}
              position="insideBottom"
              style={{ fill: 'black' }}
            />
          </XAxis>
          <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']}>
            <Label
              value={label}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle', fill: 'black' }}
            />
          </YAxis>
          <Tooltip
            itemStyle={{ color: 'black', fontWeight: 'bold' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Bar dataKey="value" name={label} fill="#1677ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
