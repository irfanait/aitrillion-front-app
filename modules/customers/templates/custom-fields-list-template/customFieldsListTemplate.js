import React, { useEffect, useMemo, useState } from 'react';
import { LayoutContainer } from '../all-customers-template/style';
import { App, Col, Row, Typography, Grid } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCustomFieldApi,
  getCustomFieldReport,
} from '@/redux/apis/customers-api/customersApi';
import {
  createCustomFieldReset,
  deleteCustomListReset,
  resetCustomFieldsFilters,
  setFieldType,
  setGroupType,
  setKeyword,
} from '@/redux/customers-slice/custom-fields-slices/customFieldsSlices';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import CustomFieldsListTable from '../../organisms/custom-fields-list-table/customFieldsListTable';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitButton from '@/components/atoms/ait-button/aitButton';
import CreateCustomFieldModal from '../../molecules/create-custom-field-modal/createCustomFieldModal';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';

import { StickyAlertWrapper } from './style';
import CustomFieldAlertBar from '../../atoms/custom-field-alert-bar/customFieldAlertBar';
import ManageOptionModal from '../../organisms/manage-option-modal/manageOptionModal';
import { FIELD_TYPE_OPTIONS } from '../../utils/constant';
import { StyledTag } from './style';
import { toSentenceCase } from '../../utils/helper';
const { Title } = Typography;
const { useBreakpoint } = Grid;

