import AitButton from '@/components/atoms/ait-button/aitButton';
import { EllipsisOutlined } from '@ant-design/icons';
import { Popover, Tag, Typography } from 'antd';
import CampaignActionContent from '../molecules/campaign-list-action/campaignListAction';

const { Text, Paragraph } = Typography;

export const emailMarketingCampaignTableColumns = [
  {
    title: 'Campaign name',
    dataIndex: 'campaign_name',
    key: 'campaign_name',
    width: 300,
    fixed: 'left',
    sorter: true,
    render: (_, record) => (
      <div>
        <Text
          style={{
            color: 'rgb(26, 115, 232)',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {record.campaign_name}
        </Text>
        <Paragraph
          style={{
            marginBottom: 10,
            color: 'rgb(87, 111, 124)',
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: '16px',
            letterSpacing: '0.16px',
            marginTop: '5px',
          }}
        >
          Email subject : {record.email_subject}
        </Paragraph>
        <Paragraph
          style={{
            margin: 0,
            color: 'rgb(87, 111, 124)',
            fontSize: '13px',
            fontWeight: 400,
          }}
        >
          Sent on
          <span dangerouslySetInnerHTML={{ __html: record.send_time }} />
        </Paragraph>
        <Paragraph
          style={{
            margin: 0,
            color: 'rgb(87, 111, 124)',
            fontSize: '13px',
            fontWeight: 400,
          }}
        >
          Created on
          <span
            dangerouslySetInnerHTML={{
              __html: record.created_date_with_shops_timezone,
            }}
          />{' '}
        </Paragraph>
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status_text',
    key: 'status',
    // width: 120,
    sorter: true,
    render: (status) => {
      const statusColor = {
        sent: 'green',
        pending: '#FFF5DA', // background color
        draft: 'default',
        scheduled: 'blue',
        incomplete: 'red',
      };

      const customStyles = {
        width: 100, // set fixed width
        textAlign: 'center',
        color: status === 'pending' ? '#000' : undefined,
        display: 'inline-block',
      };

      return (
        <Tag color={statusColor[status] || 'default'} style={customStyles}>
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'Sent',
    key: 'sent',
    // width: 140,
    sorter: true,
    render: (_, record) => (
      <>
        <Text style={{ fontSize: 13 }}>{record.total_sent}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {record.sent_percentage}% Sent
        </Text>
      </>
    ),
  },
  {
    title: 'Opened',
    key: 'opened',
    // width: 140,
    sorter: true,
    render: (_, record) => (
      <>
        <Text style={{ fontSize: 13 }}>{record.total_open}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {record.opened}% Open
        </Text>
      </>
    ),
  },
  {
    title: 'Clicked',
    key: 'clicked',
    // width: 140,
    sorter: true,
    render: (_, record) => (
      <>
        <Text style={{ fontSize: 13 }}>{record.total_click}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {record.clicked}% Click
        </Text>
      </>
    ),
  },
  {
    title: 'Orders',
    key: 'orders',
    // width: 160,
    sorter: true,
    render: (_, record) => (
      <>
        <Text style={{ fontSize: 13 }}>{record.total_orders}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {record.order_rate}% Order placed
        </Text>
      </>
    ),
  },
  {
    title: 'Revenue',
    key: 'revenue',
    // width: 140,
    sorter: true,
    render: (_, record) => (
      <>
        <Text style={{ fontSize: 13 }}>{record.total_order_amount}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {record.order_rate}% Revenue
        </Text>
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 80,
    render: (_, record) => (
      <Popover
        content={
          <CampaignActionContent record={record} status={record.status_text} />
        }
        trigger="click"
        placement="bottom"
      >
        <AitButton type="text" icon={<EllipsisOutlined />} />
      </Popover>
    ),
  },
];
