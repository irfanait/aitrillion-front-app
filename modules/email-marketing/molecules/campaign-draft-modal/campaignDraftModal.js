import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { ModalBody } from './style';
import { useSelector } from 'react-redux';

const CampaignDraftModal = ({ visible, setVisible, saveAsDraftClick }) => {
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );
  return (
    <AitModal
      open={visible}
      setVisible={setVisible}
      width={400}
      centered
      headerBorderBottom
      closable={false}
    >
      <ModalBody>
        <div className="icon">
          <SaveOutlined />
        </div>
        <div className="message">Do you want to keep it in draft?</div>
        <div className="actions">
          <AitButton
            title="No"
            onClick={() => {
              setVisible(false);
            }}
            style={{ width: '100%' }}
          />
          <AitButton
            title="Yes"
            type="primary"
            onClick={saveAsDraftClick}
            loading={campaignState?.sendEmailLoading}
            style={{ width: '100%' }}
          />
        </div>
      </ModalBody>
    </AitModal>
  );
};

export default CampaignDraftModal;
