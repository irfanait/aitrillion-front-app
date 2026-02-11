import React from 'react';
import AitTable from '@/components/molecules/ait-table/aitTable';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { EllipsisOutlined } from '@ant-design/icons';
import { Card, ConfigProvider, Popover, Row, Tag, Typography } from 'antd';
import CampaignActionContent from '../../molecules/campaign-list-action/campaignListAction';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import AitTableList from '@/components/molecules/ait-table-list/aitTableList';
import { TableWrapperCard } from './style';
import Link from 'next/link';
import AitCard from '@/components/atoms/ait-card/aitCard';
const { Title, Text } = Typography;

const CampaignListTable = (props) => {
  const { heading } = props;
  const router = useRouter();
  const campaignState = useSelector(
    (state) => state.emailMarketingDashboardState?.getDashboardCampainList
  );
  const { getDashboardCampainListLoading } = useSelector(
    (state) => state.emailMarketingDashboardState
  );
  const { campaignsList } = campaignState;

  const emailMarketingCampaignTableColumns = [
    {
      title: 'Campaign name',
      dataIndex: 'campaign_name',
      key: 'campaign_name',
      width: 200,
      fixed: 'left',
      //sorter: true,
      showSorterTooltip: false,
      render: (_, record) => {
        const handleCampaignClick = () => {
          const messageId = record?.encoded_id;
          const status = record.status_text?.toLowerCase();
          router.push(`/email-marketing/campaign/${messageId}`);
        };

        return (
          <div>
            <Text
              onClick={handleCampaignClick}
              style={{
                color: 'rgb(26, 115, 232)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {record.campaign_name}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Sent date',
      key: 'send_time',
      width: 170,
      //sorter: true,
      showSorterTooltip: false,
      render: (_, record) => (
        <>
          <Text style={{ fontSize: 13 }}>{record.send_time}</Text>
        </>
      ),
    },
    {
      title: 'Sent',
      key: 'total_sent',
      width: 80,
      //sorter: true,
      showSorterTooltip: false,
      render: (_, record) => (
        <>
          <Text style={{ fontSize: 13 }}>{record.total_sent}</Text>
        </>
      ),
    },
    {
      title: 'Opened',
      key: 'total_open',
      width: 90,
      //sorter: true,
      showSorterTooltip: false,
      render: (_, record) => (
        <>
          <Text style={{ fontSize: 13 }}>{record.total_open}</Text>
        </>
      ),
    },
    {
      title: 'Clicked',
      key: 'total_click',
      width: 80,
      //sorter: true,
      showSorterTooltip: false,
      render: (_, record) => (
        <>
          <Text style={{ fontSize: 13 }}>{record.total_click}</Text>
        </>
      ),
    },
    {
      title: 'Orders',
      key: 'total_orders',
      width: 80,
      //sorter: true,
      showSorterTooltip: false,
      render: (_, record) => (
        <>
          <Text style={{ fontSize: 13 }}>{record.total_orders}</Text>
        </>
      ),
    },
    {
      title: 'Revenue',
      key: 'total_order_amount',
      width: 140,
      //sorter: true,
      showSorterTooltip: false,
      render: (_, record) => (
        <>
          <Text style={{ fontSize: 13 }}>{record.total_order_amount}</Text>
        </>
      ),
    },
    {
      title: 'Opened/Recipients',
      key: 'opened_sent_ratio',
      width: 160,
      //sorter: true,
      showSorterTooltip: false,
      render: (_, record) => (
        <>
          <Text
            style={{ fontSize: 13 }}
          >{`${record.opened_sent_ratio} %`}</Text>
        </>
      ),
    },
  ];

  return (
    <>
      <AitCard
        title={heading}
        borderless={true}
        margintop={'24px'}
        extra={<Link href={`/email-marketing/campaign/list`}>View all</Link>}
      >
        <AitTableList
          rowKey="id"
          heading={heading}
          dataSource={campaignsList}
          pagination={false}
          loading={getDashboardCampainListLoading}
          columns={emailMarketingCampaignTableColumns}
          scroll={{ y: 55 * 5 }}
        />
      </AitCard>
    </>
  );
};

export default CampaignListTable;
