import { Col } from 'antd';
import React, { useEffect } from 'react';
import {
  TableHeader,
  TableSection,
  Wrapper,
} from '../campaign-recipient-activity/style';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { getLinkActivityMessageList } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { setLinkActivityMessageDetailsFilters } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AitCard from '@/components/atoms/ait-card/aitCard';
import Link from 'next/link';

const CampaignLinkActivityTab = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { linkActivityMessagedetails, linkActivityMessageListLoading } =
    campaignState;

  const orderMessageList = linkActivityMessagedetails?.clickedUrlsList || [];
  const totalOrdersRecords = linkActivityMessagedetails?.totalrecord || 0;

  useEffect(() => {
    if (router?.query?.id) {
      dispatch(
        setLinkActivityMessageDetailsFilters({
          act: 'click_url_list',
          message_id: router?.query?.id,
          module_id: router?.query?.id,
        })
      );
      dispatch(getLinkActivityMessageList());
    }
  }, [router?.query?.id]);

  const linkActivityTableColumn = [
    {
      title: 'Total clicks',
      dataIndex: 'total_clicks',
      key: 'total_clicks',
      render: (_, record) => <Link href="#">{record.counter || ''}</Link>,
    },
    {
      title: 'Links Clicked',
      dataIndex: 'emaillinks_clicked',
      key: 'emaillinks_clicked',
      render: (_, record) => (
        <Link href={record.url || ''} target="_blank">
          {record.url || ''}
        </Link>
      ),
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
              columns={linkActivityTableColumn}
              showFilters={false}
              dataSource={orderMessageList}
              pagination={false}
              scroll={{ x: 600 }}
              loading={linkActivityMessageListLoading}
              scrollwidth={'none'}
              sticky
              marginleft={'0px'}
              marginright={'0px'}
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

export default CampaignLinkActivityTab;
