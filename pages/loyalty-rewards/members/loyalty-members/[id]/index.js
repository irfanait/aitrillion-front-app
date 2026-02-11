import React from 'react';
import LoyaltyRewardsLayout from '@/pages/loyalty-rewards/layout';
import CustomerDetailsTamplate from '@/modules/loyalty-rewards/setUpProgram/gift-code-tamplate/CustomerDetailsPage';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <CustomerDetailsTamplate />
    </LoyaltyRewardsLayout>
  );
}
