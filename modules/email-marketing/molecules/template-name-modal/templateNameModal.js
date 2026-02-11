import React, { useState } from 'react';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { ButtonWrapper } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import { copyTemplateApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { setCopyTemplateFilters } from '@/redux/email-marketing-slices/templateSlice/email-marketing-template-slice';
import { useRouter } from 'next/router';

const TemplateNameModal = (props) => {
  const { visible, setVisible, useTemplateId, isEditMode } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const templateState = useSelector(
    (state) => state.emailMarketingTemplateState
  );
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const [useTemplateName, setUseTemplateName] = useState('');
  const [error, setError] = useState({
    errorState: false,
    errorMessage: '',
  });

  const handleUseClick = () => {
    if (useTemplateName.trim().length === 0) {
      setError({
        errorState: true,
        errorMessage: 'Please enter template name',
      });
      return;
    }

    let payload;

    if (isEditMode) {
      payload = {
        act: 'copy_template',
        campaign_id: router.query.id, // changed to campaign_id
        id: useTemplateId,
        is_update: 1,
        template_title: useTemplateName,
      };
    } else if (router?.pathname === '/email-marketing/templates/list') {
      payload = {
        act: 'copy_template',
        campaign_Id: 0, // original behavior
        id: useTemplateId,
        is_update: 1,
        template_title: useTemplateName,
      };
    } else {
      payload = {
        act: 'copy_template',
        campaignId: campaignState?.sendEmailData?.encoded_key_id, // original behavior
        id: useTemplateId,
        is_update: 1,
        template_title: useTemplateName,
      };
    }

    dispatch(setCopyTemplateFilters(payload));
    dispatch(copyTemplateApi());
  };

  return (
    <>
      <AitModal open={visible} setVisible={setVisible} centered>
        <>
          <AitInputBox
            label="Enter template name"
            labelFontSize="20px"
            name="tempalateName"
            required
            value={useTemplateName}
            onChange={(e) => {
              if (e.target.value) {
                setError({ errorState: false, errorMessage: '' });
              }
              setUseTemplateName(e.target.value);
            }}
            placeholder="Enter template name"
            error={error.errorState}
            errorMessage={error.errorMessage}
          />
          <ButtonWrapper style={{ marginTop: '20px' }}>
            <AitButton
              title={'Use'}
              type="primary"
              onClick={() => {
                handleUseClick();
              }}
              loading={templateState?.copyTemplateLoading}
              style={{ height: '38px' }}
            />
          </ButtonWrapper>
        </>
      </AitModal>
    </>
  );
};

export default TemplateNameModal;
