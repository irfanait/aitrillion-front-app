import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import PointExpiryTamplate from '@/modules/loyalty-rewards/setUpProgram/point-expiry-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <PointExpiryTamplate />
    </LoyaltyRewardsLayout>
  );
}
