import React, { useEffect, useState } from 'react';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import HtmlPreviewer from '../html-previewer/htmlPreviewer';
import TemplateMobilePreview from '../../atoms/template-mobile-preview/templateMobilePreview';
import { FullHeightCard, ModalBody } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Tabs } from 'antd';
import SendTestModal from '../send-test-modal/sendTestModal';
import { useRouter } from 'next/router';
import { sendTestEmailApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { useDispatch, useSelector } from 'react-redux';
import { sendTestEmailPreviewMessageReset } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { Typography } from 'antd';
const { Text } = Typography;

const TemplatePreviewModal = (props) => {
  const {
    visible,
    setVisible,
    htmlString,
    isActionButtonShow = false,
    handleTestModalVisible = () => {},
    templateId = '',
  } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );
  const [activeTabKey, setActiveTabKey] = useState('web');
  const [sendTestModalVisible, setSendTestModalVisible] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isLocalSend, setIsLocalSend] = useState(false);

  useEffect(() => {
    if (campaignState?.sendTestEmailApiState === 'success') {
      if (!isLocalSend) return; // ✅ ignore if not triggered by this modal
      notification.success({ message: campaignState.sendTestEmailMessage });
      setSendTestModalVisible(false); // close local modal
      handleTestModalVisible?.(false); // ✅ close parent modal if present
      setTestEmail('');

      setVisible(false); // close preview modal
      dispatch(sendTestEmailPreviewMessageReset());
    }
    if (campaignState?.sendTestEmailApiState === 'error') {
      notification.error({ message: campaignState.sendTestEmailMessage });
      dispatch(sendTestEmailPreviewMessageReset());
    }
  }, [campaignState?.sendTestEmailApiState]);

  const handleSendTestEmailMessage = (passedEmail) => {
    const { pathname, query } = router || {};
    const finalEmail = passedEmail || testEmail;
    const isEdit = pathname === '/email-marketing/campaign/[id]/edit-campaign';
    const isTpl = pathname === '/email-marketing/templates/list';

    // decide which id/key to send
    const idKey = isTpl ? 'template_id' : 'campaign_id';
    const idValue = isTpl ? templateId : isEdit ? query?.id : undefined;

    const payload = {
      [idKey]: idValue ?? '', // avoid undefined
      src: 'marketing',
      act: 'send_test_mail_notification_by_id',
      template_type: 'new',
      sendRecepientEmail: finalEmail,
      content: htmlString,
      subject: '',
      EmailNotificationfromSubject: '',
      source: 'template_preview_modal',
    };
    // ✅ mark this instance as the sender
    setIsLocalSend(true);

    dispatch(sendTestEmailApi(payload));
  };
  return (
    <>
      <AitModal
        open={visible}
        setVisible={setVisible}
        width={1200}
        centered
        title="Template preview"
        headerBorderBottom={false}
        isHeaderAtCenter
        closable={false}
      >
        <ModalBody>
          <FullHeightCard
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {/* Tabs Centered */}
                <div>
                  <Tabs
                    activeKey={activeTabKey}
                    onChange={(key) => setActiveTabKey(key)}
                    items={[
                      { key: 'web', label: 'Web view' },
                      { key: 'mobile', label: 'Mobile view' },
                    ]}
                  />
                </div>

                {isActionButtonShow && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <AitButton
                      title="Send test"
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        handleTestModalVisible(true);
                        setSendTestModalVisible(true);
                      }}
                    />
                    {/* <AitButton
                  title="Done"
                  type="primary"
                  onClick={() => {
                    setVisible(false);
                  }}
                /> */}
                  </div>
                )}
              </div>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: 700 }} type="primary">
                Note:
              </Text>{' '}
              <Text>
                The Preview of the email in the browser may differ. It is
                essential to ensure the actual preview by sending a test email.
              </Text>
            </div>
            {activeTabKey === 'web' ? (
              <HtmlPreviewer htmlString={htmlString} />
            ) : (
              <TemplateMobilePreview htmlString={htmlString} />
            )}
          </FullHeightCard>
        </ModalBody>
      </AitModal>
      <>
        <SendTestModal
          visible={sendTestModalVisible}
          setVisible={setSendTestModalVisible}
          handleSendTestEmail={(email) => {
            handleSendTestEmailMessage(email);
          }}
          setEmailValue={(value) => {
            setTestEmail(value);
          }}
          previewModalOpen={visible}
          loading={campaignState?.sendTestEmailLoading}
        />
      </>
    </>
  );
};

export default TemplatePreviewModal;
