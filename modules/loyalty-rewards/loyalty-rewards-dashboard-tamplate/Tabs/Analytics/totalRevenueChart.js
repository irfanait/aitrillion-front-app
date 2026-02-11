import { Card, Tooltip } from 'antd';
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Bar,
  ReferenceArea,
  CartesianGrid,
} from 'recharts';

import { InfoCircleOutlined } from '@ant-design/icons';
import { checkValidData, getCurrencyByMoneyFormat } from '@/utils/common.util';
import {
  ChartContainer,
  ColoredCheckbox,
  HeaderContainer,
  HeaderText,
  HeaderTextBold,
  Wrapper,
} from '../../style';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { useSelector } from 'react-redux';

function currency(n) {
  return `$${(n ?? 0).toFixed(2)}`;
}

function TotalRevenueTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const redeemer = payload.find((p) => p.dataKey === 'redeemer')?.value ?? 0;
  const nonMember = payload.find((p) => p.dataKey === 'nonMember')?.value ?? 0;
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

      <div>• Redeeming members: {currency(redeemer)}</div>
      <div>• Non-redeeming member: {currency(other)}</div>
      <div>• Non-member: {currency(nonMember)}</div>
    </div>
  );
}

export default function TotalRevenueChart({
  data,
  highlightFrom,
  highlightTo,
  apiData,
  setCheckboxChartState,
  checkboxChartState,
}) {
  const jwtState = useSelector((state) => state?.jwtState);
  const xMinIndex = data.findIndex((d) => d.d === highlightFrom);
  const xMaxIndex = data.findIndex((d) => d.d === highlightTo);

  const formatYAxisValue = (value) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value;
  };

  const totals = {};
  return (
    <AitCard
      hascustomheader={true}
      headerpadding={{ md: '24px 24px 10px 24px' }}
      customheaderleft={
        <>
          <HeaderContainer>
            <HeaderText as="h4">Total revenue</HeaderText>
            <Tooltip
              placement="right"
              title="Gross revenue of all customers, minus discounts, refunds and adjustments."
            >
              <InfoCircleOutlined />
            </Tooltip>
          </HeaderContainer>
          <HeaderTextBold>
            {' '}
            {checkValidData(apiData?.totalRevenueWithFormat)}
          </HeaderTextBold>
        </>
      }
    >
      <ChartContainer $height={260}>
        <ResponsiveContainer>
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
                  tickFormatter={(v) =>
                    `${getCurrencyByMoneyFormat(
                      jwtState?.login_auth?.money_format
                    )}${formatYAxisValue(v)}`
                  }
                  label={{
                    value: '',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    style: { fill: '#6b7280' },
                  }}
                />
                <ReTooltip content={<TotalRevenueTooltip />} />

                {xMinIndex >= 0 && xMaxIndex >= 0 && (
                  <ReferenceArea
                    x1={data[xMinIndex].d}
                    x2={data[xMaxIndex].d}
                    strokeOpacity={0}
                    fill="#eef0ff"
                    fillOpacity={1}
                  />
                )}
                {checkboxChartState?.totalRedeeminCheck && (
                  <Bar
                    name="Loyalty redeemer revenue"
                    dataKey="redeemer"
                    stackId="rev"
                    fill="#47d1d8ff"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {checkboxChartState?.totalNonRedeeminCheck && (
                  <Bar
                    name="Non-redeeming member"
                    dataKey="other"
                    stackId="rev"
                    fill="#5ef0ebff"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {checkboxChartState?.totalNonMemberCheck && (
                  <Bar
                    name="Non-member"
                    dataKey="nonMember"
                    stackId="rev"
                    fill="#89e4e1ff"
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ResponsiveContainer>
      </ChartContainer>
      <div
        style={{
          marginTop: 80,
          borderTop: '1px solid #f1f5f9',
          // paddingTop: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
          }}
        >
          <Wrapper>
            <HeaderContainer>
              <Tooltip
                placement="right"
                title="Redeeming members are customers who have actively engaged with the loyalty program by redeeming points to claim a reward."
              >
                <ColoredCheckbox
                  checkedColor="#47d1d8ff"
                  checked={checkboxChartState?.totalRedeeminCheck}
                  onChange={() =>
                    setCheckboxChartState({
                      ...checkboxChartState,
                      totalRedeeminCheck:
                        !checkboxChartState?.totalRedeeminCheck,
                    })
                  }
                >
                  Redeeming members
                </ColoredCheckbox>
                <InfoCircleOutlined />
              </Tooltip>
            </HeaderContainer>
          </Wrapper>

          <div style={{ fontWeight: 600 }}>
            {checkValidData(apiData?.totalRevenueRedeemingMemberWithFormat)}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            marginTop: 6,
          }}
        >
          <Wrapper>
            <HeaderContainer>
              <Tooltip
                placement="right"
                title="Non-redeemers are customers who have joined the loyalty program but have not yet made a direct engagement via redeeming points or rewards."
              >
                <ColoredCheckbox
                  checkedColor="#5ef0ebff"
                  checked={checkboxChartState?.totalNonRedeeminCheck}
                  onChange={() =>
                    setCheckboxChartState({
                      ...checkboxChartState,
                      totalNonRedeeminCheck:
                        !checkboxChartState?.totalNonRedeeminCheck,
                    })
                  }
                >
                  Non-redeeming member
                </ColoredCheckbox>
                <InfoCircleOutlined />
              </Tooltip>
            </HeaderContainer>
          </Wrapper>

          <div style={{ fontWeight: 600 }}>
            {checkValidData(apiData?.totalRevenueNonRdeemingMemberWithFormat)}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            marginTop: 6,
          }}
        >
          <Wrapper>
            <HeaderContainer>
              <Tooltip
                placement="right"
                title="Non-members are customers who are not signed up for the loyalty program. These might be guest customers or those who have opted out of the loyalty program."
                style={{ cursor: 'pointer' }}
              >
                <ColoredCheckbox
                  checkedColor="#89e4e1ff"
                  checked={checkboxChartState?.totalNonMemberCheck}
                  onChange={() =>
                    setCheckboxChartState({
                      ...checkboxChartState,
                      totalNonMemberCheck:
                        !checkboxChartState?.totalNonMemberCheck,
                    })
                  }
                >
                  Non-members
                </ColoredCheckbox>
                <InfoCircleOutlined />
              </Tooltip>
            </HeaderContainer>
          </Wrapper>

          <div style={{ fontWeight: 600 }}>
            {checkValidData(apiData?.totalRevenueNonMemberWithFormat)}
          </div>
        </div>
      </div>
    </AitCard>
  );
}
