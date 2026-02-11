import AitCard from '@/components/atoms/ait-card/aitCard';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import GiftCodePage from './GiftCodes';
import UploadGiftCodes from './UploadGiftCodes';
import ReferralCodesPage from './ReferralCodes';
import { useState } from 'react';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';

function GiftCodeTamplate() {
  const [activeTab, setActiveTabe] = useState('1');
  return (
    <>
      <AitPageHeader
        title="Gift code"
        subtitle="List of all purchase codes"
        hideButton
      />
      <AitCard
        hascustomheader={true}
        custombodypadding={{ md: '12px 24px 10px 24px' }}
        hastabs={true}
        customheaderleft={
          <AitTabs
            hascustomheader={true}
            hascardheaderrightsection={true}
            activeKey={activeTab}
            onChange={(e) => setActiveTabe(e)}
            defaultActiveKey="1"
            items={[
              { label: 'Gift codes', key: '1' },
              { label: 'Upload gift codes', key: '2' },
              { label: 'Referral codes', key: '3' },
            ]}
          />
        }
      >
        {activeTab === '1' && <GiftCodePage activeTab={activeTab} />}

        {activeTab === '2' && <UploadGiftCodes activeTab={activeTab} />}

        {activeTab === '3' && <ReferralCodesPage activeTab={activeTab} />}
      </AitCard>
    </>
  );
}

export default GiftCodeTamplate;
