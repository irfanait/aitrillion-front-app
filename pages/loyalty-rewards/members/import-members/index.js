import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import ImportMembersListTamplate from '@/modules/loyalty-rewards/members/import-members-list-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <ImportMembersListTamplate />
    </LoyaltyRewardsLayout>
  );
}
