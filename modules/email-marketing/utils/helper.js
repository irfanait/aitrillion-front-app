import { Col, Space, Typography } from 'antd';
import moment from 'moment';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import dayjs from 'dayjs';

const { Text } = Typography;

export const getEmailSubject = ({
  isEditMode,
  campaignDetailsData,
  templateDetailsById,
}) => {
  // If template subject exists, prioritize it
  if (templateDetailsById?.EmailNotificationfromSubject) {
    return templateDetailsById.EmailNotificationfromSubject;
  }

  // Otherwise use saved subject if in edit mode
  if (isEditMode) {
    return campaignDetailsData?.campaignInfo?.email_subject || '';
  }

  // Default fallback
  return '';
};

// Color map for left and right bar
const COLORS = ['#ADC5F8', '#DFEDFF'];

export const renderChart = (dataArray) => {
  if (!dataArray || dataArray.length < 2) return null;

  const chartData = dataArray.map((item, index) => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <ResponsiveContainer height={250}>
      <BarChart data={chartData} barGap={0}>
        <XAxis dataKey="name" />
        <YAxis />
        {/* <Tooltip content={<CustomTooltip />} /> */}
        <Bar barSize={52} dataKey="value">
          <LabelList
            dataKey="value"
            position="outside"
            style={{ fill: '#333', fontSize: 12 }}
          />
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const getPercentage = (value) =>
  value != null ? `${value.toFixed(2)}%` : '--';
export const getText = (value) => (value != null ? value : '--');

export const renderStats = (data) =>
  data.map(({ icon, value, label, percentage }, idx) => (
    <Col key={idx} xs={12}>
      <Space size="middle" align="center">
        <div>{icon}</div>
        <div>
          <Text strong style={{ fontSize: 18 }}>
            {getText(value)}
          </Text>
          {percentage !== null && (
            <Text type="secondary" style={{ marginLeft: 10 }}>
              {getPercentage(percentage)}
            </Text>
          )}
          <br />
          <Text type="secondary">{label}</Text>
        </div>
      </Space>
    </Col>
  ));

export const getCurrencyParts = (moneyFormat) => {
  const regex = /(.*)\{\{\s*amount\s*\}\}(.*)/;
  const match = moneyFormat.match(regex);
  return {
    prefix: match?.[1] || '',
    suffix: match?.[2] || '',
  };
};

export const formatSendDate = (dateStr) => {
  if (!dateStr) return '--';
  return moment(
    dateStr
      .replace(/<[^>]*>/g, '')
      .replace(' (IST)', '')
      .trim(),
    'MMM DD, YYYY at hh:mm A'
  ).format('MMM DD, YYYY [at] hh:mm A [(IST)]');
};

export const calculateABTestDistribution = (
  totalCustomers,
  percentageInput
) => {
  const winnerGroupCount = Math.floor((percentageInput / 100) * totalCustomers);

  // Remaining for A/B test
  let abTestCount = totalCustomers - winnerGroupCount;

  // Make abTestCount even
  if (abTestCount % 2 !== 0) {
    abTestCount -= 1;
  }

  const adjustedWinnerCount = totalCustomers - abTestCount;
  const versionACount = abTestCount / 2;
  const versionBCount = abTestCount / 2;

  // ✅ Percentages derived directly from input
  const winnerPercent = percentageInput;
  const versionAPercent = (100 - percentageInput) / 2;
  const versionBPercent = (100 - percentageInput) / 2;

  return {
    totalCustomers,
    abTestCount,
    winnerGroupCount: adjustedWinnerCount,
    versionACount,
    versionBCount,
    versionAPercent,
    versionBPercent,
    winnerPercent,
  };
};

export const winByOptions = {
  click_rate: 'click rate',
  open_rate: 'open rate',
  total_sales: 'total sales',
};

export const disablePastDate = (current) => {
  return current && current < dayjs().startOf('day');
};

export const disablePastTime = (date) => {
  if (!date) return {};

  const now = dayjs();

  // If same day, restrict hours & minutes
  if (date.isSame(now, 'day')) {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) =>
          i < now.hour() ? i : null
        ).filter((v) => v !== null),
      disabledMinutes: (selectedHour) => {
        if (selectedHour === now.hour()) {
          return Array.from({ length: 60 }, (_, i) =>
            i < now.minute() ? i : null
          ).filter((v) => v !== null);
        }
        return [];
      },
    };
  }

  return {};
};

export const disableFutureDate = (current) => {
  // Disable any date AFTER today
  return current && current > dayjs().endOf('day');
};

export const disableFutureTime = (date) => {
  if (!date) return {};

  const now = dayjs();

  // If selected date is today, disable future hours & minutes
  if (date.isSame(now, 'day')) {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) =>
          i > now.hour() ? i : null
        ).filter((v) => v !== null),

      disabledMinutes: (selectedHour) => {
        // Disable future minutes only for the current hour
        if (selectedHour === now.hour()) {
          return Array.from({ length: 60 }, (_, i) =>
            i > now.minute() ? i : null
          ).filter((v) => v !== null);
        }
        return [];
      },
    };
  }

  return {};
};

export const formatByValue = (value) =>
  value
    ? value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

export const getComputedStatus = (data) => {
  const when_to_send = data?.when_to_send;
  const status = Number(data?.status);
  const camp_type = data?.camp_type;
  const is_blocked = data?.is_blocked;

  if (when_to_send === 'scheduled') {
    if (status === 2) return 'sent';
    if (status === 1) return is_blocked ? 'blocked' : 'processing';
    return 'scheduled';
  }

  if (when_to_send === 'draft') {
    if (status === 2) return 'sent';
    if (status === 1) return 'processing';
    return 'draft';
  }

  if (when_to_send === 'now') {
    if (status === 2) return 'sent';
    if (status === 1) return 'processing';
    // for your case — camp_type != "campaign"
    return camp_type !== 'campaign' ? 'processing' : 'pending';
  }

  if (status === 2) return 'sent';
  return 'sent';
};
