import React from 'react';
import LoyaltyRewardsLayout from '../layout';
import DisplayOnStoreTemplate from '@/modules/loyalty-rewards/displayOnStore';



export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <DisplayOnStoreTemplate />
    </LoyaltyRewardsLayout>
  );
}
