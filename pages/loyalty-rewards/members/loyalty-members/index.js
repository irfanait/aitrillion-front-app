import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import LoyaltyMembersListTamplate from '@/modules/loyalty-rewards/members/loyalty-members-list-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <LoyaltyMembersListTamplate />
    </LoyaltyRewardsLayout>
  );
}
