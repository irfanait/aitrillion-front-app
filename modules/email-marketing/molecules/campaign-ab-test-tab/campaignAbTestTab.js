import React, { useEffect, useState } from 'react';
import { Wrapper } from '../campaign-recipient-activity/style';
import { Alert, App, Col, Popover, Space, Tag, Typography } from 'antd';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { useDispatch, useSelector } from 'react-redux';
import { CreateAbTag } from './style';
import { EllipsisOutlined, TrophyOutlined } from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import TemplatePreviewModal from '../template-preview-modal/templatePreviewModal';
import { useRouter } from 'next/router';
import { formatByValue } from '../../utils/helper';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import {
  chooseAsWinnerApi,
  getCampaignDetailsApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { chooseAsWinnerReset } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
const { Text, Paragraph } = Typography;

const CampaignAbTestTab = ({
  setActiveTab,
  variantIds,
  setSelectedVersionAB,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const {
    campaignDetailsData,
    campaignDetailsLoading,
    chooseAsWinnerApiState,
    chooseAsWinnerData,
    chooseAsWinnerLoading,
  } = campaignState;
  const [templatePreviewModalVisible, setTemplatePreviewModalVisible] =
    useState(false);
  const [selectedHtmlContent, setSelectedHtmlContent] = useState('');
  const [chooseAsWinnerModalVisible, setChooseAsWinnerModalVisible] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const abTestingRows =
    campaignDetailsData?.abTestingData?.messageABTestingRows || [];

  useEffect(() => {
    if (chooseAsWinnerApiState === 'success') {
      setChooseAsWinnerModalVisible(false);
      setSelectedRecord(null);
      notification.success({ message: chooseAsWinnerData?.msg });
      dispatch(getCampaignDetailsApi());
      dispatch(chooseAsWinnerReset());
    }

    if (chooseAsWinnerApiState === 'error') {
      notification.error({
        message: chooseAsWinnerData?.msg || 'Error',
      });
      dispatch(chooseAsWinnerReset());
    }
  }, [chooseAsWinnerApiState]);

  // New summary row to get winner info
  const summaryRow = abTestingRows.find((row) => !row?.campaign_variation);

  const getWinnerObject = (rows) => {
    if (!rows || rows.length === 0) return null;

    // Parent row holds the abtesting_win_camp_id
    const parentRow = rows.find((row) => !row.campaign_variation);
    const winnerId = parentRow?.abtesting_win_camp_id;

    if (!winnerId) return null;
    return rows.find((row) => row?.id === winnerId);
  };

  const winnerObject = getWinnerObject(abTestingRows);

  // 1. keep only variant rows (A & B)
  let abTestingRowsWithoutParent = abTestingRows.filter(
    (row) => row.campaign_variation // removes parent row
  );

  // 2. get parent row (contains final winner send_time etc.)
  const parentRow = abTestingRows.find((row) => !row.campaign_variation);

  if (winnerObject && parentRow) {
    // use parentRow (with correct send_time) for Winner row
    const winnerRow = {
      ...parentRow,
      campaign_variation: 'Winner',
      isWinnerRow: true,
      winnerVariant: winnerObject.campaign_variation?.toUpperCase(), // keep info of which variant won
    };

    // Final order: A, B, Winner
    abTestingRowsWithoutParent = [...abTestingRowsWithoutParent, winnerRow];
  }

  const resolveVariantKey = (messageId) => {
    if (messageId === variantIds.A) return 'A';
    if (messageId === variantIds.B) return 'B';
    if (messageId === variantIds.WINNER) return 'WINNER';
    return 'ALL'; // fallback
  };

  const AudienceTableColumns = [
    {
      title: 'Version',
      dataIndex: 'campaign_variation',
      key: 'campaign_variation',
      render: (_, record) => {
        if (record.campaign_variation === 'Winner') {
          return (
            <CreateAbTag style={{ fontWeight: 600, color: '#1890ff' }}>
              <TrophyOutlined />
            </CreateAbTag>
          );
        }

        return (
          <CreateAbTag>
            {record?.campaign_variation?.toUpperCase() ?? ''}
          </CreateAbTag>
        );
      },
    },
    {
      title: 'Message',
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
            router.push(`/email-marketing/campaign/${messageId}`);
          }
        };

        return (
          <div>
            <Text
              onClick={handleCampaignClick}
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
              }}
            >
              {`${record.when_to_send} on `}
              <span
                type="secondary"
                style={{
                  marginBottom: 5,
                  lineHeight: '16px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                dangerouslySetInnerHTML={{ __html: record.send_time }}
              />
            </Paragraph>
            {record.status_text !== 'draft' && (
              <Paragraph
                type="secondary"
                style={{
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Created on{' '}
                <span
                  type="secondary"
                  style={{
                    marginBottom: 5,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: record.created_date_with_shops_timezone,
                  }}
                />{' '}
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
      dataIndex: 'when_to_send',
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
          textTransform: 'capitalize',
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
          <Text type="secondary">{record.order_rate}% Order placed</Text>
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
          <Text type="secondary">{record.order_rate}% Revenue</Text>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <>
          <Popover
            content={
              <Space direction="vertical">
                <AitButton
                  color="default"
                  variant="text"
                  title="Preview"
                  onClick={() => {
                    setSelectedHtmlContent(record.email_content);
                    setTemplatePreviewModalVisible(true);
                  }}
                />
                <AitButton
                  color="default"
                  variant="text"
                  title="Performance"
                  onClick={() => {
                    setActiveTab('overview');
                    const variantKey = resolveVariantKey(record?.message_id);
                    setSelectedVersionAB(variantKey);
                    router.push(
                      `/email-marketing/campaign/${record?.message_id}?isAbTest=true`,
                      undefined,
                      { shallow: true }
                    );
                  }}
                />
                {campaignDetailsData?.abTestingData?.status !== '2' && (
                  <AitButton
                    color="default"
                    variant="text"
                    title="Choose as winner"
                    onClick={() => {
                      setSelectedRecord(record);
                      setChooseAsWinnerModalVisible(true);
                    }}
                  />
                )}
              </Space>
            }
            trigger="click"
            placement="bottom"
          >
            <AitButton type="text" icon={<EllipsisOutlined />} />
          </Popover>
        </>
      ),
    },
  ];

  const handleChooseAsWinner = () => {
    if (!selectedRecord) return;

    const parentCampaignId = campaignDetailsData?.abTestingData?.id; // or campaignDetailsData.id
    const payload = {
      act: 'make_as_winner_campaign',
      main_campaign_id: parentCampaignId,
      set_win_campaign_id: selectedRecord?.message_id, // ✅ correct variant campaign id (A or B)
    };

    dispatch(chooseAsWinnerApi(payload));
  };

  return (
    <Wrapper>
      <Col xs={24} md={24}>
        <AitCard
          title={`A/B test results`}
          borderless={true}
          titlefontsize={'16px'}
        >
          <div
            className="scrollbar-color"
            style={{
              height: 'auto',
              overflowY: 'auto',
              overflowX: 'hidden',
              marginLeft: -10,
              marginRight: -10,
            }}
          >
            <AitTable
              scrollwidth={'none'}
              columns={AudienceTableColumns}
              showFilters={false}
              dataSource={abTestingRowsWithoutParent}
              rowClassName={(record) =>
                record.isWinnerRow ? 'winner-row' : ''
              }
              pagination={false}
              scroll={{ x: 'max-content', y: 100 * 5 }}
              sticky
              marginleft={'0px'}
              marginright={'0px'}
            />
          </div>
        </AitCard>

        {/* {(campaignDetailsData?.abTestingData?.status === '0' ||
          (abTestingRows?.some(
            (row) =>
              row?.campaign_variation?.toUpperCase() === 'A' &&
              row?.status === '2'
          ) &&
            abTestingRows?.some(
              (row) =>
                row?.campaign_variation?.toUpperCase() === 'B' &&
                row?.status === '2'
            ))) && (
          <Alert
            message="A/B test is processing..."
            description={
              <>
                Version A/B is in progress for winner by{' '}
                {formatByValue(abTestingRows?.[0]?.abtesting_win_percent_by)}{' '}
                due by{'  '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: abTestingRows?.[0]?.abtesting_date_time,
                  }}
                />
              </>
            }
            style={{
              justifyContent: 'start',
              marginTop: '10px',
              borderRadius: '10px',
              backgroundColor: '#f39434ff !important',
              border: '1px solid #EFDCC7 !important',
            }}
            type="warning"
            banner
            hidedefaulticon={false}
          />
        )}

        {campaignDetailsData?.abTestingData?.when_to_send === 'sent' &&
          campaignDetailsData?.abTestingData?.status === '2' && (
            <Alert
              message="A/B test is completed"
              description={
                <>
                  Version{' '}
                  {getWinnerObject(
                    abTestingRows
                  )?.campaign_variation?.toUpperCase() || ''}{' '}
                  was selected as the winner by{' '}
                  {formatByValue(abTestingRows?.[0]?.abtesting_win_percent_by)}{' '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: parentRow?.send_time,
                    }}
                  />
                </>
              }
              style={{
                justifyContent: 'start',
                marginTop: '10px',
                borderRadius: '10px',
                backgroundColor: '#f39434ff !important',
                border: '1px solid #EFDCC7 !important',
              }}
              type="success"
              banner
              hidedefaulticon={false}
            />
          )} */}

        {/* ✅ Unified A/B Test Status Alerts */}
        {(() => {
          const abData = campaignDetailsData?.abTestingData || {};
          const rows = abTestingRows || [];
          const parentRow = rows.find((r) => !r?.campaign_variation) || {};

          const bothSent =
            rows.some(
              (r) =>
                r?.campaign_variation?.toUpperCase() === 'A' &&
                r?.status === '2'
            ) &&
            rows.some(
              (r) =>
                r?.campaign_variation?.toUpperCase() === 'B' &&
                r?.status === '2'
            );

          // ✅ Winner decided → completed
          if (abData?.abtesting_win_camp_id && abData?.status === '2') {
            return (
              <Alert
                message="A/B test is completed"
                description={
                  <>
                    Version{' '}
                    {getWinnerObject(rows)?.campaign_variation?.toUpperCase() ||
                      ''}{' '}
                    was selected as the winner by{' '}
                    {formatByValue(rows?.[0]?.abtesting_win_percent_by) ||
                      'open rate'}{' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: abData?.send_time || parentRow?.send_time || '',
                      }}
                    />
                  </>
                }
                style={{
                  justifyContent: 'start',
                  marginTop: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#E6F7E7',
                  border: '1px solid #B7E4B8',
                }}
                type="success"
                banner
              />
            );
          }

          // 🟠 Processing
          const isProcessing =
            abData?.status === '0' ||
            bothSent ||
            rows.some(
              (r) => r?.status === '0' || r?.when_to_send === 'pending'
            );

          if (isProcessing && !abData?.abtesting_win_camp_id) {
            return (
              <Alert
                message="A/B test is processing..."
                description={
                  <>
                    Version A/B is in progress for winner by{' '}
                    {formatByValue(rows?.[0]?.abtesting_win_percent_by) ||
                      'open rate'}{' '}
                    due by{' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          rows?.[0]?.abtesting_date_time ||
                          abData?.abtesting_date_time ||
                          '',
                      }}
                    />
                  </>
                }
                style={{
                  justifyContent: 'start',
                  marginTop: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#FFF5DA',
                  border: '1px solid #EFDCC7',
                }}
                type="warning"
                banner
              />
            );
          }

          return null;
        })()}
      </Col>

      <TemplatePreviewModal
        visible={templatePreviewModalVisible}
        setVisible={setTemplatePreviewModalVisible}
        htmlString={selectedHtmlContent}
        isActionButtonShow={false}
      />

      <AitConfirmationModal
        visible={chooseAsWinnerModalVisible}
        setVisible={setChooseAsWinnerModalVisible}
        description={'This campaign will be set as winner.'}
        onCancel={() => {
          setChooseAsWinnerModalVisible(false);
          setSelectedRecord(null);
        }}
        onConfirm={() => {
          handleChooseAsWinner();
        }}
        confirmButtonLoading={chooseAsWinnerLoading}
        message={'Are you sure?'}
        confirmText={'Yes, set as winner!'}
        cancelText={'No, cancel it!'}
      />
    </Wrapper>
  );
};

export default CampaignAbTestTab;
