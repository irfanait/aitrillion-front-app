import React from 'react';
import { useSelector } from 'react-redux';
import HtmlPreviewer from '../html-previewer/htmlPreviewer';
import { FullHeightCard } from './style';

const CampaignMessageTab = () => {
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  return (
    <FullHeightCard>
      <HtmlPreviewer
        htmlString={
          campaignState?.campaignDetailsData?.messagedetail?.email_content ||
          '<p>No content</p>'
        }
      />
    </FullHeightCard>
  );
};

export default CampaignMessageTab;
