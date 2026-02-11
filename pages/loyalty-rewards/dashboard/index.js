import LoyaltyRewardsDashboardTemplate from '@/modules/loyalty-rewards/loyalty-rewards-dashboard-tamplate';
import { resetDashboardData } from '@/modules/loyalty-rewards/redux/dashboard/dashboardSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import LoyaltyRewardsLayout from '../layout';

export default function Page() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   return () => {
  //     dispatch(resetDashboardData());
  //   };
  // }, [dispatch]);

  return (
    <LoyaltyRewardsLayout>
      <LoyaltyRewardsDashboardTemplate />
    </LoyaltyRewardsLayout>
  );
}
