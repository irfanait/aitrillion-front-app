import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import EmailSettingTamplate from '@/modules/loyalty-rewards/settings/email-settings-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <EmailSettingTamplate />
    </LoyaltyRewardsLayout>
  );
}
