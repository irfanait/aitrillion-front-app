import React from 'react';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { Flex, Typography } from 'antd';
import {
  LabelWrapper,
  RowItem,
  SectionPadding,
  ValueWrapper,
} from '../../organisms/customer-details-left/style';
import { getFormattedDate } from '../../utils/helper';
import AitText from '@/components/atoms/ait-text/aitText';

const { Title } = Typography;

const GeneralInfoCard = ({ data, loading }) => {
  return (
    <AitCard loading={loading} style={{ height: '100%' }}>
      <Title type="theme" level={5} style={{ marginBottom: 15 }}>
        General information
      </Title>

      <Flex gap={10} vertical wrap="wrap">
        {[
          {
            // icon: <UserOutlined />,
            label: 'Created date',
            value: getFormattedDate(data?.date_created),
          },
          {
            // icon: <MailFilled />,
            label: 'Source',
            value: data?.source
              ? data.source.charAt(0).toUpperCase() + data.source.slice(1)
              : '-',
          },
          {
            label: 'Last modified date',
            value: getFormattedDate(data?.date_updated) || '-',
          },
          {
            label: 'Status',
            value: data?.is_inactive === '0' ? 'Active' : 'Inactive',
          },
          {
            label: 'Last open date',
            value: getFormattedDate(data?.last_email_open_date) || '-',
          },
          {
            label: 'Last click date',
            value: getFormattedDate(data?.last_email_link_click_date) || '-',
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

export default GeneralInfoCard;
