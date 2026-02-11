import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import {
  TableHeader,
  TableSection,
  Wrapper,
} from '../campaign-recipient-activity/style';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { getAudienceMessageList } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { setAudienceMessageDetailsFilters } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import AitCard from '@/components/atoms/ait-card/aitCard';

const CampaignAudienceTab = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { audienceMessagedetails, audienceMessageListLoading } = campaignState;

  const audienceMessageList =
    audienceMessagedetails?.AudienceMessageDetails || [];

  useEffect(() => {
    if (router?.query?.id) {
      dispatch(
        setAudienceMessageDetailsFilters({
          act: 'audience_message_detail',
          message_id: router?.query?.id,
        })
      );
      dispatch(getAudienceMessageList());
    }
  }, [router?.query?.id]);

  const AudienceTableColumns = [
    {
      title: 'List/Segment name',
      dataIndex: 'name',
      key: 'segment_list_title',
      render: (_, record) => record.segment_list_title || '',
    },
    {
      title: 'Type',
      dataIndex: 'list_type',
      key: 'list_type',
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
              columns={AudienceTableColumns}
              showFilters={false}
              dataSource={audienceMessageList}
              pagination={false}
              scroll={{ x: 600 }}
              loading={audienceMessageListLoading}
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

export default CampaignAudienceTab;
