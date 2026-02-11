import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableHeader, TableSection, Wrapper } from './style';
import AitTable from '@/components/molecules/ait-table/aitTable';
import Link from 'next/link';
import {
  setCampaignDetailsFilters,
  setClickMessageDetailsFilters,
  setOpenMessageDetailsFilters,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import {
  getCampaignDetailsApi,
  getClickedMessageList,
  getOpenedmessageListApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { Col, Row, Spin } from 'antd';
import { useRouter } from 'next/router';
import AitCard from '@/components/atoms/ait-card/aitCard';

const CampaignRecipientActivity = ({ activeTab, resolveMessageId }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const router = useRouter();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const {
    campaignDetailsData,
    getCampaignDetailsFilter,
    campaignDetailsLoading,
    openmessagedetails,
    openMessageListLoading,
    clickedMessagedetails,
    clickedMessageListLoading,
  } = campaignState;

  const sentList = campaignDetailsData?.sentmessagedetail || [];
  const totalSent = campaignDetailsData?.totalrecord || 0;
  const sentPage = getCampaignDetailsFilter?.sentpage || 1;
  const totalPages = Number(campaignDetailsData?.totalpages || 1);

  const openMessageList = openmessagedetails?.openmessagedetail || [];
  const totalOpenedRecords = openmessagedetails?.totalrecord || 0;

  const clickedMessageList = clickedMessagedetails?.clickmessagedetail || [];
  const totalClickedRecords = clickedMessagedetails?.totalrecord || 0;

  useEffect(() => {
    if (router?.query?.id) {
      const messageId = resolveMessageId();
      const openMessagePayload = {
        act: 'open_message_detail',
        currentPage: 1,
        openpage: 1,
        message_type: 'email',
        messageType: 'email',
        message_id: messageId,
        module_id: messageId,
      };
      // Normalize variant value
      const variant = Array.isArray(router.query.variant)
        ? router.query.variant[0]
        : router.query.variant;

      if (
        variant &&
        ['A', 'B', 'WINNER'].includes(variant.trim().toUpperCase())
      ) {
        openMessagePayload.ctype = 'ab';
      }

      dispatch(setOpenMessageDetailsFilters(openMessagePayload));
      dispatch(getOpenedmessageListApi());

      const clickMessagePayload = {
        act: 'click_message_detail',
        currentPage: 1,
        clickpage: 1,
        messageType: 'email',
        message_type: 'email',
        message_id: messageId,
        module_id: messageId,
      };

      if (
        variant &&
        ['A', 'B', 'WINNER'].includes(variant.trim().toUpperCase())
      ) {
        clickMessagePayload.ctype = 'ab';
      }

      dispatch(setClickMessageDetailsFilters(clickMessagePayload));
      dispatch(getClickedMessageList());
    }
  }, [router?.query?.id, router?.query?.variant, activeTab]);

  // Scroll handler
  const fetchingRef = useRef(false);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    const allPagesLoaded = totalPages !== 0 && sentPage >= totalPages;

    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50 &&
      !campaignDetailsLoading &&
      !allPagesLoaded &&
      !fetchingRef.current
    ) {
      fetchingRef.current = true;

      const messageId = resolveMessageId();
      const nextPage = sentPage + 1;

      const payload = {
        act: 'message_detail',
        clickpage: 1,
        currentPage: nextPage,
        messageType: 'email',
        message_type: 'email',
        message_id: messageId,
        module_id: messageId,
        opencurrentPage: 1,
        openpage: 1,
        scrollpage: 'sent',
        sentpage: nextPage,
        shop_domain: 'shopifi-breaking-changes-dev-04-gwbdemo.myshopify.com', // You can make this dynamic if needed
      };

      dispatch(setCampaignDetailsFilters(payload));
      dispatch(getCampaignDetailsApi()).finally(() => {
        fetchingRef.current = false;
      });
    }
  }, [dispatch, sentPage, totalPages, campaignDetailsLoading]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const sentTableColumns = [
    {
      title: 'Name',
      dataIndex: 'first_name',
      key: 'name',
      width: 200,
      render: (_, record) => (
        <Link href="#">
          {`${record.first_name || ''} ${record.last_name || ''}`.trim()}
        </Link>
      ),
    },
    {
      title: 'Email address',
      dataIndex: 'email',
      key: 'email',
      width: 300,
    },
    {
      title: 'Sent date',
      dataIndex: 'sent_date',
      key: 'sent_date',
      width: 180,
    },
    {
      title: 'Opened',
      dataIndex: 'opened',
      key: 'opened',
      width: 120,
    },
    {
      title: 'Clicked',
      dataIndex: 'clicked',
      key: 'clicked',
      width: 120,
    },
  ];

  const openedTableColumns = [
    {
      title: 'Name',
      dataIndex: 'first_name',
      key: 'name',
      width: 200,
      render: (_, record) => (
        <Link href="#">
          {`${record.first_name || ''} ${record.last_name || ''}`.trim()}
        </Link>
      ),
    },
    {
      title: 'Email address',
      dataIndex: 'email',
      key: 'email',
      width: 300,
    },
    {
      title: 'Sent date',
      dataIndex: 'sent_date',
      key: 'sent_date',
      width: 180,
    },
    {
      title: 'Opened',
      dataIndex: 'opened',
      key: 'opened',
      width: 120,
    },
  ];

  const clickedTableColumns = [
    {
      title: 'Name',
      dataIndex: 'first_name',
      key: 'name',
      width: 200,
      render: (_, record) => (
        <Link href="#">
          {`${record.first_name || ''} ${record.last_name || ''}`.trim()}
        </Link>
      ),
    },
    {
      title: 'Email address',
      dataIndex: 'email',
      key: 'email',
      width: 300,
    },
    {
      title: 'Sent date',
      dataIndex: 'sent_date',
      key: 'sent_date',
      width: 180,
    },
    {
      title: 'Clicked',
      dataIndex: 'clicked',
      key: 'clicked',
      width: 120,
    },
  ];

  return (
    <Wrapper>
      <Row gutter={[16, 16]}>
        {/* Sent Table */}
        <Col xs={24} md={24}>
          <AitCard
            title={`Sent (${totalSent})`}
            borderless={true}
            titlefontsize={'16px'}
          >
            <div
              className="scrollbar-color"
              ref={scrollRef}
              style={{
                height: '300px',
                overflowY: 'auto',
                overflowX: 'hidden',
                marginLeft: -10,
                marginRight: -10,
              }}
            >
              <AitTable
                scrollwidth="none"
                columns={sentTableColumns}
                showFilters={false}
                dataSource={sentList}
                pagination={false}
                scroll={{ x: 600 }}
                loading={campaignDetailsLoading}
                sticky
                marginleft={'0px'}
                marginright={'0px'}
              />
              {campaignDetailsLoading && sentPage > 1 && (
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <Spin />
                </div>
              )}
              {!campaignDetailsLoading && sentPage >= totalPages && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    color: '#888',
                  }}
                >
                  End of the list
                </div>
              )}
            </div>
          </AitCard>
        </Col>

        {/* Opened Table */}
        <Col xs={24} md={24}>
          <AitCard
            title={`Opened (${totalOpenedRecords})`}
            borderless={true}
            scrollwidth="none"
            titlefontsize={'16px'}
          >
            <div
              className="scrollbar-color"
              style={{
                height: '300px',
                overflowY: 'auto',
                overflowX: 'hidden',
                marginLeft: -10,
                marginRight: -10,
              }}
            >
              <AitTable
                columns={openedTableColumns}
                showFilters={false}
                dataSource={openMessageList}
                pagination={false}
                scroll={{ x: 600 }}
                loading={openMessageListLoading}
                sticky
                marginleft={'0px'}
                marginright={'0px'}
                scrollwidth="none"
              />
            </div>
          </AitCard>
        </Col>

        {/* Clicked Table */}
        <Col xs={24} md={24}>
          <AitCard
            title={`Clicked (${clickedMessageList?.length})`}
            borderless={true}
            titlefontsize={'16px'}
          >
            <div
              className="scrollbar-color"
              style={{
                height: '300px',
                overflowY: 'auto',
                overflowX: 'hidden',
                marginLeft: -10,
                marginRight: -10,
              }}
            >
              <AitTable
                scrollwidth="none"
                columns={clickedTableColumns}
                showFilters={false}
                dataSource={clickedMessageList}
                pagination={false}
                scroll={{ x: 600 }}
                loading={clickedMessageListLoading}
                sticky
                marginleft={'0px'}
                marginright={'0px'}
              />
            </div>
          </AitCard>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default CampaignRecipientActivity;
