import React, { useEffect, useState } from 'react';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { Row, Col, notification } from 'antd';
import { StyledFormWrapper, ButtonWrapper } from './style';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTemplateDetailsByIdFilters,
  templateDetailsByIdReset,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { getTemplateDetailsById } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import AitBlockWrapper from '@/components/atoms/ait-block-wrapper/aitBlockWrapper';

const ChooseTemplateModal = ({
  visible,
  setVisible,
  handleShowTemplatePreview,
  setFromChooseTemplateModal = false,
}) => {
  const dispatch = useDispatch();
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );
  const [templateList, setTemplateList] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [error, setError] = useState({
    error: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (
      campaignState?.templateListApiState === 'success' &&
      campaignState?.templateList?.length > 0
    ) {
      const tempList = campaignState?.templateList?.map((item) => ({
        label: `${item.name} ${item?.is_new_template === '0' ? `(OLD Editor)` : `(New Editor)`} `,
        value: item.id,
      }));
      setTemplateList(tempList);
    }
  }, [campaignState?.templateListApiState]);

  useEffect(() => {
    if (campaignState?.templateDetailsApiState === 1) {
      setError({ error: false, errorMessage: '' });
      setTemplateId('');
      setVisible(false);
      handleShowTemplatePreview(true);
    } else {
      notification.error({
        message: campaignState?.templateDetailsById?.msg,
      });
      handleShowTemplatePreview(false);
    }
  }, [campaignState?.templateDetailsApiState]);

  const handleChooseAndContinue = () => {
    if (templateId) {
      setError({ error: false, errorMessage: '' });
      dispatch(setTemplateDetailsByIdFilters({ tid: templateId }));
      dispatch(getTemplateDetailsById());
    } else {
      setError({ error: true, errorMessage: 'Select message not empty' });
    }
  };

  return (
    <AitModal
      width={450}
      open={visible}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      centered
      title="Choose message template"
      setVisible={() => {
        setTemplateId('');
        setVisible(false);
      }}
    >
      <StyledFormWrapper>
        <AitBlockWrapper padding={'0px 0px'}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <AitSelectBox
                label="Select"
                name="template"
                placeholder="Please select template"
                value={templateId} // Ensure selected value is shown
                onChange={(value) => {
                  if (value) {
                    setError({ error: false, errorMessage: '' });
                    setTemplateId(value);
                  }
                }}
                loading={campaignState?.templateDetailsByIdLoading}
                error={Boolean(error.error)}
                errorMessage={error.errorMessage || ''}
                options={templateList}
                style={{ width: '100%', cursor: 'pointer' }} // Set cursor to pointer
              />
            </Col>
            <Col span={24}>
              <ButtonWrapper gutter={[0, 10]}>
                <Col span={24}>
                  <AitButton
                    title="Choose and continue"
                    htmlType="button"
                    type="primary"
                    onClick={() => {
                      handleChooseAndContinue();
                      setFromChooseTemplateModal(true);
                    }}
                    loading={campaignState?.templateDetailsByIdLoading}
                    style={{ width: '100%', height: '38px' }}
                  />
                </Col>
                <Col span={24}>
                  <AitButton
                    title="Cancel"
                    htmlType="button"
                    color="default"
                    variant="filled"
                    onClick={() => {
                      setTemplateId('');
                      setVisible(false);
                    }}
                    style={{ width: '100%', height: '38px' }}
                  />
                </Col>
              </ButtonWrapper>
            </Col>
          </Row>
        </AitBlockWrapper>
      </StyledFormWrapper>
    </AitModal>
  );
};

export default ChooseTemplateModal;