const CustomFieldsListTemplate = () => {
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const {
    filters,
    totalRecords,
    createCusTomFieldApiState,
    createCusTomFieldError,
    createCusTomFieldMessage,

    deleteCustomListApiState,
    deleteCustomListLoading,
    deleteCustomListMessage,
  } = useSelector((state) => state.customFieldsState);

  const { keyword, customType, groupType, sort, order, limit, currentPage } =
    filters;

  const { login_auth } = useSelector((state) => state.jwtState);
  const { shop_id } = login_auth;
  const isNonecomShop = Boolean(login_auth?.is_nonecom_shop);

  const getGroupTypeOptions = (isNonecomShop) => {
    if (isNonecomShop) {
      return [
        'Custom Field',
        'Customer',
        'Push',
        'Email',
        'Tracking',
        'Shop',
        'Address',
      ];
    }

    return [
      'Custom Field',
      'Customer',
      'Loyalty',
      'Push',
      'Email',
      'Review',
      'Tracking',
      'Activity',
      'Shop',
      'Address',
    ];
  };

  // 🔍 Local state for debounced search only
  const [searchValue, setSearchValue] = useState('');

  const [createCustomFieldModalVisible, setCreateCustomFieldModalVisible] =
    useState(false);
  const [deleteCustomeListModalVisible, setdeleteCustomeListModalVisible] =
    useState(false);
  const [manageOptionModalVisible, setManageOptionModalVisible] =
    useState(false);

  const [selectedFieldData, setSelectedFieldData] = useState(null);

  // 🔍 Debounced search effect (500ms delay)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.length === 0 || searchValue.length >= 3) {
        dispatch(setKeyword(searchValue));
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, dispatch]);

  // Check if any filters are active
  const hasActiveFilters = keyword || customType !== 0 || groupType !== 0;

  const fieldTypeDropdownOptions = useMemo(
    () => [
      { label: 'All', value: 0 },
      ...FIELD_TYPE_OPTIONS.map((opt) => ({
        label: opt.value,
        value: opt.key,
      })),
    ],
    []
  );

  const groupTypeDropdownOptions = useMemo(
    () => [
      { label: 'All', value: 0 },
      ...getGroupTypeOptions(isNonecomShop).map((group) => ({
        label: toSentenceCase(group),
        value: group,
      })),
    ],
    [isNonecomShop]
  );

  // API call (only when Redux filters change)
  useEffect(() => {
    if (!shop_id) return;

    dispatch(
      getCustomFieldReport({
        act: 'custom_field_report',
        countSync: 1,
        keyword,
        customType,
        groupType,
        sort,
        order,
        limit,
        currentPage,
        shop_id,
        reset: filters.reset ? true : undefined,
        totalRecords: 0,
      })
    );
  }, [
    keyword,
    customType,
    groupType,
    sort,
    order,
    limit,
    currentPage,
    shop_id,
    filters.reset,
  ]);

  useEffect(() => {
    if (createCusTomFieldApiState === 'success') {
      notification.success({ message: createCusTomFieldMessage });
      setCreateCustomFieldModalVisible(false);
      dispatch(
        getCustomFieldReport({
          act: 'custom_field_report',
          countSync: 1,
          keyword,
          customType,
          groupType,
          sort,
          order,
          limit,
          currentPage,
          shop_id,
          reset: filters.reset ? true : undefined,
          totalRecords: 0,
        })
      );
      dispatch(createCustomFieldReset());
    }
    if (createCusTomFieldApiState === 'error') {
      notification.error({ message: createCusTomFieldError });
      // setCreateCustomFieldModalVisible(true);
      dispatch(createCustomFieldReset());
    }
  }, [createCusTomFieldApiState]);

  useEffect(() => {
    if (deleteCustomListApiState === 'success') {
      notification.success({ message: deleteCustomListMessage });
      setdeleteCustomeListModalVisible(false);
      setSelectedFieldData(null);
      dispatch(deleteCustomListReset());
    }
    if (deleteCustomListApiState === 'error') {
      notification.error({ message: deleteCustomListMessage });
      setdeleteCustomeListModalVisible(true);
      dispatch(deleteCustomListReset());
    }
  }, [deleteCustomListApiState]);

  // Reset action
  const handleReset = () => {
    setSearchValue('');
    dispatch(resetCustomFieldsFilters());
  };

  // Open Add modal
  const handleCreateButtonClick = () => {
    setSelectedFieldData(null); // Add mode
    setCreateCustomFieldModalVisible(true);
  };

  // Open Edit modal
  const handleEdit = (record) => {
    setSelectedFieldData(record); // Send full data to modal
    setCreateCustomFieldModalVisible(true);
  };

  const handleDeleteModalClicks = () => {
    const payload = {
      act: 'delete_custom_list',
      id: selectedFieldData.id,
      shop_id: shop_id,
      field_name: selectedFieldData.field_name,
    };
    dispatch(deleteCustomFieldApi(payload));
  };
  return (
    <LayoutContainer>
      <MainWrapper>
        <AitPageHeader
          title="Custom fields"
          subtitle="Custom fields can be created and used for mapping the CSV file header."
          buttonLabel="Create"
          onButtonClick={handleCreateButtonClick}
        />
        <StickyAlertWrapper>
          <CustomFieldAlertBar
            totalAllowed={100}
            dateTypeLimit={15}
            otherTypeLimit={85}
            createdCount={totalRecords}
          />
        </StickyAlertWrapper>
        <AitCard
          cardheadernowrap={false}
          headerpadding={{
            xs: '10px 20px 15px 20px',
            sm: '10px 20px 10px 20px',
            md: '10px 24px 10px 24px',
          }}
          title={
            <Row
              gutter={[12, 12]}
              justify={screens?.lg ? 'end' : 'start'}
              align="middle"
            >
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 'auto', flex: '1 1 auto' }}
                style={{ marginRight: 'auto' }}
              >
                <Title type="primary" level={4} style={{ margin: 'auto' }}>
                  Fields list
                  <StyledTag>{totalRecords}</StyledTag>
                </Title>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 'auto', flex: '1 1 auto' }}
              >
                <Row
                  gutter={[12, 12]}
                  justify={screens?.lg ? 'end' : 'start'}
                  align="middle"
                >
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 12 }}
                    md={{ span: 'auto', flex: '0 0 250px' }}
                  >
                    <AitInputBox
                      placeholder="Search by name"
                      style={{ width: '100%' }}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </Col>

                  {/* FIELD TYPE FILTER */}
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 12 }}
                    md={{ span: 'auto', flex: '0 0 160px' }}
                  >
                    <AitSelectBox
                      placeholder="Field type"
                      style={{ width: screens?.lg ? '160px' : '100%' }}
                      value={customType}
                      onChange={(val) => dispatch(setFieldType(val))}
                      options={fieldTypeDropdownOptions}
                    />
                  </Col>

                  {/* GROUP TYPE FILTER */}
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 12 }}
                    md={{ span: 'auto', flex: '0 0 160px' }}
                  >
                    <AitSelectBox
                      placeholder="Group type"
                      style={{ width: screens?.lg ? '160px' : '100%' }}
                      value={groupType}
                      onChange={(val) => dispatch(setGroupType(val))}
                      options={groupTypeDropdownOptions}
                    />
                  </Col>

                  {/* RESET BUTTON */}
                  {hasActiveFilters && (
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 'auto', flex: '0 0 auto' }}
                    >
                      <AitButton
                        title="Reset"
                        color="secondary"
                        variant="outlined"
                        onClick={handleReset}
                        block
                      />
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          }
        >
          <CustomFieldsListTable
            handleEdit={(record) => handleEdit(record)}
            handleDeleteClick={(record) => {
              setSelectedFieldData(record);
              setdeleteCustomeListModalVisible(true);
            }}
            handleManageOptionsClick={(record) => {
              setSelectedFieldData(record);
              setManageOptionModalVisible(true);
            }}
          />
        </AitCard>
      </MainWrapper>
      <CreateCustomFieldModal
        visible={createCustomFieldModalVisible}
        setVisible={setCreateCustomFieldModalVisible}
        initialData={selectedFieldData}
        mode={selectedFieldData ? 'edit' : 'add'}
      />
      <AitConfirmationModal
        visible={deleteCustomeListModalVisible}
        setVisible={setdeleteCustomeListModalVisible}
        description="This field will be deleted permanently. All the data of this field will be deleted from all contacts. Please ensure to update the corresponding fields on the newsletter signup popup accordingly."
        onConfirm={() => handleDeleteModalClicks()}
        confirmButtonLoading={deleteCustomListLoading}
      />
      <ManageOptionModal
        visible={manageOptionModalVisible}
        setVisible={setManageOptionModalVisible}
        selectedFieldData={selectedFieldData}
        setSelectedFieldData={setSelectedFieldData}
      />
    </LayoutContainer>
  );
};

export default CustomFieldsListTemplate;
