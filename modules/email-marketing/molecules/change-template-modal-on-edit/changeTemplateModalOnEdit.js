import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import React from 'react';
import CreateCampaignRightSection from '../../organisms/create-campaign-right-section/createCampaignRightSection';
import CreateCampaignRightSectionNew from '../../organisms/create-campaign-right-section-new/createCampaignRightSectionNew';

const ChangeTemplateModalOnEdit = (props) => {
  const {
    visible,
    setVisible,
    handleChoosePreMadeTemplateonEdit,
    setShowTemplatePreview,
    isEditMode,
    setChooseTemplateModalVisible,
    setWasSubjectAutoFilled,
    handleUseNowcCampaignFromSavedTab,
  } = props;

  return (
    <>
      <AitModal width={900} centered open={visible} setVisible={setVisible}>
        <CreateCampaignRightSectionNew
          handleShowTemplatePreview={(value) => {
            setShowTemplatePreview(value);
          }}
          handleChoosePreMadeTemplateonEdit={(type) => {
            setVisible(false);
            handleChoosePreMadeTemplateonEdit(type);
          }}
          setVisible={setVisible}
          isEditMode={isEditMode}
          setChooseTemplateModalVisible={setChooseTemplateModalVisible}
          setWasSubjectAutoFilled={setWasSubjectAutoFilled}
        />
      </AitModal>
    </>
  );
};

export default ChangeTemplateModalOnEdit;
