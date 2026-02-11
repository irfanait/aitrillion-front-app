import React from 'react';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitLayoutWrapper from '@/components/atoms/ait-layout-wrapper/AitLayoutWrapper';
import WebhooksListTemplate from '@/modules/webhooks/webhooks-list-template';

function Webhooks() {
  return (
    <AitLayoutWrapper>
      <MainWrapper>
        <WebhooksListTemplate />
      </MainWrapper>
    </AitLayoutWrapper>
  );
}

export default Webhooks;
