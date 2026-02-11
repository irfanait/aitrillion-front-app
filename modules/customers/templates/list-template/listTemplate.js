import React, { useEffect, useRef, useState } from 'react';
import { SearchInputWrapper } from './style';
import { useSelector, useDispatch } from 'react-redux';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitButton from '@/components/atoms/ait-button/aitButton';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import ListTableList from '../../organisms/list-table-list/listTableList';
import { LayoutContainer } from '../all-customers-template/style';
import { Row, Col, Typography, App } from 'antd';
import { StyledTag } from './style';
import { SearchOutlined } from '@ant-design/icons';
import CreateListModal from '../../molecules/create-list-modal/createListModal';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import ExportSegmentModal from '../../molecules/export-segment-modal/exportSegmentModal';

import {
  createListReset,
  deleteListReset,
  resetFilters,
  setSearch,
} from '@/redux/customers-slice/list-slices/listSlice';
import {
  deleteListApi,
  getListApi,
} from '@/redux/apis/customers-api/customersApi';

const { Title } = Typography;

const ListTemplate = () => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const {
    filters,
    createListApiState,
    createListMessage,
    totalRecords,
    deleteListLoading,
    deleteListApiState,
    deleteListMessage,
  } = useSelector((state) => state.listState);
  const { login_auth } = useSelector((s) => s.jwtState);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [selectedList, setSelectedList] = useState(null);
  const [mode, setMode] = useState('create'); // create or edit
  const [deleteListModal, setDeleteListModal] = useState(false);

  const [exportSegmentModalVisible, setExportSegmentModalVisible] =
    useState(false);
  // DEBOUNCE LOCAL STATE
  const [searchInput, setSearchInput] = useState('');

  // ***** Prevent multiple API calls *****
  const prevFilterKeyRef = useRef('');

  useEffect(() => {
    const key = JSON.stringify({
      keyword: filters.keyword,
      listType: filters.listType,
      order: filters.order,
      limit: filters.limit,
      currentPage: filters.currentPage,
      sort: filters.sort,
      reset: true,
      totalRecords: 0,
    });

    if (prevFilterKeyRef.current === key) return;
    prevFilterKeyRef.current = key;

    dispatch(
      getListApi({
        shop_id: login_auth.shop_id,
        listType: filters.listType,
        keyword: filters.keyword,
        order: filters.order,
        limit: filters.limit,
        currentPage: filters.currentPage,
        countSync: 1,
        reset: true,
        totalRecords: 0,
      })
    );
  }, [
    filters.keyword,
    filters.listType,
    filters.order,
    filters.limit,
    filters.currentPage,
    dispatch,
  ]);

  // Debounced effect for search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchInput.length === 0 || searchInput.length >= 3) {
        dispatch(setSearch(searchInput));
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput, dispatch]);

  useEffect(() => {
    if (createListApiState === 'success') {
      dispatch(createListReset());
      setCreateModalVisible(false);
      setMode('create');
      setSelectedList(null);
      notification.success({ message: createListMessage });
      refreshList();
    }
    if (createListApiState === 'error') {
      dispatch(createListReset());
      notification.error({ message: createListMessage });
    }
  }, [createListApiState]);

  useEffect(() => {
    if (deleteListApiState === 'success') {
      dispatch(deleteListReset());
      setDeleteListModal(false);
      setSelectedList(null);
      notification.success({ message: deleteListMessage });
    }
    if (deleteListApiState === 'error') {
      dispatch(deleteListReset());
      notification.error({ message: deleteListMessage });
    }
  }, [deleteListApiState]);

  const handleSearch = (val) => {
    setSearchInput(val);
  };

  const resetSearch = () => {
    dispatch(resetFilters());
    setSearchInput('');
  };

  const handleCreateModalClick = () => {
    setMode('create');
    setSelectedList(null);
    setCreateModalVisible(true);
  };

  const handleEdit = (record) => {
    setMode('edit');
    setSelectedList(record);
    setCreateModalVisible(true);
  };

  const handleDeleteClick = () => {
    const payload = {
      act: 'delete_list',
      shop_id: login_auth.shop_id,
      id: selectedList.id,
    };
    dispatch(deleteListApi(payload));
  };

  const refreshList = () => {
    prevFilterKeyRef.current = '';
    dispatch(
      getListApi({
        shop_id: login_auth.shop_id,
        ...filters,
        currentPage: 1,
        countSync: 1,
        reset: true,
        totalRecords: 0,
      })
    );
  };

  return (
    <LayoutContainer>
      <MainWrapper>
        <AitPageHeader
          title="Lists"
          subtitle="Create new lists to import contacts"
          buttonLabel="Create"
          onButtonClick={handleCreateModalClick}
        />
        <AitCard
          title={
            <Row gutter={[20, 12]} justify="space-between" align="middle">
              <Col xs={{ span: 24 }} sm={{ flex: '0 0 auto' }}>
                <Title
                  type="primary"
                  level={4}
                  style={{
                    margin: 0,
                  }}
                >
                  List
                  <StyledTag>{totalRecords}</StyledTag>
                </Title>
              </Col>
              <Col xs={{ span: 24 }} sm={{ flex: '0 0 auto' }}>
                <SearchInputWrapper>
                  <AitInputBox
                    placeholder="Search to filter"
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
                      style={{ height: 40 }}
                      onClick={resetSearch}
                    />
                  )}
                </SearchInputWrapper>
              </Col>
            </Row>
          }
          headerpadding={{
            xs: '10px 20px 15px 20px',
            sm: '10px 20px 10px 20px',
            md: '10px 24px',
          }}
        >
          <ListTableList
            handleEdit={(record) => handleEdit(record)}
            handleDeleteClick={(record) => {
              setSelectedList(record);
              setDeleteListModal(true);
            }}
            handleExportListClick={(record) => {
              setSelectedList(record);
              setExportSegmentModalVisible(true);
            }}
          />
        </AitCard>
      </MainWrapper>
      <CreateListModal
        visible={createModalVisible}
        setVisible={setCreateModalVisible}
        mode={mode}
        initialData={selectedList}
      />
      <AitConfirmationModal
        visible={deleteListModal}
        setVisible={setDeleteListModal}
        description="Any currently scheduled workflow associated with this list will be skipped."
        onConfirm={() => handleDeleteClick()}
        confirmButtonLoading={deleteListLoading}
      />
      <ExportSegmentModal
        visible={exportSegmentModalVisible}
        setVisible={setExportSegmentModalVisible}
        reportId={selectedList?.id}
        handleClearList={() => setSelectedList(null)}
      />
    </LayoutContainer>
  );
};

export default ListTemplate;
