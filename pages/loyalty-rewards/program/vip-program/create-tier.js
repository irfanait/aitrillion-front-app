import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import CreateTierTamplate from '@/modules/loyalty-rewards/setUpProgram/vip-program-tamplate/create-tier-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <CreateTierTamplate />
    </LoyaltyRewardsLayout>
  );
}
