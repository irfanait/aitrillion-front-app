import AitCard from '@/components/atoms/ait-card/aitCard';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { Card, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import CreateRewardsTamplate from './CreateRewards/index';
import ViewRewards from './ViewRewards';
import { getViewRewardsListService } from '../../api/redeemPoints';
import logger from '@/utils/logger';
import { useEffect, useState } from 'react';
import { CustomCard } from './style';

function RedeemPointsTamplate() {
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [activeTab, setActiveTab] = useState('viewReward');

  // console.log('listData', listData);

  const getViewRewardsList = async () => {
    setLoading(true);
    try {
      let payload = {
        new_request: 1,
      };
      const response = await getViewRewardsListService(payload);
      if (response?.status === 200) {
        if (response?.data?.storecreditpoints?.id) {
          setListData([
            ...[...(response?.data?.eventCollection ?? [])],
            response?.data?.storecreditpoints,
          ]);
        } else {
          setListData(response?.data?.eventCollection);
        }
        // setListData(response?.data?.eventCollection?.reverse());
        if (
          response?.data?.eventCollection?.length > 0 ||
          response?.data?.storecreditpoints?.id
        ) {
          setActiveTab('viewReward');
        } else {
          setActiveTab('createReward');
        }
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getViewRewardsList();
  }, []);

  return (
    <>
      <AitPageHeader
        title="Make your customers spend earned points"
        subtitle="Create rewards as ways to spend earned points."
        hideButton
      />
      <CustomCard title="">
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k)}
          bodypadding={{ md: '0px 0px 0px 0px' }}
        >
          <TabPane tab="Create rewards" key="createReward">
            <CreateRewardsTamplate
              setActiveTab={setActiveTab}
              getViewRewardsList={getViewRewardsList}
            />
          </TabPane>
          <TabPane tab="View rewards" key="viewReward">
            <ViewRewards
              loading={loading}
              listData={listData}
              getViewRewardsList={getViewRewardsList}
              setActiveTab={setActiveTab}
            />
          </TabPane>
        </Tabs>
      </CustomCard>
    </>
  );
}

export default RedeemPointsTamplate;
