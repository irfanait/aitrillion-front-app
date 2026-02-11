import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  App,
  Col,
  Flex,
  Row,
  Spin,
  Typography,
  Grid,
  Tooltip,
  Dropdown,
  Space,
  Button,
} from 'antd';
import { IconButton, SelectColumnWrapper, StyledTag } from './style';
import { useDispatch, useSelector } from 'react-redux';
const { useBreakpoint } = Grid;
import {
  processBulkStatusReset,
  resetListAndFilters,
  setAllCustomerFilters,
  setCustomerColumns,
  setUpdateGridFilters,
  updateBulkStatusReset,
} from '@/redux/customers-slice/all-customers-slices/all-customers-slice';
import AitTable from '@/components/molecules/ait-table/aitTable';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitCheckboxDropdown from '@/components/atoms/ait-checkbox-dropdown/aitCheckboxDropdown';
import {
  getCustomersList,
  processBulkCustomerStatusApi,
  updateColumnFields,
  updateCustomerBulkStatusApi,
} from '@/redux/apis/customers-api/customersApi';
import { isHtml, stripHtml, toSentenceCase } from '../../utils/helper';
import { useRouter } from 'next/router';
import {
  MailFilled,
  SyncOutlined,
  UserOutlined,
  ArrowRightOutlined,
  DownOutlined,
  CaretDownOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import BulkStatusUpdateWithEmailModal from '../../molecules/bulk-status-update-with-email-modal/bulkStatusUpdateWithEmailModal';

const { Title, Text, Link } = Typography;

const AllCustomersListTable = (props) => {
  const screens = useBreakpoint();
  const { activeSegmentId, showFilters } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollRef = useRef(null);
  const isManualRefreshRef = useRef(false);

  const { notification } = App.useApp();

  const allCustomerState = useSelector((state) => state.allCustomersState);
  const { login_auth } = useSelector((state) => state.jwtState);

  const {
    getCustomerInItData,
    allCustomersListLoading,
    allCustomersList,
    selectedColumnIds,
    filters,
    totalCustomersCount,
    updateCustomerBulkStatusApiState,
    updateCustomerBulkStatusMessage,
    updateCustomerBulkStatusLoading,

    processBulkCustomerStatusApiState,

    processBulkCustomerStatusMessage,

    totalPages,
  } = allCustomerState;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deselectedKeys, setDeselectedKeys] = useState(() => new Set());
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null); // 1 = active, 0 = inactive
  const [pageLoading, setPageLoading] = useState(false);

  const [bulkProcessingModalOpen, setBulkProcessingModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');

  const allFields = useMemo(
    () => getCustomerInItData?.moduleFieldsRows || [],
    [getCustomerInItData?.moduleFieldsRows]
  );
  const canSendEmail = !!activeSegmentId && totalCustomersCount > 0;

  // Initial selected columns (those with isDefaultFieldToShow: 1)
  useEffect(() => {
    if (selectedColumnIds.length === 0 && allFields.length > 0) {
      const defaults = allFields
        .filter((f) => f.isDefaultFieldToShow === 1)
        .map((f) => f.id);
      dispatch(setCustomerColumns(defaults));
    }
  }, [allFields, selectedColumnIds.length, dispatch]);

  const fetchKey = useMemo(() => {
    return JSON.stringify({
      shop_id: filters.shop_id,
      page: filters.currentPage,
      limit: filters.limit,
      sort: filters.sort,
      order: filters.order,
      masterFilter: filters.masterFilter,
      list_search: filters.list_search,
      refreshKey: filters.refreshKey,
      selectedOperatorType: filters.selectedOperatorType,
    });
  }, [
    filters.shop_id,
    filters.currentPage,
    filters.limit,
    filters.sort,
    filters.order,
    filters.masterFilter,
    filters.list_search,
    filters.refreshKey,
    filters.selectedOperatorType,
  ]);

  useEffect(() => {
    if (!filters.shop_id) return;
    dispatch(getCustomersList());
  }, [fetchKey, dispatch, filters.shop_id]);

  const loadedIds = useMemo(
    () => (allCustomersList || []).map((r) => r.id),
    [allCustomersList]
  );

  const computedSelectedKeys = useMemo(() => {
    if (!selectAll) return selectedRowKeys;
    // In select-all mode, everything is selected except explicitly deselected
    return loadedIds.filter((id) => !deselectedKeys.has(id));
  }, [selectAll, deselectedKeys, loadedIds, selectedRowKeys]);

  const renderCell = useCallback(
    (field) => {
      const CellRenderer = (text, record) => {
        const value = record?.[field.db_column_alias];

        if (field.db_column_alias === 'full_name') {
          const hasName = value && stripHtml(value).trim();
          const displayText = hasName ? stripHtml(value) : 'View Details';

          const handleNameClick = (e) => {
            e.preventDefault();

            // Build URL with query params to preserve state
            const queryParams = new URLSearchParams();
            queryParams.set('fromList', 'true');

            // Only use segment_id from URL (source of truth)
            // If user applied manual filters, there won't be segment_id in URL
            if (router.query?.segment_id) {
              queryParams.set('segment_id', router.query.segment_id);
            }

            if (router.query?.listId || filters.list_search) {
              queryParams.set(
                'listId',
                router.query?.listId || filters.list_search
              );
            }

            const detailsUrl = `/customers/all-customers/customer-details/${record.encoded_id}?${queryParams.toString()}`;
            router.push(detailsUrl);
          };

          return (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Tooltip title="View details in same tab">
                <a
                  href={`/customers/all-customers/customer-details/${record.encoded_id}`}
                  onClick={handleNameClick}
                  style={{
                    color: '#1F5EFF',
                    cursor: 'pointer',
                    fontWeight: 500,
                    textTransform: hasName ? 'capitalize' : 'none',
                  }}
                >
                  {displayText}
                </a>
              </Tooltip>
              <Tooltip title="View details in new tab">
                <a
                  href={`/customers/all-customers/customer-details/${record.encoded_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#1F5EFF',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExportOutlined style={{ fontSize: '12px' }} />
                </a>
              </Tooltip>
            </div>
          );
        }

        if (value == null) return '';
        if (field.db_column_alias === 'shop_name') {
          const url = value.match(/href=['"]([^'"]+)['"]/)?.[1];

          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 500,
                color: '#1F5EFF',
                cursor: 'pointer',
              }}
            >
              {stripHtml(value)}
            </a>
          );
        }

        if (isHtml(value)) {
          return <span dangerouslySetInnerHTML={{ __html: value }} />;
        }

        return value;
      };

      CellRenderer.displayName = `CellRenderer_${field.db_column_alias}`;
      return CellRenderer;
    },
    [router]
  );

  // 2) Build dropdown options
  const columnOptions = useMemo(() => {
    return allFields
      .filter(
        (field) =>
          Number(field.is_filter) !== 0 && field.field_name !== 'Timeline'
      )
      .map((field) => ({
        label: toSentenceCase(field.field_name),
        value: String(field.id),

        disabled: field.field_name === 'Full Name',

        defaultChecked: Number(field.isDefaultFieldToShow) === 1,
      }));
  }, [allFields]);

  // ===== SAME AS ANGULAR: derive from options only =====
  const totalSelectableColumns = useMemo(() => {
    return columnOptions.length;
  }, [columnOptions]);

  const selectedColumnsCount = useMemo(() => {
    return selectedColumnIds.length;
  }, [selectedColumnIds]);

  const selectColumnsLabel = useMemo(() => {
    if (selectedColumnsCount === 0) return 'Select columns';

    if (
      selectedColumnsCount > 0 &&
      selectedColumnsCount < totalSelectableColumns
    ) {
      return `${selectedColumnsCount} columns selected`;
    }

    if (
      selectedColumnsCount === totalSelectableColumns &&
      totalSelectableColumns > 0
    ) {
      return 'All columns selected';
    }

    return 'Select columns';
  }, [selectedColumnsCount, totalSelectableColumns]);

  // 3) Build table columns (only checked)
  const columns = useMemo(() => {
    const checked = new Set(selectedColumnIds.map(String));
    const selectedFields = allFields.filter(
      (f) => checked.has(String(f.id)) && f.field_name !== 'Timeline'
    );

    return selectedFields.map((f, idx) => ({
      title: f.field_name,
      dataIndex: f.db_column_alias,
      key: String(f.id),
      width: 160,
      fixed: idx === 0 ? 'left' : undefined,
      sorter: true,
      tableAlias: f.db_table_alias || 'c',
      render: renderCell(f),
    }));
  }, [allFields, selectedColumnIds, renderCell]);

  // 4) Handler for checkbox dropdown
  const handleColumnChange = (vals) => {
    dispatch(setCustomerColumns(vals));
    const prev = selectedColumnIds;
    const added = vals.find((v) => !prev.includes(v));
    const removed = prev.find((v) => !vals.includes(v));

    if (added !== undefined) {
      dispatch(setUpdateGridFilters({ id: added, checked_status: 1 }));
      dispatch(updateColumnFields());
    }
    if (removed !== undefined) {
      dispatch(setUpdateGridFilters({ id: removed, checked_status: 0 }));
      dispatch(updateColumnFields());
    }
  };

  // Infinite scroll: when near bottom, load next page if available

  const hasMore = allCustomersList?.length < (totalCustomersCount || 0);

  const handleScroll = useCallback(() => {
    if (isManualRefreshRef.current) return;
    if (allCustomersListLoading) return;
    if (!hasMore) return;

    const el = scrollRef.current;
    if (!el) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;

    if (nearBottom) {
      dispatch(
        setAllCustomerFilters({
          currentPage: filters.currentPage + 1,
        })
      );
    }
  }, [filters.currentPage, allCustomersListLoading, hasMore, dispatch]);

  useEffect(() => {
    if (!allCustomersListLoading) {
      setPageLoading(false);
      isManualRefreshRef.current = false;
    }
  }, [allCustomersListLoading]);

  // infinite scroll state
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleTableChange = (pagination, _, sorter) => {
    // 🔹 SORT CHANGE
    if (sorter?.field && sorter?.order) {
      const column = columns.find((col) => col.dataIndex === sorter.field);

      // ✅ UI → DB FIELD MAPPING (CRITICAL FIX)
      const SORT_FIELD_MAP = {
        full_name: 'first_name', // backend does NOT have full_name
      };

      const tableAlias = column?.tableAlias || 'c';
      const dbField = SORT_FIELD_MAP[sorter.field] || sorter.field;

      const sortField = `${tableAlias}.${dbField}`;
      const sortOrder = sorter.order === 'ascend';

      // 🔹 1️⃣ DATA REQUEST
      dispatch(
        setAllCustomerFilters({
          shop_id: filters.shop_id,
          currentPage: 1,
          limit: filters.limit,
          sort: sortField,
          order: sortOrder,
          is_sort_req: 1,
          isFirstRequest: false,
          get_only_data: 1,
          is_count_req: 0,
          act: 'list_customer',
          gridOrMap: 'grid',
          selectedpeopleType: 'Customers',
          selectedOperatorType: filters.selectedOperatorType,
          isRequestForActiveCustomers: filters.isRequestForActiveCustomers,
          masterFilter: Array.isArray(filters.masterFilter)
            ? filters.masterFilter
            : [],
        })
      );

      // 🔹 2️⃣ COUNT REQUEST (Angular-style)
      dispatch(
        setAllCustomerFilters({
          shop_id: filters.shop_id,
          currentPage: 1,
          limit: filters.limit,
          sort: sortField,
          order: sortOrder,
          is_sort_req: 1,
          isFirstRequest: false,
          get_only_data: 0,
          is_count_req: 1,
          act: 'list_customer',
          gridOrMap: 'grid',
          selectedpeopleType: 'Customers',
          selectedOperatorType: filters.selectedOperatorType,
          isRequestForActiveCustomers: filters.isRequestForActiveCustomers,
          masterFilter: Array.isArray(filters.masterFilter)
            ? filters.masterFilter
            : [],
        })
      );

      return;
    }

    // 🔹 PAGE CHANGE
    if (pagination?.current && pagination.current !== filters.currentPage) {
      dispatch(
        setAllCustomerFilters({
          currentPage: pagination.current,
        })
      );
    }
  };

  useEffect(() => {
    if (updateCustomerBulkStatusApiState === 'success') {
      notification.success({ message: updateCustomerBulkStatusMessage });
      setSelectAll(false);
      setSelectedRowKeys([]);
      setDeselectedKeys(new Set());
      setConfirmModalOpen(false);
      dispatch(updateBulkStatusReset());
    }
    if (updateCustomerBulkStatusApiState === 'error') {
      notification.error({ message: updateCustomerBulkStatusMessage });

      dispatch(updateBulkStatusReset());
    }
  }, [
    updateCustomerBulkStatusApiState,
    updateCustomerBulkStatusMessage,
    notification,
    dispatch,
  ]);

  useEffect(() => {
    if (processBulkCustomerStatusApiState === 'success') {
      notification.success({ message: processBulkCustomerStatusMessage });
      setSelectAll(false);
      setSelectedRowKeys([]);
      setDeselectedKeys(new Set());
      setBulkProcessingModalOpen(false);
      dispatch(processBulkStatusReset());
    }
    if (processBulkCustomerStatusApiState === 'error') {
      notification.error({ message: processBulkCustomerStatusMessage });

      dispatch(processBulkStatusReset());
    }
  }, [
    processBulkCustomerStatusApiState,
    processBulkCustomerStatusMessage,
    notification,
    dispatch,
  ]);

  const rowSelection = {
    selectedRowKeys: computedSelectedKeys,
    preserveSelectedRowKeys: true,
    checkStrictly: true, // prevent AntD from auto-selecting page

    onChange: (keys) => {
      if (!selectAll) setSelectedRowKeys(keys);
    },

    onSelect: (record, checked) => {
      if (!selectAll) return;
      setDeselectedKeys((prev) => {
        const next = new Set(prev);
        if (checked) next.delete(record.id);
        else next.add(record.id);
        return next;
      });
    },

    onSelectAll: (checked, selectedRows, changeRows) => {
      if (checked) {
        setSelectedRowKeys(loadedIds);
      } else {
        setSelectedRowKeys([]);
      }

      setDeselectedKeys((prev) => {
        const next = new Set(prev);
        changeRows.forEach((r) => {
          if (checked) next.delete(r.id);
          else next.add(r.id);
        });
        return next;
      });
    },
  };

  const handleBulkStatusChange = (statusValue) => {
    const selectedCount = selectAll
      ? totalCustomersCount
      : selectedRowKeys.length;

    setPendingStatus(statusValue);

    if (selectedCount > process.env.NEXT_PUBLIC_TOTAL_CUSTOMER_LIMIT_POPUP) {
      setConfirmModalOpen(false);
      setBulkProcessingModalOpen(true);
      return;
    }

    let payload;

    if (selectAll) {
      // ✅ Case: All records selected
      payload = {
        selectedpeopleType: 'Customers',
        isRequestForActiveCustomers: filters.isRequestForActiveCustomers || 0,
        selectedOperatorType: filters.selectedOperatorType || 'and',
        masterFilter: Array.isArray(filters.masterFilter)
          ? filters.masterFilter
          : [],
        selectedCustomerCount: totalCustomersCount,
        status: String(statusValue),
        selectedCustomers: 'All',
        act: 'blk_chng_cst_status',
      };
    } else {
      // ✅ Case: Only some rows selected
      const finalSelectedIds = selectedRowKeys;
      if (finalSelectedIds.length === 0) return;

      payload = {
        selectedpeopleType: 'Customers',
        isRequestForActiveCustomers: filters.isRequestForActiveCustomers || 0,
        selectedOperatorType: filters.selectedOperatorType || 'and',
        masterFilter: Array.isArray(filters.masterFilter)
          ? filters.masterFilter
          : [],
        selectedCustomerCount: finalSelectedIds.length,
        status: String(statusValue),
        selectedCustomers: JSON.stringify(finalSelectedIds),
        act: 'blk_chng_cst_status',
      };
    }

    dispatch(updateCustomerBulkStatusApi(payload));
  };

  const handleSync = () => {
    isManualRefreshRef.current = true;
    setSelectedRowKeys([]);
    setSelectAll(false);
    setDeselectedKeys(new Set());

    dispatch(
      setAllCustomerFilters({
        act: 'list_customer',
        currentPage: 1,
        get_filter_customer_count: 1,
        get_only_data: 0,
        gridOrMap: 'grid',
        isFirstRequest: false,
        isRequestForActiveCustomers: 0,
        is_count_req: 0,
        is_sort_req: 0,
        just_seen: '',
        limit: 20,
        masterFilter: filters.masterFilter,
        moduleField: null,
        moduleFieldOperator: null,
        order: false,
        selectedOperatorType: 'and',
        selectedpeopleType: 'Customers',
        shop_id: login_auth?.shop_id,
        sort: 'c.last_seen_date',
        refreshKey: Date.now(),
      })
    );
  };

  const hasSelected = selectedRowKeys.length > 0;

  const customcardrightmargin = !screens?.sm ? '10px' : 0;

  //!screens?.sm ? '10px' : 0;

  return (
    <AitCard
      hastabs={false}
      hascustomheader={true}
      bodypadding={{
        xs: '0px 0px 0px 0px',
        sm: '0px 0px 0px 0px',
        md: '0px 0px 0px 0px',
      }}
      custombodypadding={{
        xs: '0px 20px 10px 20px',
        sm: '0px 20px 10px 20px',
        md: '0px 24px 24px 24px',
      }}
      headerpadding={{
        xs: '15px 20px 15px 20px',
        sm: '15px 20px 15px 20px',
        md: '10px 24px 10px 24px',
      }}
      customheaderleft={
        <Row gutter={[20, 20]}>
          <Col xs={{ span: 24 }} sm={{ span: 'auto' }}>
            <SelectColumnWrapper>
              <Flex align="center">
                <Title type="primary" level={4} style={{ margin: 0 }}>
                  Total customers{' '}
                </Title>
                <StyledTag
                  style={{
                    color: '#1a73e8',
                    backgroundColor: '#eff6ff',
                    border: 'none',
                    marginLeft: 8,
                  }}
                >
                  {totalCustomersCount}
                </StyledTag>
                {allCustomersListLoading ? (
                  <IconButton
                    style={{
                      padding: '0px !important',
                      height: 'auto',
                      width: 'auto',
                    }}
                  >
                    <Spin />{' '}
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={handleSync}
                    style={{
                      padding: '0px !important',
                      height: 'auto',
                      width: 'auto',
                    }}
                  >
                    <SyncOutlined style={{ color: '#0958d9' }} />
                  </IconButton>
                )}
              </Flex>
            </SelectColumnWrapper>
            {hasSelected && !selectAll && (
              <>
                <Text>{`All ${selectedRowKeys?.length} rows on this page are selected`}</Text>{' '}
                {totalCustomersCount > 20 && (
                  <Link
                    onClick={() => {
                      setSelectAll(true);
                      setDeselectedKeys(new Set()); // reset any previous exceptions
                      // optional: make the current page look selected immediately
                      setSelectedRowKeys(loadedIds);
                    }}
                  >
                    {`Select all ${totalCustomersCount} records.`}
                  </Link>
                )}
              </>
            )}
            {selectAll && (
              <>
                <Text>{`All ${totalCustomersCount} records selected`}</Text>
                <Link
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    setSelectAll(false);
                    setDeselectedKeys(new Set());
                    setSelectedRowKeys([]);
                  }}
                >
                  Clear selection
                </Link>
              </>
            )}
          </Col>
        </Row>
      }
      customheaderright={
        <Row
          style={{
            marginTop: !screens?.md ? '10px' : 0,
            marginBottom: !screens?.md ? '10px' : 0,
          }}
          gutter={[12, 12]} // no vertical gap needed
          align="middle" // ✅ vertically center items
          wrap={false}
        >
          {canSendEmail && (
            <Col>
              <AitButton
                title="Send email"
                icon={<MailFilled />}
                color="primary"
                variant="outlined"
                onClick={() =>
                  router.push(
                    `/email-marketing/campaign/create-campaign?segmentId=${activeSegmentId}`
                  )
                }
                style={{ whiteSpace: 'nowrap' }}
              />
            </Col>
          )}

          {hasSelected && (
            <Col>
              <SelectColumnWrapper>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'set_active',
                        label: 'Set as Active contacts',
                        onClick: () => {
                          setPendingStatus(1);
                          setConfirmModalOpen(true);
                        },
                      },
                      {
                        key: 'set_inactive',
                        label: 'Set as Non-active contacts',
                        onClick: () => {
                          setPendingStatus(0);
                          setConfirmModalOpen(true);
                        },
                      },
                    ],
                  }}
                >
                  <a type="primary">
                    <Space>
                      Action
                      <CaretDownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </SelectColumnWrapper>
            </Col>
          )}
          <Col xs={{ span: 24 }} sm={{ span: 'auto' }}>
            <SelectColumnWrapper>
              <AitCheckboxDropdown
                label={selectColumnsLabel}
                options={columnOptions}
                onChange={handleColumnChange}
                value={selectedColumnIds}
                disabledOptions={['27', '26']}
                marginbottom={0}
              />
            </SelectColumnWrapper>
          </Col>
        </Row>
      }
    >
      {/* Scroll container drives infinite scroll */}
      <div
        ref={scrollRef}
        className="scrollbar-color"
        style={{
          height: 456,
          overflowY: 'auto',
          overflowX: 'hidden',
          marginLeft: -10,
          marginRight: -10,
          background: '#fff',
        }}
      >
        <AitTable
          filterheaderbottomspace="0px"
          rowKey={(record) => record.id || record.key}
          heading=""
          showFilters={false}
          dataSource={allCustomersList}
          loading={allCustomersListLoading && Number(filters.currentPage) === 1}
          columns={columns}
          onChange={handleTableChange}
          // pagination={paginationConfig}
          pagination={false}
          scroll={{ x: 200 * columns.length }} // horizontal scroll
          sticky
          rowSelection={rowSelection}
          marginleft="-10px"
          // marginright="-10px"
        />

        {/* bottom loader for next pages */}
        {allCustomersListLoading && Number(filters.currentPage) > 1 && (
          <div
            style={{
              borderTop: '1px solid #f0f0f0',
              background: '#fff',
              padding: '14px 0',
              textAlign: 'center',
            }}
          >
            <Spin />
          </div>
        )}
        {!allCustomersListLoading && !hasMore && (
          <div style={{ textAlign: 'center', padding: 12, color: '#888' }}>
            End of the list
          </div>
        )}
      </div>
      <AitConfirmationModal
        visible={confirmModalOpen}
        setVisible={setConfirmModalOpen}
        message={
          pendingStatus === 1
            ? 'Set as Active Contacts'
            : 'Set as Non-active Contacts'
        }
        description={
          selectAll
            ? `Are you sure you want to set all ${totalCustomersCount} customers as ${
                pendingStatus === 1 ? 'Active' : 'Inactive'
              }?`
            : `Are you sure you want to set ${
                computedSelectedKeys.length
              } selected customers as ${
                pendingStatus === 1 ? 'Active' : 'Inactive'
              }?`
        }
        icon={<UserOutlined style={{ color: 'rgb(255, 242, 0)' }} />}
        confirmText={pendingStatus === 1 ? 'Set as active' : 'Set as inactive'}
        onConfirm={() => handleBulkStatusChange(pendingStatus)}
        onCancel={() => {
          setSelectAll(false);
          setDeselectedKeys(new Set());
          setSelectedRowKeys([]);
          setConfirmModalOpen(false);
        }}
        confirmButtonLoading={updateCustomerBulkStatusLoading}
      />

      <BulkStatusUpdateWithEmailModal
        visible={bulkProcessingModalOpen}
        setVisible={setBulkProcessingModalOpen}
        pendingStatus={pendingStatus}
        setNotifyEmail={setNotifyEmail}
        notifyEmail={notifyEmail}
        totalCustomersCount={
          selectAll ? totalCustomersCount : selectedRowKeys.length
        }
        selectAll={selectAll}
        selectedRowKeys={selectedRowKeys}
        filters={filters}
      />
    </AitCard>
  );
};

export default AllCustomersListTable;
