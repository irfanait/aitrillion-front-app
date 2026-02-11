/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
// import { LayoutContainer } from './style';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import {
  getDashboardDataService,
  updateModuleService,
  versionChangeService,
} from '@/modules/loyalty-rewards/api/dashboard';
import {
  addDashboardData,
  loyaltyDashboardData,
  resetDashboardData,
} from '@/modules/loyalty-rewards/redux/dashboard/dashboardSlice';
import logger from '@/utils/logger';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import AitLayoutWrapper from '@/components/atoms/ait-layout-wrapper/AitLayoutWrapper';
import { getToken } from '@/utils/authHelpers';
import { App } from 'antd';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import { encodedShopId } from '@/modules/layouts/utils/constants';

export default function LoyaltyRewardsLayout({ children }) {
  const token = getToken();
  const authData = useSelector((state) => state);
  const router = useRouter();
  const dispatch = useDispatch();
  const dashboardData = useSelector(loyaltyDashboardData);
  const { notification } = App.useApp();
  const [moduleStatusLoading, setModuleStatusLoading] = useState(false);
  const [chageVersionLoading, setChangeVersionLoading] = useState(false);

  const onChangeModuleStatus = async (e) => {
    e.stopPropagation();
    setModuleStatusLoading(true);
    try {
      const formData = new FormData();
      formData.append('moduleid', '2');

      const res = await updateModuleService(formData);
      if (res?.status === 'success') {
        notification.success({
          message: 'Status updated successfully.',
        });
        dispatch(
          addDashboardData({
            ...dashboardData,
            module_status_data: {
              ...dashboardData.module_status_data,
              module_status:
                dashboardData.module_status_data.module_status === 1 ? 0 : 1,
            },
          })
        );
      }
    } catch (error) {
      logger(error.response?.data || error.message);
    } finally {
      setModuleStatusLoading(false);
    }
  };

  const getDashboardData = async () => {
    try {
      const res = await getDashboardDataService();
      if (res.status === 'success') {
        dispatch(resetDashboardData());
        dispatch(addDashboardData(res));
      }
    } catch (error) {
      logger(error.response?.data || error.message);
    }
  };

  const handleVersionChange = async () => {
    setChangeVersionLoading(true);
    try {
      let payload = {
        act: 'update_enable_email_marketing_v2',
        module_type: 'loyalty',
        is_enable_loyalty_v2: '0',
      };
      const res = await versionChangeService(payload);
      if (res.status === 'success') {
        // window.location.replace(
        //   `${process.env.NEXT_PUBLIC_APP_URL}/loyalty/loyalty/home`
        // );
        window.location.replace(
          `${process.env.NEXT_PUBLIC_APP_URL}/loyalty/index/index/q/${authData?.jwtState?.login_auth?.encoded_shop_id}/url/loyalty-home?ai_v2=${token}`
        );
      }
    } catch (error) {
      logger(error.response?.data || error.message);
    } finally {
      setChangeVersionLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <AitLayoutWrapper>
      {authData?.loggedInUserDetailsState?.userDetails?.is_enable_loyalty_v2 ===
        '1' &&
        router?.route === moduleRoute?.loyalty_rewards?.dashboard && (
          <AitAlert
            type="warning"
            hascustomicon={false}
            bgcolor="#2f80ed"
            color="#ffffff"
            message="Welcome to AiTrillion Loyalty Rewards v2 – Faster, Smarter & More Optimized! Having issue?"
            buttonText={
              chageVersionLoading
                ? 'Switching...'
                : 'Switch back to Loyalty Rewards v1'
            }
            onClick={() => handleVersionChange()}
          />
        )}
      {(dashboardData?.module_status_data?.module_status === 0 ||
        dashboardData?.module_status_data?.module_status === 2) && (
        <AitAlert
          type="warning"
          hascustomicon={false}
          bgcolor={'#cdd8ea'}
          color="#374C76"
          barpadding="6px 10px 8px 10px"
          message={'Currently your loyalty module is disabled'}
          buttonText={'Enable now'}
          onClick={(e) => {
            onChangeModuleStatus(e);
          }}
          buttonVariant={'solid'}
          buttonSize={'small'}
          buttonstyle={{
            backgroundColor: '#234CA5 !important',
            color: '#fff !important',
            borderColor: '#234CA5 !important',
            // marginLeft: '8px',
            fontWeight: '500',
          }}
          buttonhoverstyle={{
            backgroundColor: '#234CA5 !important',
            color: '#fff !important',
            borderColor: '#234CA5 !important',
          }}
          btnLoading={moduleStatusLoading}
          gap={6}
        />
      )}
      <MainWrapper>
        {/* <FullPageLoader loading={moduleStatusLoading}> */}
        {children}
        {/* </FullPageLoader> */}
      </MainWrapper>
    </AitLayoutWrapper>
  );
}
