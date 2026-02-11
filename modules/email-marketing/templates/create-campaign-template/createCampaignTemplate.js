// CreteCampaignTemplate.js
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  App,
  Breadcrumb,
  Col,
  Divider,
  Row,
  Typography,
  Button,
} from 'antd';
import Link from 'next/link';
import {
  LayoutContainer,
  ScrollableLeftPanel,
  StickyAlertWrapper,
  StickySubHeader,
  StyleLeftRightPannelWrapper,
} from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { getToken } from '@/utils/authHelpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAudienceList,
  fetchInitCustomerData,
  fetchSegmentList,
  fetchTemplateList,
  getEmailCampaginApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { getLoggedInUserDetailsApi } from '@/redux/apis/logged-in-user-apis/loggedInUserApis';
import CreateCampaignLeftSection from '../../organisms/create-campaign-left-section/createCampaignLeftSection';
import {
  setAudienceFilters,
  setEmailCampaignFilters,
  setSegmentFilters,
  templateDetailsByIdReset,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import CreateCampaignRightSection from '../../organisms/create-campaign-right-section/createCampaignRightSection';
import HtmlPreviewer from '../../molecules/html-previewer/htmlPreviewer';
import AitDropdownButton from '@/components/atoms/ait-dropdown-button/aitDropdownButton';
import { useRouter } from 'next/router';
import TemplateListModal from '../../organisms/template-list-modal/templateListModal';
import CreateCampaignLeftSkeleton from '../../loading-skeletons/cerate-campaign-skeleton/createCampaignSkeleton';
import CreateCampaignPreviewSkeleton from '../../loading-skeletons/create-campaign-preview-skeleton/createCampaignPreviewSkeleton';
import ChangeTemplateModalOnEdit from '../../molecules/change-template-modal-on-edit/changeTemplateModalOnEdit';
import TemplateNameModal from '../../molecules/template-name-modal/templateNameModal';
import { clearCopyTemplateFilter } from '@/redux/email-marketing-slices/templateSlice/email-marketing-template-slice';
import BackButton from '@/components/atoms/back-arrow/backButton';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import {
  RightCircleFilled,
  RightCircleOutlined,
  RightCircleTwoTone,
  WarningFilled,
  WarningOutlined,
} from '@ant-design/icons';

const CreateCampaignTemplate = () => {
  // variable & states;
  const dispatch = useDispatch();
  const router = useRouter();
  const isEditMode = !!router.query.id;
  const leftSectionRef = useRef();
  const editorWindowRef = useRef(null);
  const { notification } = App.useApp();

  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );
  const { shop_id = '', email_decoded = '' } = userDetails || {};

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { campaignDetailsData, campaignDetailsLoading } = campaignState;

  const templateState = useSelector(
    (state) => state.emailMarketingTemplateState
  );
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [campaignInitialData, setCampaignInitialData] = useState({});
  const [actionType, setActionType] = useState('');
  const [shouldChoosePreMadeCall, setshouldChoosePreMadeCall] = useState(false);
  const [templateListModalVisible, setTemplateListModalVisible] =
    useState(false);
  const [changeTemplateOnEditModal, setChangeTemplateOnEditModal] =
    useState(false);
  const [templateNameModalVisible, setTemplateNameModalVisible] =
    useState(false);
  const [useTemplateId, setUseTemplateId] = useState('');

  // Initial Load: Fetch user profile & init campaign list
  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(getLoggedInUserDetailsApi({ act: 'get_profile_picture' }));
    }
  }, []);

  // Once shop_id is available, set audience filters and fetch campaign list
  useEffect(() => {
    if (!shop_id) return;
    dispatch(setAudienceFilters({ shop_id: shop_id }));
    dispatch(setSegmentFilters({ shop_id: shop_id }));
    dispatch(fetchInitCustomerData());
    dispatch(fetchAudienceList());
    dispatch(fetchSegmentList());
    dispatch(fetchTemplateList());
    dispatch(setEmailCampaignFilters({ encodedData: email_decoded }));
    dispatch(getEmailCampaginApi());
  }, [shop_id, dispatch]);

  useEffect(() => {
    if (actionType === 'pre-made-template' && shouldChoosePreMadeCall) {
      if (leftSectionRef.current?.handleSendTestEmail) {
        leftSectionRef.current.handleSendTestEmail();
      }

      setshouldChoosePreMadeCall(false); // reset
    }
  }, [actionType, shouldChoosePreMadeCall]);

  useEffect(() => {
    if (actionType === 'pre_made_template_from_edit') {
      setTemplateListModalVisible(true);
      setActionType(''); // reset
    }
  }, [actionType]);

  // when template preload on edit
  useEffect(() => {
    if (isEditMode && campaignDetailsData?.templateData?.email_content) {
      setShowTemplatePreview(true);
    }
  }, [isEditMode, campaignDetailsData?.templateData]);

  //after use template when campign create

  useEffect(() => {
    if (templateState?.copyTemplateApiState === 'success') {
      setTemplateNameModalVisible(false);
      setTemplateListModalVisible(false);
      notification.success({
        message: templateState.copyTemplateMessage,
      });
      handleUseTemplateOpenEditor();
    }

    if (templateState?.copyTemplateApiState === 'error') {
      notification.error({
        message: templateState.copyTemplateMessage,
      });
      dispatch(clearCopyTemplateFilter());
    }
  }, [templateState?.copyTemplateApiState]);

  const handleChoosePreMadeTemplate = (type) => {
    setActionType(type);
    setshouldChoosePreMadeCall(true); // this will trigger useEffect after state updates
  };

  const handleOpenEditor = (type, campaignId) => {
    router.push(
      `/email-marketing/templates/editorv2?type=${type}&cid=${isEditMode ? router.query.id : campaignId}&?ai_v2=${token}`
    );

    // editorWindowRef.current = window.open(
    //   `${process.env.NEXT_PUBLIC_APP_URL}/templatev2?type=${type}&cid=${isEditMode ? router.query.id : campaignId}&?ai_v2=${token}`,
    //   '_self'
    // );
  };

  const handleUseTemplateOpenEditor = (type2) => {
    // editorWindowRef.current = window.open(
    //   `${process.env.NEXT_PUBLIC_APP_URL}/templatev2?type=use_template_with_create_campaign&type2=${type2}&etid=${templateState?.copyTemplateData?.template_id}&camp_id=${isEditMode ? router.query.id : campaignState?.sendEmailData?.encoded_key_id}&ai_v2=${token}`,
    //   '_self'
    // );
    router.push(
      `/email-marketing/templates/editorv2?type=use_template_with_create_campaign&type2=${type2}&etid=${templateState?.copyTemplateData?.template_id}&camp_id=${isEditMode ? router.query.id : campaignState?.sendEmailData?.encoded_key_id}`
    );
    dispatch(clearCopyTemplateFilter());
  };

  return (
    <LayoutContainer>
      {userDetails?.dmarc_policy_update_status === '0' &&
        campaignState?.emailCampaignData?.email_data?.dkim_module_status ===
          '1' && (
          <StickyAlertWrapper>
            <AitAlert
              message={
                <div>
                  Starting February 1, Google and Yahoo will enforce new email
                  sender requirements.
                  <Link
                    href="#"
                    style={{
                      marginLeft: 8,
                      color: '#fff',
                      textDecoration: 'underline',
                    }}
                  >
                    Learn more
                  </Link>
                  <Divider
                    type="vertical"
                    style={{ backgroundColor: '#fff', marginLeft: 8 }}
                  />
                  <Link
                    href="#"
                    style={{ color: '#fff', textDecoration: 'underline' }}
                  >
                    Go to settings
                  </Link>
                </div>
              }
              type="info"
              banner
              bgcolor="#3086E9"
              color="#ffffff"
              iconcolor="#ffffff"
            />{' '}
          </StickyAlertWrapper>
        )}
      {campaignState?.emailCampaignData?.email_data?.dkim_module_status ===
        '0' && (
        <StickyAlertWrapper>
          <AitAlert
            message={
              <div className="custom-icon-content">
                <span className="alert-custom-icon">
                  <WarningFilled style={{ fontSize: 16 }} />
                </span>
                <div>
                  The DKIM setting is compulsory to send email campaigns from
                  AiTrillion. Please setup DKIM from
                  <Link
                    href="/email-marketing/settings/dkimsetting"
                    style={{
                      marginLeft: 4,
                      textDecoration: 'underline',
                      color: '#444444',
                      fontWeight: 500,
                    }}
                  >
                    here
                    <span style={{ marginLeft: 4 }}>
                      <RightCircleTwoTone twoToneColor="#FF5F6B" />
                    </span>
                  </Link>
                </div>
              </div>
            }
            type="warning"
            banner
            hidedefaulticon={true}
            hascustomicon={true}
            bgcolor="#FFDCDC"
            color="#a94442"
            iconcolor="#FF5F6B"
          />{' '}
        </StickyAlertWrapper>
      )}

      <StickySubHeader>
        <div style={{ display: 'flex' }}>
          <BackButton
            marginTop={'4px'}
            color={'var(--ant-color-text-primary)'}
            handleBack={() => {
              router.push('/email-marketing/campaign/list');
            }}
          />
          {campaignInitialData?.campaignName?.length > 0 && (
            <div className="left" style={{ marginLeft: '10px' }}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Button
                    href="/email-marketing/campaign/list"
                    type="link"
                    color="default"
                    variant="link"
                  >
                    <Typography.Title level={5} color="primary">
                      Campaigns{' '}
                    </Typography.Title>
                  </Button>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Typography.Title level={5} color="default">
                    {campaignInitialData?.campaignName}
                  </Typography.Title>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          )}
        </div>

        <div className="right">
          <AitButton
            variant="outlined"
            color="primary"
            title="Create A/B test"
            rightTagLabel="NEW"
            rightTagColor="#e3fbf1"
            style={{
              marginRight: '12px',
            }}
            onClick={() => {
              if (leftSectionRef.current?.handleCreateAbTest) {
                leftSectionRef.current.handleCreateAbTest();
              }
            }}
            loading={campaignState?.sendEmailLoading}
          />
          {/* In the case of create  */}
          {showTemplatePreview && !isEditMode && (
            <AitDropdownButton
              title={'Action'}
              menuItems={[
                {
                  key: 'change_template',
                  label: 'Change template',
                  onClick: () => {
                    dispatch(templateDetailsByIdReset());
                    setShowTemplatePreview(false);
                  },
                },
                {
                  key: 'edit_html',
                  label: 'Edit HTML version',
                  onClick: () => console.log('Edit HTML clicked'),
                },
              ]}
              loading={false}
            />
          )}
          {/* in the case of update */}
          {isEditMode && (
            <AitDropdownButton
              title={'Edit email'}
              menuItems={[
                {
                  key: 'change_template',
                  label: 'Change template',
                  onClick: () => {
                    if (isEditMode) {
                      setChangeTemplateOnEditModal(true);
                    }
                    // dispatch(templateDetailsByIdReset());
                    // setShowTemplatePreview(false);
                  },
                },
                {
                  key: 'edit_html',
                  label: 'Edit HTML version',
                  onClick: () => console.log('Edit HTML clicked'),
                },
              ]}
              loading={false}
              // onClick={() => console.log('Submit clicked')}
            />
          )}
        </div>
      </StickySubHeader>
      <StyleLeftRightPannelWrapper>
        <Col xs={24} md={10} lg={7}>
          <ScrollableLeftPanel>
            {campaignDetailsLoading ? (
              <CreateCampaignLeftSkeleton />
            ) : (
              <CreateCampaignLeftSection
                ref={leftSectionRef}
                setCampaignInitialData={setCampaignInitialData}
                actionType={actionType}
                handleTemplateModalVisible={(value) => {
                  setTemplateListModalVisible(value);
                }}
              />
            )}
          </ScrollableLeftPanel>
        </Col>

        <Col xs={24} md={14} lg={17}>
          {campaignDetailsLoading ? (
            <CreateCampaignPreviewSkeleton />
          ) : isEditMode || showTemplatePreview ? (
            <HtmlPreviewer
              htmlString={
                // Always prefer updated selected template (even in edit mode)
                campaignState?.templateDetailsById?.email_html_code ||
                (isEditMode
                  ? campaignDetailsData?.templateData?.email_content
                  : '<p>No content</p>')
              }
            />
          ) : (
            <CreateCampaignRightSection
              handleShowTemplatePreview={(value) => {
                setShowTemplatePreview(value);
              }}
              handleChoosePreMadeTemplate={(type) => {
                handleChoosePreMadeTemplate(type);
              }}
            />
          )}
        </Col>
      </StyleLeftRightPannelWrapper>
      <TemplateListModal
        handleOpenEditorClick={(type, campaignId) => {
          handleOpenEditor(type, campaignId);
        }}
        visible={templateListModalVisible}
        setVisible={setTemplateListModalVisible}
        handleUseTemplateClick={(templateId) => {
          setTemplateNameModalVisible(true);
          setUseTemplateId(templateId);
        }}
        disableAutoFetch={false}
        defaultType="aiTemplate"
      />
      {/* for edit page */}
      <ChangeTemplateModalOnEdit
        visible={changeTemplateOnEditModal}
        setVisible={setChangeTemplateOnEditModal}
        handleShowTemplatePreview={(value) => {
          setShowTemplatePreview(value);
        }}
        handleChoosePreMadeTemplateonEdit={(type) => {
          handleChoosePreMadeTemplate(type);
        }}
        setShowTemplatePreview={setShowTemplatePreview}
      />
      {/* for template name after choose template from template list */}
      <TemplateNameModal
        visible={templateNameModalVisible}
        setVisible={setTemplateNameModalVisible}
        useTemplateId={useTemplateId}
      />
    </LayoutContainer>
  );
};

export default CreateCampaignTemplate;
