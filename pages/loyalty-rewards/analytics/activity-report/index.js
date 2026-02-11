import React from 'react';
import LoyaltyRewardsLayout from '../../layout';
import ActivityReportListTamplate from '@/modules/loyalty-rewards/analytics/activity-report-list-tamplate';

export default function Page() {
  return (
    <LoyaltyRewardsLayout>
      <ActivityReportListTamplate />
    </LoyaltyRewardsLayout>
  );
}
