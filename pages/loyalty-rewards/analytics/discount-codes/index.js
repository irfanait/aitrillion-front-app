import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import DiscountCodesListTamplate from '@/modules/loyalty-rewards/analytics/discount-codes-list-tamplate';
import DiscountCodesTamplate from '@/modules/loyalty-rewards/analytics/discount-codes-list-tamplate/discountCodes';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      {/* <DiscountCodesListTamplate /> */}
      <DiscountCodesTamplate />
    </LoyaltyRewardsLayout>
  );
}
