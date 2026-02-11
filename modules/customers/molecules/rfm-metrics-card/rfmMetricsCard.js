import React from 'react';
import AitCard from '@/components/atoms/ait-card/aitCard';
import {
  LabelWrapper,
  RowItem,
  SectionPadding,
  ValueWrapper,
} from '../../organisms/customer-details-left/style';
import { Flex, Typography } from 'antd';
import { getFieldValue, getFormattedDate } from '../../utils/helper';
import AitText from '@/components/atoms/ait-text/aitText';
import { useSelector } from 'react-redux';
import { getCurrencyParts } from '@/modules/email-marketing/utils/helper';

const { Title } = Typography;

const RfmMetricsCard = ({ data }) => {
  const { login_auth } = useSelector((state) => state.jwtState);
  const { prefix, suffix } = getCurrencyParts(login_auth?.money_format);

  return (
    <AitCard style={{ height: '100%' }}>
      <Title level={5} type="theme" style={{ marginBottom: 15 }}>
        RFM metrics
      </Title>
      <Flex gap={10} vertical wrap="wrap">
        {[
          {
            label: 'Last order date',
            value: getFormattedDate(data?.last_order_date),
          },
          {
            label: 'Total revenue',
            value: getFieldValue(` ${prefix}${data?.total_spent}${suffix}`),
          },
          {
            label: 'Total orders',
            value: getFieldValue(data?.orders_count),
          },
          {
            label: 'Canceled orders',
            value: getFieldValue(data?.canceled_order_count || '0'),
          },
          {
            label: 'Average order value',
            value: getFieldValue(
              ` ${prefix}${data?.avg_order_amount}${suffix}`
            ),
          },
        ].map((row, index) => (
          <Flex key={index} justify="space-between" gap={[10, 10]}>
            <AitText type="default" strong>
              {row.label}:
            </AitText>
            <AitText type="default">{row.value}</AitText>
          </Flex>
        ))}
      </Flex>
    </AitCard>
  );
};

export default RfmMetricsCard;
