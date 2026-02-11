import React, { useEffect, useRef, useState } from 'react';
import { LayoutContainer, SearchInputWrapper } from './style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import { segmentListTabItems } from '../../utils/constant';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { useRouter } from 'next/router';
import {
  deleteSegmentApi,
  getSegmentListApi,
} from '@/redux/apis/customers-api/customersApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteSegmentReset,
  setSegmentListFilters,
} from '@/redux/customers-slice/segment-slices/segment-slice';
import SegmentListTable from '../../organisms/segment-list-table/segmentListTable';
import { App, Col, Row } from 'antd';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { SearchOutlined } from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import ExportSegmentModal from '../../molecules/export-segment-modal/exportSegmentModal';

const SegmentListTemplate = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const firstSearch = useRef(true);

  const { notification } = App.useApp();
  const segmentState = useSelector((state) => state.segmentState);
  const {
    filters,

    deleteSegmentApiState,
    deleteSegmentApiMessage,
    deleteSegmentApiLoading,
  } = segmentState;

  const [activeTab, setActiveTab] = useState(filters.filter_list || 'all');
  const [searchInput, setSearchInput] = useState('');
  const [deleteSegmentModalVisible, setDeleteSegmentModalVisible] =
    useState(false);
  const [segmentId, setSegmentId] = useState('');
  const [exportSegmentModalVisible, setExportSegmentModalVisible] =
    useState(false);

  useEffect(() => {
    setSearchInput('');

    dispatch(
      setSegmentListFilters({
        ...filters,
        search_filter: '',
        currentPage: 1,
      })
    );
  }, []);

  // -----------------------------
  // RESET FILTERS + SEARCH ON MOUNT
  // -----------------------------
  useEffect(() => {
    setSearchInput(''); // reset local search
    setActiveTab('all'); // reset tab

    dispatch(
      setSegmentListFilters({
        act: 'get_filter_segments',
        countSync: 1,
        currentPage: 1,
        filter_list: 'all',
        limit: 10,
        messageFilter: 'all',
        order: 0,
        order_by_col: 'asfs.id',
        sort: 'asfs.id',
        totalRecords: 0,
        search_filter: '',
      })
    );

    // Fetch once
    dispatch(getSegmentListApi());
  }, []);

  const handleSearch = (keyword) => {
    setSearchInput(keyword); // Update local state only
  };

  // -----------------------------
  // SEARCH: only fire when user types (not on mount)
  // -----------------------------

  useEffect(() => {
    if (firstSearch.current) {
      firstSearch.current = false;
      return;
    }

    // If user clears input: length = 0
    if (searchInput.length === 0) {
      dispatch(
        setSegmentListFilters({
          search_filter: '',
          currentPage: 1,
        })
      );
      dispatch(getSegmentListApi());
      return;
    }

    // If less than 3 chars → do NOTHING
    if (searchInput.length < 3) {
      return;
    }

    // Debounce for >= 3 chars
    const delay = setTimeout(() => {
      dispatch(
        setSegmentListFilters({
          search_filter: searchInput,
          currentPage: 1,
        })
      );
      dispatch(getSegmentListApi());
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  // -----------------------------
  // TAB CHANGE
  // -----------------------------
  const handleTabChange = (key) => {
    setActiveTab(key);

    dispatch(
      setSegmentListFilters({
        filter_list: key,
        currentPage: 1,
      })
    );

    dispatch(getSegmentListApi());
  };

  // -----------------------------
  // TABLE SORTING + PAGINATION
  // -----------------------------
  const handleTableChange = (pagination, _filters, sorterArg) => {
    const sorter = Array.isArray(sorterArg) ? sorterArg[0] : sorterArg;

    const order =
      sorter?.order === 'ascend'
        ? 1
        : sorter?.order === 'descend'
          ? 0
          : filters.order;

    const orderByCol = sorter?.field || filters.order_by_col;

    dispatch(
      setSegmentListFilters({
        act: 'get_filter_segments',
        countSync: 0,
        currentPage: pagination.current || 1,
        filter_list: filters.filter_list,
        limit: pagination.pageSize || 10,
        messageFilter: 'all',
        order,
        order_by_col: orderByCol,
        sort: orderByCol,
        totalRecords: filters.totalRecords,
        search_filter: filters.search_filter || '',
      })
    );

    dispatch(getSegmentListApi());
  };

  // -----------------------------
  // DELETE CONFIRMATION
  // -----------------------------
  useEffect(() => {
    if (deleteSegmentApiState === 'success') {
      notification.success({
        message: deleteSegmentApiMessage || 'Segment deleted successfully',
      });
      setSegmentId('');
      setDeleteSegmentModalVisible(false);
      dispatch(deleteSegmentReset());
      dispatch(getSegmentListApi());
    }
    if (deleteSegmentApiState === 'error') {
      notification.error({
        message: deleteSegmentApiMessage || 'error',
      });
      dispatch(deleteSegmentReset());
    }
  }, [deleteSegmentApiState]);

  const handleDeleteSegment = () => {
    dispatch(
      deleteSegmentApi({
        del_filter_id: segmentId,
        no_defaults: true,
        act: 'delete_filter_segment',
      })
    );
  };

  const handleCreateButonClick = () => {
    router.push('/customers/all-customers/list');
  };

  return (
    <LayoutContainer>
      <MainWrapper>
        <AitPageHeader
          title="Segments"
          subtitle="Create live segments of customers to personalise engagements."
          subtitleLink=""
          buttonLabel="Create"
          onButtonClick={handleCreateButonClick}
          isCreateButtonVisible={true}
        />

        <AitCard
          hascustomheader={true}
          hastabs={true}
          custombodypadding={{
            xs: '12px 20px 20px 20px',
            sm: '12px 20px 20px 20px',
            md: '12px 24px 24px 24px',
          }}
          headercolreverse={true}
          customheaderleft={
            <AitTabs
              hascustomheader={true}
              hascardheaderrightsection={true}
              activeKey={activeTab}
              onChange={handleTabChange}
              items={segmentListTabItems.map((item) => ({
                label: `${item?.label}`, // will Display table in header
                key: item?.key,
              }))}
            />
          }
          customheaderright={
            <Row gutter={[20, 20]}>
              <Col xs={{ span: 24 }} sm={{ span: 'auto' }}>
                <SearchInputWrapper>
                  <AitInputBox
                    placeholder={'Search to filter'}
                    suffix={
                      <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    }
                    style={{ minWidth: 250 }}
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchInput?.length > 0 && (
                    <AitButton
                      title="Reset"
                      onClick={() => setSearchInput('')}
                    />
                  )}
                </SearchInputWrapper>
              </Col>
            </Row>
          }
        >
          <SegmentListTable
            handleDeleteSegmentClick={(segmentId) => {
              setDeleteSegmentModalVisible(true);
              setSegmentId(segmentId);
            }}
            handleExportSegmentClick={(segmentId) => {
              setExportSegmentModalVisible(true);
              setSegmentId(segmentId);
            }}
            handleTableChange={handleTableChange}
          />
        </AitCard>

        <AitConfirmationModal
          visible={deleteSegmentModalVisible}
          setVisible={setDeleteSegmentModalVisible}
          description="This segment will be deleted permanently"
          onConfirm={() => handleDeleteSegment()}
          confirmButtonLoading={deleteSegmentApiLoading}
        />
        <ExportSegmentModal
          visible={exportSegmentModalVisible}
          setVisible={setExportSegmentModalVisible}
          reportId={segmentId}
          setSegmentId={setSegmentId}
        />
      </MainWrapper>
    </LayoutContainer>
  );
};

export default SegmentListTemplate;
