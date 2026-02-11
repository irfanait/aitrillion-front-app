import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import React, { useEffect, useState } from 'react';
import TemplateListTemplate from '../../templates/template-list-template/templateListTemplate';
import TemplatePreviewModal from '../../molecules/template-preview-modal/templatePreviewModal';
import { useDispatch, useSelector } from 'react-redux';
import { getTemplateListApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { useRouter } from 'next/router';
import { setFilters } from '@/redux/email-marketing-slices/templateSlice/email-marketing-template-slice';

const TemplateListModal = (props) => {
  const {
    visible,
    setVisible,
    handleOpenEditorClick,
    handleUseTemplateClick,
    handleUseNowTemplateClick,
    handleUseNowcCampaignFromSavedTab,
    hideCreateButton = false,
    disableAutoFetch = false,
    defaultType = 'aiTemplate',
  } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const { initialFilters } = useSelector(
    (state) => state.emailMarketingTemplateState
  );

  useEffect(() => {
    if (visible) {
      // When modal opens → trigger a fresh fetch
      dispatch(
        getTemplateListApi({
          type: 'aiTemplate',
          currentPage: 1,
          keyword: '',
        })
      );
    } else {
      // When modal closes → reset filters
      if (initialFilters) {
        dispatch(
          setFilters({
            ...initialFilters,
            type: 'aiTemplate',
            currentPage: 1,
            keyword: '',
          })
        );
      }

      // Clean tab + filter query params
      if (router.query.tab || router.query.filter) {
        const { tab, filter, ...rest } = router.query;
        router.replace(
          { pathname: router.pathname, query: { ...rest } },
          undefined,
          { shallow: true }
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <>
      <AitModal
        open={visible}
        width={'100%'}
        setVisible={setVisible}
        forMobileResponsive={true}
        centered
        title={'Choose template'}
        hideScrollbar={true}
      >
        <div style={{ height: '85vh' }}>
          <TemplateListTemplate
            hideCompContainer={true}
            hideCompHeader={true}
            disableAutoFetch={false}
            defaultType={defaultType}
            handleOpenEditorClick={(type, type2, campaignId) => {
              handleOpenEditorClick(type, type2, campaignId);
            }}
            handleUseTemplateClick={(templateId) => {
              handleUseTemplateClick(templateId);
            }}
            handlePreviewTemplate={(template) => {
              setSelectedTemplate(template);
              setPreviewModalVisible(true);
            }}
            handleUseNowTemplateClick={(templateId) => {
              handleUseNowTemplateClick(templateId);
            }}
            hideCreateButton={hideCreateButton}
          />
        </div>
      </AitModal>
      {/* <TemplatePreviewModal
        visible={previewModalVisible}
        setVisible={setPreviewModalVisible}
        template={selectedTemplate}
        isActionButtonShow={true}
      /> */}
    </>
  );
};

export default TemplateListModal;
