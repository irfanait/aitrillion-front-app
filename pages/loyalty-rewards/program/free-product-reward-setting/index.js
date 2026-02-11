import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import FreeProductRewardSetting from '@/modules/loyalty-rewards/setUpProgram/free-product-reward-setting';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <FreeProductRewardSetting />
    </LoyaltyRewardsLayout>
  );
}
