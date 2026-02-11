import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { App } from 'antd';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import {
  deleteCampaignReset,
  setCampaignCsvDataFilters,
  setEmailMarketingCampaignFilters,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { useDispatch, useSelector } from 'react-redux';
import { campaignListTabItems } from '../../utils/constants';
import {
  deleteCampaignApi,
  ExportCasmpaignCsvData,
  fetchCampaignList,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import CampaignListTable from '../../organisms/campaign-list-table/campaignListTable';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import CloneCampaignNameModal from '../../molecules/clone-campaign-name-modal/cloneCampaignNameModal';
import { LayoutContainer } from '../../organisms/create-campaign-left-section/style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import moment from 'moment';

const CampaignListTemplate = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const didFetchRef = useRef(false);
  const { notification } = App.useApp();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );
  const { campaignList, loading, filters, exportCampaignCsvDataLoading } =
    campaignState;

  const tabToMessageTypeMap = {
    All: 'all',
    Sent: 'sent',
    Draft: 'draft',
    Scheduled: 'scheduled',
    Failed: 'failed',
    Pending: 'pending',
  };

  const [activeTab, setActiveTab] = useState(() => {
    const type = filters?.messageType;
    const defaultKey = Object.keys(tabToMessageTypeMap).find(
      (key) => tabToMessageTypeMap[key] === type
    );
    return defaultKey || 'All';
  });
  const [deleteCofirmationModalOpen, setDeleteCofirmationModalOpen] =
    useState(false);
  const [cloneCampaignModalVisible, setCloneCampaignModalVisible] =
    useState(false);

  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  // 🔍 Local search input state for debounce
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const currentMessageType = filters?.messageType || 'all';
    const tabKey = Object.keys(tabToMessageTypeMap).find(
      (key) => tabToMessageTypeMap[key] === currentMessageType
    );
    if (tabKey && tabKey !== activeTab) {
      setActiveTab(tabKey);
    }
  }, [filters?.messageType]);

  // 1️⃣ Initial fetch
  // useEffect(() => {
  //   if (didFetchRef.current) return;
  //   didFetchRef.current = true;
  //   dispatch(fetchCampaignList({ act: 'load_message_list' }));
  // }, []);

  // // 2️⃣ After-mount smart watcher
  const prevFilterKeyRef = useRef('');
  // const filterKey = JSON.stringify({
  //   keyword: filters.keyword || '',
  //   messageType: filters.messageType || 'all',
  //   sentDate: filters.sentDate || '',
  //   sentDateTo: filters.sentDateTo || '',
  //   currentPage: filters.currentPage || '1',
  //   limit: filters.limit || '10',
  //   sort: filters.sort || 'mr.id',
  //   order: filters.order || 'false',
  // });

  // useEffect(() => {
  //   if (!didFetchRef.current) return;
  //   if (prevFilterKeyRef.current === filterKey) return;
  //   prevFilterKeyRef.current = filterKey;

  //   dispatch(fetchCampaignList({ act: 'load_message_list' }));
  // }, [filterKey, dispatch]);

  useEffect(() => {
    const currentKey = JSON.stringify({
      keyword: filters.keyword || '',
      messageType: filters.messageType || 'all',
      sentDate: filters.sentDate || '',
      sentDateTo: filters.sentDateTo || '',
      currentPage: filters.currentPage || '1',
      limit: filters.limit || '10',
      sort: filters.sort || 'mr.id',
      order: filters.order || 'false',
    });

    if (prevFilterKeyRef.current === currentKey) return;
    prevFilterKeyRef.current = currentKey;

    dispatch(fetchCampaignList({ act: 'load_message_list' }));
  }, [filters, dispatch]);

  useEffect(() => {
    if (campaignState?.deleteCampaignApiState === 'success') {
      notification.success({
        message: campaignState.deleteCampaignMessage,
      });
      setDeleteCofirmationModalOpen(false);
      setSelectedCampaignId('');
      dispatch(deleteCampaignReset());
    }
    if (campaignState?.deleteCampaignApiState === 'error') {
      notification.error({
        message: campaignState.deleteCampaignError,
      });
      setSelectedCampaignId('');
      dispatch(deleteCampaignReset());
    }
  }, [campaignState?.deleteCampaignApiState]);

  // Debounced effect for search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchInput.length === 0 || searchInput.length >= 3) {
        dispatch(
          setEmailMarketingCampaignFilters({
            keyword: searchInput,
            currentPage: '1',
          })
        );
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput, dispatch]);

  const handleSearch = (keyword) => {
    setSearchInput(keyword); // Update local state only
  };
  const handleDateChange = ([from, to]) => {
    const formattedFrom = from
      ? moment(from.$d || from).format('DD-MM-YYYY')
      : '';
    const formattedTo = to ? moment(to.$d || to).format('DD-MM-YYYY') : '';

    dispatch(
      setEmailMarketingCampaignFilters({
        sentDate: formattedFrom,
        sentDateTo: formattedTo,
        currentPage: '1',
        filter_list: '1',
        reset: true,
      })
    );
  };

  const handleTableChange = (pagination, filtersFromTable, sorter) => {
    dispatch(
      setEmailMarketingCampaignFilters({
        currentPage: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        sort: sorter.field || 'mr.id',
        order: sorter.order === 'ascend' ? 'true' : 'false',
      })
    );
  };

  const handleResetFilters = () => {
    // Reset local tab state
    setActiveTab('All');
    dispatch(
      setEmailMarketingCampaignFilters({
        act: 'load_message_list',
        campaignEmailErr: '0',
        campaignEmailErrTxt: 'Please enter campaign name',
        currentPage: '1',
        filter_list: '0',
        keyword: '',
        limit: '10',
        messageFilter: 'email',
        messageType: 'all',
        order: 'false',
        sentDate: '',
        sentDateTo: '',
        sort: 'mr.id',
        tab_list: '1',
      })
    );
    dispatch(fetchCampaignList({ act: 'load_message_list' }));
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    dispatch(
      setEmailMarketingCampaignFilters({
        messageType: tabToMessageTypeMap[key],
      })
    );
  };

  const handleCreateButonClick = () => {
    router.push('/email-marketing/campaign/create-campaign');
  };

  const handleEditClick = (campaignId) => {
    if (campaignId) {
      router.push(`/email-marketing/campaign/${campaignId}/edit-campaign`);
    }
  };

  const handleViewClick = (messageId, camp_type) => {
    if (camp_type) {
      router.push(
        `/email-marketing/campaign/${messageId}?isAbTest=${camp_type}`
      );
    } else {
      router.push(`/email-marketing/campaign/${messageId}`);
    }
  };

  const handleDeleteCampaign = () => {
    const payload = {
      act: 'delete_campaign',
      id: selectedCampaignId,
    };

    dispatch(deleteCampaignApi(payload));
  };

  const handleExport = async () => {
    dispatch(
      setCampaignCsvDataFilters({
        act: 'export_csv_message_list',
      })
    );
    const res = await dispatch(ExportCasmpaignCsvData());

    if (res?.payload?.status === 'success' && res?.payload?.filename) {
      const fileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/index/download?f=${res.payload.filename}`;

      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', res.payload.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <LayoutContainer>
      {/*StickyAlertWrapper*/}
      <MainWrapper>
        <AitPageHeader
          title="Campaigns"
          subtitle="Create email campaigns to announce your deals, store updates and product promotions."
          subtitleLink=""
          buttonLabel="Create"
          onButtonClick={handleCreateButonClick}
          isCreateButtonVisible={true}
          isExportButton={true}
          handleExportCsv={() => {
            handleExport();
          }}
          exportCampaignCsvDataLoading={exportCampaignCsvDataLoading}
        />

        <AitCard
          hascustomheader={true}
          hastabs={true}
          custombodypadding={'12px 24px 24px 24px'}
          customheaderleft={
            <AitTabs
              hascustomheader={true}
              activeKey={activeTab}
              onChange={handleTabChange}
              items={campaignListTabItems.map((name) => ({
                label: `${name} (${campaignState?.tabCounts?.[name] ?? 0})`, // Display the count with the tab name
                key: name,
              }))}
            />
          }
        >
          <CampaignListTable
            campaignList={campaignList}
            loading={loading}
            activeTab={activeTab}
            handleSearch={handleSearch}
            handleTableChange={handleTableChange}
            handleDateChange={handleDateChange}
            handleResetFilters={handleResetFilters}
            handleEditClick={(campaignId) => {
              handleEditClick(campaignId);
            }}
            handleViewClick={(campaignId) => {
              handleViewClick(campaignId);
            }}
            handleDeleteCampaign={(campaignId) => {
              setDeleteCofirmationModalOpen(true);
              setSelectedCampaignId(campaignId);
            }}
            handleCloneClick={(campaignId) => {
              setCloneCampaignModalVisible(true);
              setSelectedCampaignId(campaignId);
            }}
          />
        </AitCard>

        <AitConfirmationModal
          visible={deleteCofirmationModalOpen}
          setVisible={setDeleteCofirmationModalOpen}
          description="This campaign will be deleted permanently"
          onConfirm={() => {
            handleDeleteCampaign();
          }}
          confirmButtonLoading={campaignState?.deleteCampaignLoading}
        />
        <CloneCampaignNameModal
          visible={cloneCampaignModalVisible}
          setVisible={setCloneCampaignModalVisible}
          setSelectedCampaignId={setSelectedCampaignId}
          selectedCampaignId={selectedCampaignId}
        />
      </MainWrapper>
    </LayoutContainer>
  );
};

export default CampaignListTemplate;
