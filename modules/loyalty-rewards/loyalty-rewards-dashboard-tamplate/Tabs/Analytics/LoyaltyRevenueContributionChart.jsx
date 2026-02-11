import { getCurrencyByMoneyFormat } from '@/utils/common.util';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ReferenceArea,
  CartesianGrid,
} from 'recharts';

function currency(n) {
  return `$${(n ?? 0).toFixed(2)}`;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const redeemer = payload.find((p) => p.dataKey === 'redeemer')?.value ?? 0;
  const other = payload.find((p) => p.dataKey === 'other')?.value ?? 0;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eee',
        padding: 8,
        borderRadius: 6,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        {data?.label || data?.d}
      </div>

      <div style={{ color: '#7c5cff' }}>
        • Loyalty redeemer revenue: {currency(redeemer)}
      </div>
      <div style={{ color: '#8884d8' }}>
        • All Other Revenue: {currency(other)}
      </div>
    </div>
  );
}

function TotalRevenueTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const redeemer = payload.find((p) => p.dataKey === 'redeemer')?.value ?? 0;
  const other = payload.find((p) => p.dataKey === 'other')?.value ?? 0;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eee',
        padding: 8,
        borderRadius: 6,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        {data?.label || data?.d}
      </div>

      <div style={{ color: '#47d1d8ff' }}>
        • Redeeming members: {currency(redeemer)}
      </div>
      <div style={{ color: '#5ef0ebff' }}>
        • Non-redeeming member: {currency(other)}
      </div>
      <div style={{ color: '#bcf1f0ff' }}>• Non-member: {currency(other)}</div>
    </div>
  );
}

export default function LoyaltyRevenueContributionChart({
  data,
  highlightFrom,
  highlightTo,
  checkboxChartState,
}) {
  const jwtState = useSelector((state) => state?.jwtState);
  const xMinIndex = data.findIndex((d) => d.d === highlightFrom);
  const xMaxIndex = data.findIndex((d) => d.d === highlightTo);

  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} barCategoryGap={18} barSize={7.5}>
          <CartesianGrid stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="d"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => {
              const currencySymbol = getCurrencyByMoneyFormat(
                jwtState?.login_auth?.money_format
              );
              if (v >= 1000) {
                return `${currencySymbol}${(v / 1000).toFixed(0)}k`;
              }
              return `${currencySymbol}${v}`;
            }}
            label={{
              value: 'Revenue',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fill: '#6b7280' },
            }}
          />
          <Tooltip content={<CustomTooltip />} />

          {xMinIndex >= 0 && xMaxIndex >= 0 && (
            <ReferenceArea
              x1={data[xMinIndex].d}
              x2={data[xMaxIndex].d}
              strokeOpacity={0}
              fill="#eef0ff"
              fillOpacity={1}
            />
          )}
          {checkboxChartState?.loyaltyRedeemerRevenueState && (
            <Bar
              name="Loyalty redeemer revenue"
              dataKey="redeemer"
              stackId="rev"
              fill="#7c5cff"
              radius={[4, 4, 0, 0]}
            />
          )}
          {checkboxChartState?.allOtherRevenue && (
            <Bar
              name="All other revenue"
              dataKey="other"
              stackId="rev"
              fill="#b0a7ff"
              radius={[4, 4, 0, 0]}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
