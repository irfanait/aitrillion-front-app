import { Col } from 'antd';
import React, { useEffect } from 'react';
import {
  TableHeader,
  TableSection,
  Wrapper,
} from '../campaign-recipient-activity/style';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { getOrderMessageList } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { setOrdersMessageDetailsFilters } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AitCard from '@/components/atoms/ait-card/aitCard';

const CampaignOrderTab = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { orderMessagedetails, orderMessageListLoading } = campaignState;

  const orderMessageList = orderMessagedetails?.ordersMessageDetails || [];
  const totalOrdersRecords = orderMessagedetails?.totalrecord || 0;

  useEffect(() => {
    if (router?.query?.id) {
      dispatch(
        setOrdersMessageDetailsFilters({
          act: 'order_message_detail',
          message_id: router?.query?.id,
          module_id: router?.query?.id,
        })
      );
      dispatch(getOrderMessageList());
    }
  }, [router?.query?.id]);

  const ordersTableColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Link href="#">
          {`${record.name || ''} ${record.last_name || ''}`.trim()}
        </Link>
      ),
    },
    {
      title: 'Email address',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Order Id',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Order amount',
      dataIndex: 'order_amount',
      key: 'order_amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <Wrapper>
      <Col xs={24} md={24}>
        <AitCard borderless={true} titlefontsize={'16px'}>
          <div
            className="scrollbar-color"
            style={{
              height: '350px',
              overflowY: 'auto',
              overflowX: 'hidden',
              marginLeft: -10,
              marginRight: -10,
            }}
          >
            <AitTable
              scrollwidth={'none'}
              columns={ordersTableColumn}
              showFilters={false}
              dataSource={orderMessageList}
              pagination={false}
              scroll={{ x: 600 }}
              loading={orderMessageListLoading}
              sticky
            />
            {/* {campaignDetailsLoading && sentPage > 1 && (
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
            )} */}
          </div>
        </AitCard>
      </Col>
    </Wrapper>
  );
};

export default CampaignOrderTab;
