import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import EarnPointsTemplate from '@/modules/loyalty-rewards/setUpProgram/earn-points-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <EarnPointsTemplate />
    </LoyaltyRewardsLayout>
  );
}
