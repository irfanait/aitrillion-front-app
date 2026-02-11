import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import RewardOrdersPage from '@/modules/loyalty-rewards/setUpProgram/reward-orders-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <RewardOrdersPage />{' '}
    </LoyaltyRewardsLayout>
    // <>TEST</>
  );
}
