import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import RedeemPointsTamplate from '@/modules/loyalty-rewards/setUpProgram/redeem-points-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <RedeemPointsTamplate />
    </LoyaltyRewardsLayout>
  );
}
