import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Row, Col, Tag, Tooltip, Spin, App } from 'antd';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import {
  FilterScrollWrapper,
  CardContentWrapper,
  CardHeaderWrapper,
  LoadingWrapper,
  SpinContainerDiv,
  SearchInputWrapper,
} from './style';
import TemplateCard from '../../atoms/template-card/templateCard';
import { templateFilterOptions } from '../../utils/constants';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  deleteTemplateApi,
  getTemplateListApi,
  getTemplatePreviewData,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import {
  clearCopyTemplateFilter,
  deleteTemplateReset,
  resetTemplateFilters,
  setFilters,
} from '@/redux/email-marketing-slices/templateSlice/email-marketing-template-slice';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { LayoutContainer } from '../../organisms/create-campaign-left-section/style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import AitCard from '@/components/atoms/ait-card/aitCard';
import TemplatePreviewModal from '../../molecules/template-preview-modal/templatePreviewModal';
import SendCampaignModal from '../../molecules/send-campaign-modal/sendCampaignModal';
import { getToken } from '@/utils/authHelpers';
import TemplateNameModal from '../../molecules/template-name-modal/templateNameModal';
import {
  getPreviewTemplateDataReset,
  setTemplatePreviewDataByIdFilters,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import DeleteTemplateModal from '../../molecules/delete-template-modal/deleteTemplateModal';

const TemplateListTemplate = (props) => {
  const {
    hideCompContainer = false,
    hideCompHeader = false,
    handleOpenEditorClick,
    handleUseTemplateClick,
    handlePreviewTemplate,
    handleUseNowTemplateClick,
    handleUseNowcCampaignFromSavedTab,
    hideCreateButton,
    disableAutoFetch = false, // ✅ new
    defaultType = 'aiTemplate', // ✅ new
    defaultTab = 'pre_made_template', // ✅ new
  } = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const isRouterReady = router.isReady;
  const lastRequestRef = useRef('');

  const containerRef = useRef(null);
  const { notification } = App.useApp();

  const [activeTab, setActiveTab] = useState('pre_made_template');

  const [activeFilter, setActiveFilter] = useState('All');
  // 🔍 Local search input state for debounce
  const [searchInput, setSearchInput] = useState('');
  const [templatePreviewModalVisible, setTemplatePreviewModalVisible] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});

  const [sendCampaignModalVisible, setSendCampaignModalVisible] =
    useState(false);

  const [templateNameModalVisible, setTemplateNameModalVisible] =
    useState(false);

  const [useTemplateId, setUseTemplateId] = useState('');
  const [templateHtml, setTemplateHtml] = useState('');
  const [deleteTemplateModalVisible, setDeleteTemplateModalVisible] =
    useState(false);

  const templateState = useSelector(
    (state) => state.emailMarketingTemplateState
  );
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );
  const {
    initialFilters,
    templateList,
    getTemplateListLoading,
    hasMoreTemplates,
  } = templateState;

  const { login_auth } = useSelector((state) => state.jwtState);

  useEffect(() => {
    if (disableAutoFetch) return;
    dispatch(resetTemplateFilters());
    // Immediately set default filter type
    dispatch(
      setFilters({
        type: defaultType,
        currentPage: 1,
        keyword: '',
      })
    );
  }, [dispatch, disableAutoFetch, defaultType]);

  // Load data on filter or tab change
  useEffect(() => {
    if (disableAutoFetch) return;
    if (!initialFilters?.type) return;

    const key = JSON.stringify({
      type: initialFilters.type,
      page: initialFilters.currentPage,
      keyword: initialFilters.keyword,
    });

    if (lastRequestRef.current === key) return;
    lastRequestRef.current = key;

    dispatch(getTemplateListApi(initialFilters));
  }, [
    disableAutoFetch,
    initialFilters.type,
    initialFilters.currentPage,
    initialFilters.keyword,
  ]);

  useEffect(() => {
    return () => {
      if (!disableAutoFetch) dispatch(resetTemplateFilters());
    };
  }, [dispatch, disableAutoFetch]);

  useEffect(() => {
    if (!router.isReady || disableAutoFetch) return;

    const { tab, filter } = router.query;

    const updatedTab = tab === 'saved' ? 'saved' : 'pre_made_template';
    const updatedFilter = typeof filter === 'string' ? filter : 'All';

    setActiveTab(updatedTab);
    setActiveFilter(updatedTab === 'saved' ? 'All' : updatedFilter); // Reset to 'All' if saved
    // setSearchInput(''); // also clear search input
    // // avoid re-dispatch if nothing changed
    // if (
    //   updatedTab === activeTab &&
    //   updatedFilter === activeFilter &&
    //   initialFilters?.type
    // )
    //   return;

    // const baseType = updatedTab === 'saved' ? 'custom' : 'aiTemplate';
    // const finalType =
    //   updatedTab === 'saved'
    //     ? 'custom'
    //     : updatedFilter !== 'All'
    //       ? updatedFilter
    //       : baseType;

    // if (initialFilters.type !== finalType) {
    //   dispatch(
    //     setFilters({
    //       ...initialFilters,
    //       type: finalType,
    //       currentPage: 1,
    //       keyword: '', // reset keyword on tab/filter switch
    //     })
    //   );
    // }
  }, [
    router.isReady,
    router?.query?.tab,
    router.query.filter,
    // initialFilters,
    disableAutoFetch,
  ]);

  // Debounced effect for search
  useEffect(() => {
    if (disableAutoFetch) return;
    const delayDebounce = setTimeout(() => {
      if (searchInput.length === 0 && initialFilters.keyword === '') return;
      if (searchInput.length === 0 || searchInput.length >= 3) {
        dispatch(
          setFilters({
            // ...initialFilters,
            keyword: searchInput,
            currentPage: 1,
          })
        ); // <-- trigger directly
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput, dispatch]);

  //after use template when campign create
  useEffect(() => {
    if (templateState?.copyTemplateApiState === 'success') {
      setTemplateNameModalVisible(false);
      dispatch(clearCopyTemplateFilter());
      if (router?.pathname === '/email-marketing/templates/list') {
        handleUseTemplateFromTemplateList();
      }
    }

    if (templateState?.copyTemplateApiState === 'error') {
      notification.error({
        message: templateState.copyTemplateMessage,
      });
      dispatch(clearCopyTemplateFilter());
    }
  }, [templateState?.copyTemplateApiState]);

  useEffect(() => {
    if (campaignState?.getTemplatePreviewDataApiState === 'success') {
      setTemplateHtml(campaignState?.getTemplatePreviewData?.content_replaced);
      setTemplatePreviewModalVisible(true);
      dispatch(getPreviewTemplateDataReset());
    }
    if (campaignState?.getTemplatePreviewDataApiState === 'error') {
      notification.error({
        message: campaignState?.templateDetailsById?.msg,
      });
      dispatch(getPreviewTemplateDataReset());
      setTemplatePreviewModalVisible(false);
    }
  }, [campaignState?.getTemplatePreviewDataApiState]);

  useEffect(() => {
    if (templateState?.deleteTemplateApiState === 'success') {
      setDeleteTemplateModalVisible(false);
      notification.success({
        message: templateState?.deleteTemplateMessage,
      });
      dispatch(deleteTemplateReset());
    }
    if (templateState?.deleteTemplateApiState === 'error') {
      notification.error({
        message: templateState?.deleteTemplateMessage,
      });
      dispatch(deleteTemplateReset());
    }
  }, [templateState?.deleteTemplateApiState]);

  const handleSearch = (keyword) => {
    setSearchInput(keyword); // Update local state only
  };

  // Tab change => reset filter and type
  const handleTabChange = (key) => {
    setActiveTab(key);
    setActiveFilter('All');

    const { id, ...restQuery } = router.query;

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...restQuery,
          ...(id ? { id } : {}),
          tab: key,
        },
      },
      undefined,
      { shallow: true }
    );

    dispatch(
      setFilters({
        type: key === 'saved' ? 'custom' : 'aiTemplate',
        currentPage: 1,
        keyword: '',
      })
    );

    setSearchInput('');
  };

  // Filter tag click
  const handleFilterChange = (filter) => {
    if (activeTab === 'saved') return; // Don't allow filters when saved tab is active

    setActiveFilter(filter.key);

    const nextType = filter.key === 'All' ? 'aiTemplate' : filter.key;

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query, // preserve id
        filter: filter.key,
      },
    });

    dispatch(
      setFilters({
        // ...initialFilters,
        type: nextType,
        currentPage: 1,
        keyword: searchInput, // retain existing keyword
      })
    );
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (disableAutoFetch) return;
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50 &&
      !getTemplateListLoading
    ) {
      dispatch(
        setFilters({
          ...initialFilters,
          currentPage: initialFilters.currentPage + 1,
        })
      );
    }
  }, [dispatch, initialFilters.currentPage, getTemplateListLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const getTemplatePreview = (templateId) => {
    if (templateId) {
      const payload = {
        act: 'gettemplatedata',
        page: 'load_template_html_data',
        shop_id: login_auth?.shop_id,
        etid: templateId,
      };
      dispatch(setTemplatePreviewDataByIdFilters(payload));
      dispatch(getTemplatePreviewData());
    }
  };

  // from template list create from scratch button
  const handleCreateTemplateFromScratch = (type, type2) => {
    // window.open(
    //   `${process.env.NEXT_PUBLIC_APP_URL}/templatev2/?type=${type}&type2=${type2}&ai_v2=${token}`,
    //   '_self'
    // );
    router.push('/email-marketing/templates/editorv2?type=create-template');
  };

  const handleUseTemplateFromTemplateList = () => {
    // window.open(
    //   `${process.env.NEXT_PUBLIC_APP_URL}/templatev2/?type=editor&type2=template&etid=${templateState?.copyTemplateData?.template_id}&ai_v2=${token}`,
    //   '_self'
    // );
    router.push(
      `/email-marketing/templates/editorv2?type=template&type2=usetemplate&etid=${templateState?.copyTemplateData?.template_id}`
    );
    dispatch(clearCopyTemplateFilter());
  };

  const handleDeleteTemplate = () => {
    const payload = {
      act: 'delete_template',
      id: selectedTemplate?.id,
    };
    dispatch(deleteTemplateApi(payload));
  };

  return (
    <LayoutContainer>
      {/*StickyAlertWrapper*/}
      <MainWrapper
        {...(hideCompContainer
          ? { padding: { md: '4px', sm: '4px', xs: '4px' } }
          : {})}
      >
        {!hideCompHeader && (
          <AitPageHeader
            title="Email templates"
            subtitle="Design beautiful emails using prebuilt email templates."
            buttonLabel="Create from scratch"
            onButtonClick={() => {
              handleCreateTemplateFromScratch('email_marketing', 'template');
            }}
          />
        )}

        <AitCard
          hascustomheader={true}
          custombodypadding={'12px 24px 24px 24px'}
          hastabs={true}
          headercolreverse={true}
          customheaderleft={
            <AitTabs
              hascustomheader={true}
              hascardheaderrightsection={true}
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                { label: 'Pre-made templates', key: 'pre_made_template' },
                { label: 'Saved', key: 'saved' },
              ]}
            />
          }
          customheaderright={
            <Row gutter={[20, 20]}>
              <Col xs={{ span: 24 }} sm={{ span: 'auto' }}>
                <SearchInputWrapper>
                  <AitInputBox
                    placeholder={'Search by template name'}
                    suffix={
                      <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    }
                    style={{ height: 40, width: 250 }}
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchInput?.length > 0 && (
                    <AitButton
                      title="Reset"
                      style={{ height: 40 }}
                      onClick={() => setSearchInput('')}
                    />
                  )}
                  {hideCompHeader && !hideCreateButton && (
                    <Tooltip title="Create template">
                      <div style={{ paddingLeft: '5px' }}>
                        <AitButton
                          title="Create from scratch"
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            handleOpenEditorClick(
                              'campaign',
                              'createfromscratch',
                              campaignState?.sendEmailData?.encoded_key_id
                            );
                          }}
                        />
                      </div>
                    </Tooltip>
                  )}
                </SearchInputWrapper>
              </Col>
            </Row>
          }
        >
          <CardHeaderWrapper>
            {activeTab !== 'saved' && (
              <FilterScrollWrapper>
                {templateFilterOptions.map((filter) => (
                  <Tag
                    key={filter.key}
                    onClick={() => handleFilterChange(filter)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor:
                        filter.key === activeFilter ? '#232E41' : '#f0f0f0',
                      color:
                        filter.key === activeFilter
                          ? '#fff'
                          : 'rgba(0, 0, 0, 0.85)',
                      borderRadius: 6,
                      padding: '6px 14px',
                      fontWeight: 500,
                      lineHeight: '16px',
                      marginInlineEnd: '0px',
                      border: '1px solid #E7E8EB',
                    }}
                  >
                    {filter.label}
                  </Tag>
                ))}
              </FilterScrollWrapper>
            )}
          </CardHeaderWrapper>

          <CardContentWrapper
            ref={containerRef}
            style={{ maxHeight: '66vh', overflowY: 'auto' }}
          >
            <Row gutter={[20, 20]} style={{ marginRight: 0 }}>
              {templateList.map((item, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <TemplateCard
                    item={item}
                    token={getToken()}
                    activeTab={activeTab}
                    imageUrl={item.thumbnail_url}
                    previewButtonLoading={
                      campaignState?.getTemplatePreviewDataApiState ===
                      'pending'
                    }
                    name={
                      <Tooltip title={item.title}>
                        <div
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.title}
                        </div>
                      </Tooltip>
                    }
                    handleTemplatePreview={(selectedTemplate) => {
                      if (handlePreviewTemplate) {
                        handlePreviewTemplate(selectedTemplate);
                      } else {
                        setSelectedTemplate(selectedTemplate);
                        // setTemplatePreviewModalVisible(true);
                      }
                    }}
                    handleOpenEditorClick={handleOpenEditorClick}
                    handleUseTemplateClick={(templateId) => {
                      if (
                        router?.pathname === '/email-marketing/templates/list'
                      ) {
                        setTemplateNameModalVisible(true);
                        setUseTemplateId(templateId);
                      } else {
                        handleUseTemplateClick(templateId);
                      }
                    }}
                    handleSendCmapaignClick={(selectedTemplate, modalValue) => {
                      setSelectedTemplate(selectedTemplate);
                      setSendCampaignModalVisible(modalValue);
                    }}
                    handleUseNowTemplateClick={(templateId) => {
                      handleUseNowTemplateClick(templateId);
                    }}
                    getTemplatePreview={(templateId) => {
                      setSelectedTemplate(templateId);
                      getTemplatePreview(templateId);
                    }}
                    handleDeleteTemplate={(templateId) => {
                      setSelectedTemplate(templateId);
                      setDeleteTemplateModalVisible(true);
                    }}
                  />
                </Col>
              ))}
            </Row>

            {getTemplateListLoading && (
              <>
                <LoadingWrapper>
                  <SpinContainerDiv>
                    <Spin />
                  </SpinContainerDiv>
                  <SpinContainerDiv>Loading templates...</SpinContainerDiv>
                </LoadingWrapper>
              </>
            )}

            {!getTemplateListLoading &&
              templateList.length > 0 &&
              !hasMoreTemplates && (
                <div
                  style={{ textAlign: 'center', padding: 16, color: '#999' }}
                >
                  You’ve reached the end.
                </div>
              )}

            {!getTemplateListLoading && templateList.length === 0 && (
              <div style={{ textAlign: 'center', padding: 16, color: '#999' }}>
                No templates found.
              </div>
            )}
          </CardContentWrapper>
        </AitCard>
      </MainWrapper>
      <TemplateNameModal
        visible={templateNameModalVisible}
        setVisible={setTemplateNameModalVisible}
        useTemplateId={useTemplateId}
      />
      <SendCampaignModal
        visible={sendCampaignModalVisible}
        setVisible={setSendCampaignModalVisible}
        selectedTemplate={selectedTemplate}
      />
      <TemplatePreviewModal
        visible={templatePreviewModalVisible}
        setVisible={setTemplatePreviewModalVisible}
        htmlString={templateHtml}
        isActionButtonShow={true}
        templateId={selectedTemplate?.id}
      />
      <DeleteTemplateModal
        visible={deleteTemplateModalVisible}
        setVisible={setDeleteTemplateModalVisible}
        handleDeleteTemplate={handleDeleteTemplate}
      />
    </LayoutContainer>
  );
};

export default TemplateListTemplate;
