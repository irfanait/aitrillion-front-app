import React, { useState } from 'react';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Typography } from 'antd';
import CampaignActionContent from '../../molecules/campaign-list-action/campaignListAction';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import AitPopover from '@/components/atoms/ait-popver/aitPopover';
import { SendTime } from './style';

const { Text, Paragraph } = Typography;

const CampaignListTable = (props) => {
  const {
    activeTab,
    handleSearch,
    handleDateChange,
    handleTableChange,
    handleResetFilters,
    handleEditClick,
    handleViewClick,
    handleDeleteCampaign,
    handleCloneClick,
  } = props;
  const router = useRouter();
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );
  const { campaignList, loading, filters, tabCounts } = campaignState;
  const [popoverVisible, setPopoverVisible] = useState(null); // store row id or index
  const emailMarketingCampaignTableColumns = [
    {
      title: 'Campaign name',
      dataIndex: 'campaign_name',
      key: 'campaign_name',
      width: 320,
      fixed: 'left',
      sorter: true,
      render: (_, record) => {
        const handleCampaignClick = () => {
          const messageId = record.message_id;
          const status = record.status_text?.toLowerCase();
          const isABTest = record.camp_type === 'ab_testing';

          if (status === 'draft') {
            router.push(
              isABTest
                ? `/email-marketing/campaign/${messageId}/createAB`
                : `/email-marketing/campaign/${messageId}/edit-campaign`
            );
          } else if (
            status === 'sent' ||
            status === 'pending' ||
            status === 'processing'
          ) {
            router.push(
              `/email-marketing/campaign/${messageId}?isAbTest=${isABTest}`
            );
          } else if (status === 'scheduled') {
            router.push(
              isABTest
                ? `/email-marketing/campaign/${messageId}/createAB`
                : `/email-marketing/campaign/${messageId}/edit-campaign`
            );
          } else {
            // fallback
            router.push({
              pathname: `/email-marketing/campaign/${messageId}`,
              query: { isAbTest: isABTest ? 'true' : 'false' },
            });
          }
        };

        return (
          <div>
            {record?.camp_type === 'ab_testing' && (
              <Tag
                color={'#4ABC96'}
                style={{
                  marginBottom: 5,
                  borderRadius: '6px',
                  background: '#EDFEF8',
                  border: '1.5px solid #4ABC96',
                  color: '#4ABC96 ',
                  fontWeight: 500,
                }}
              >
                A/B
              </Tag>
            )}
            <Text
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCampaignClick();
              }}
              style={{
                color: 'rgb(26, 115, 232)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {record.campaign_name}
            </Text>
            <Paragraph
              type="secondary"
              style={{
                marginBottom: 10,
                fontWeight: 400,
                lineHeight: '16px',
                letterSpacing: '0.16px',
                marginTop: '5px',
              }}
            >
              Email subject : {record.email_subject}
            </Paragraph>
            <Paragraph
              type="secondary"
              style={{
                margin: 0,
                textTransform: 'capitalize',
                fontWeight: 500,
                color:
                  record.is_admin_approval === '0' &&
                  record.is_admin_declined === '0'
                    ? 'orange'
                    : record.is_admin_declined === '1'
                      ? 'red'
                      : '',
              }}
            >
              {record.is_admin_approval === '0' &&
              record.is_admin_declined === '0'
                ? 'Under review'
                : record.is_admin_declined === '1'
                  ? 'Declined'
                  : ''}
            </Paragraph>
            {record?.camp_type === 'ab_testing' &&
            record?.status_text === 'pending' ? (
              <Paragraph
                type="secondary"
                style={{
                  margin: 0,
                }}
              >
                {`Total recipient(s) : ${record.total_count} `}
              </Paragraph>
            ) : (
              <Paragraph
                type="secondary"
                style={{
                  margin: 0,
                  textTransform: 'capitalize',
                }}
              >
                {`${record.status_text} on `}
                <SendTime
                  dangerouslySetInnerHTML={{ __html: record.send_time }}
                />
              </Paragraph>
            )}
            {record.status_text !== 'draft' && (
              <Paragraph
                type="secondary"
                style={{
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Created on{' '}
                <SendTime
                  dangerouslySetInnerHTML={{
                    __html: record.created_date_with_shops_timezone,
                  }}
                />
              </Paragraph>
            )}
            {record?.messageInfo && record?.messageInfo !== '' && (
              <Paragraph
                type="secondary"
                style={{
                  marginBottom: 5,
                  lineHeight: '16px',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Message :-{' '}
                <span
                  style={{
                    marginBottom: 5,
                    color: 'rgb(26, 115, 232)',
                    lineHeight: '16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {record?.messageInfo?.name}
                </span>
              </Paragraph>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status_text',
      key: 'status',
      sorter: true,
      render: (status) => {
        const statusStyles = {
          sent: {
            backgroundColor: '#d9f7be', // light green
            color: '#389e0d',
          },
          pending: {
            backgroundColor: '#fff7e6', // light orange
            color: '#d46b08',
          },
          draft: {
            backgroundColor: '#E6EBF5', // light gray-blue
            color: '#576F7C',
          },
          scheduled: {
            backgroundColor: '#e6f4ff', // light blue
            color: '#0958d9',
          },
          incomplete: {
            backgroundColor: '#fff1f0', // light red
            color: '#cf1322',
          },
          processing: {
            backgroundColor: '#f9f0ff', // light purple
            color: '#531dab',
          },
        };

        return (
          <Tag
            style={{
              ...statusStyles[status],
              border: '1px solid',
              borderColor: statusStyles[status].backgroundColor,
              textTransform: 'capitalize',
              fontWeight: 500,
              width: 100, // set fixed width
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            {status === 'pending' ? 'processing' : status}
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
          <Text>{record.total_sent}</Text>
          <br />
          <Text type="secondary">{record.sent_percentage}% Sent</Text>
        </>
      ),
    },
    {
      title: 'Opened',
      key: 'opened',
      width: 140,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.total_open}</Text>
          <br />
          <Text type="secondary">{record.opened}% Open</Text>
        </>
      ),
    },
    {
      title: 'Clicked',
      key: 'clicked',
      width: 140,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.total_click}</Text>
          <br />
          <Text type="secondary">{record.clicked}% Click</Text>
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
          <Text>{record.total_orders}</Text>
          <br />
          {/* <Text type="secondary">{record.order_rate}% Order placed</Text> */}
          <Text type="secondary">Order placed</Text>
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
          <Text>{record.total_order_amount}</Text>
          <br />
          {/* <Text type="secondary">{record.order_rate}% Revenue</Text> */}
          <Text type="secondary">Revenue</Text>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <AitPopover
          content={
            <CampaignActionContent
              record={record}
              status={record.status_text}
              handleEditClick={(campaignId) => {
                handleEditClick(campaignId);
                setPopoverVisible(null);
              }}
              handleViewClick={(id) => {
                handleViewClick(id, record.camp_type === 'ab_testing');
                setPopoverVisible(null);
              }}
              handleDeleteCampaign={(campaignId) => {
                handleDeleteCampaign(campaignId);
                setPopoverVisible(null);
              }}
              handleCloneClick={(campaignId) => {
                handleCloneClick(campaignId);
                setPopoverVisible(null);
              }}
              handleEditABClick={(id) => {
                router.push(`/email-marketing/campaign/${id}/createAB`);
                setPopoverVisible(null);
              }}
            />
          }
          trigger="click"
          placement="bottomRight"
          overlayClassName="action-dropdown"
          open={popoverVisible === record.id}
          onOpenChange={(visible) =>
            setPopoverVisible(visible ? record.id : null)
          }
        >
          <Button type="text" color="primary" shape="circle" size={'large'}>
            <EllipsisOutlined />
          </Button>
        </AitPopover>
      ),
    },
  ];

  return (
    <>
      <AitTable
        rowKey="id"
        heading=""
        dataSource={campaignList}
        loading={loading}
        columns={emailMarketingCampaignTableColumns}
        onSearch={handleSearch}
        onDateChange={handleDateChange}
        resetFilters={handleResetFilters}
        onChange={handleTableChange}
        pagination={{
          current: Number(filters.currentPage),
          pageSize: Number(filters.limit),
          // total: tabCounts?.[activeTab] ?? 0,
          total: campaignState.totalRecords || 0,
          showSizeChanger: true,
        }}
        showSorterTooltip={false}
        scroll={{ x: 'max-content', y: 100 * 5 }}
        marginleft="-10px"
        marginright="-10px"
      />
    </>
  );
};

export default CampaignListTable;
