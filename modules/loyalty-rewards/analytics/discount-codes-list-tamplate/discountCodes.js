import { useEffect, useMemo, useState } from 'react';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitCard from '@/components/atoms/ait-card/aitCard';
import CliamedList from './claimedList';
import UsedList from './usedList';
import {
  getDiscountCodesListService,
  revertCodeService,
} from '../../api/analytics';
import logger from '@/utils/logger';
import { useSelector } from 'react-redux';
import BirthdayDiscountCodes from './birthday';
import { useSearchParams } from 'next/navigation';
import { navigateWithParam, checkValidData } from '@/utils/common.util';
import { useRouter } from 'next/router';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import CustomAitTable from '@/components/molecules/custom-ait-table';
import DiscountCodeFilter from './birthdayListFilter';
import { Tag, App } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import DiscountCodeFilterForm from './discountFilterForm';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';

function DiscountCodesTamplate() {
  const { notification } = App.useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const jwtState = useSelector((state) => state?.jwtState);
  const [activeTab, setActiveTab] = useState('1');
  const [tableLoading, setTableLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('r.date_created');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchValue, setSearchValue] = useState();
  const [apiData, setAPIState] = useState();
  const [filterValues, setFilterValues] = useState(null);
  const searchQuery = Object.fromEntries(
    searchParams ? searchParams.entries() : {}
  );

  const [revertModal, setRevertModal] = useState(false);
  const [rowData, setRowData] = useState();
  const [revertLoading, setRevertLoading] = useState(false);

  let newParams = {
    ...Object.fromEntries(searchParams.entries()),
    page: '1',
  };

  const getCodeData = async (
    page = currentPage,
    limit = pageSize,
    filters = filterValues
  ) => {
    setTableLoading(true);
    setTableData([]);
    try {
      const payload = {
        act: 'get_allmember_list',
        coupan_type: filters?.discountStatus || '',
        currentPage: page || searchQuery?.page || 1,
        keyword: searchValue || '',
        messageFilter: 'all',
        limit: limit || parseFloat(searchQuery?.pageSize) || 20,
        order: searchQuery?.order || false,
        sort: searchQuery?.sortVal || 'r.date_created',
        reward_discount_id: 0,
        reward_type: filters?.discountCategory || '',
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
        discount_type: filters?.discountType || '',
      };

      // Add filter parameters
      const hasFilters =
        filters &&
        (filters.name ||
          filters.email ||
          filters.discountCode ||
          filters.discountCategory ||
          filters.discountStatus ||
          filters.discountType ||
          filters.startDate ||
          filters.endDate);

      if (searchValue || hasFilters) {
        payload.filter = 1;
        payload.reset = true;
      } else {
        payload.reset = false;
      }

      // Map filter form values to API parameters
      if (hasFilters) {
        if (filters.name) {
          payload.name = filters.name;
        } else {
          payload.name = null;
        }

        if (filters.email) {
          payload.email = filters.email;
        } else {
          payload.email = null;
        }

        if (filters.discountCode) {
          payload.discount_code = filters.discountCode;
        } else {
          payload.discount_code = null;
        }

        // Format dates to MM/DD/YYYY if they exist
        if (filters.startDate) {
          payload.from_date =
            typeof filters.startDate === 'string'
              ? filters.startDate
              : filters.startDate.format('MM/DD/YYYY');
        } else {
          payload.from_date = null;
        }

        if (filters.endDate) {
          payload.to_date =
            typeof filters.endDate === 'string'
              ? filters.endDate
              : filters.endDate.format('MM/DD/YYYY');
        } else {
          payload.to_date = null;
        }
      } else {
        payload.name = null;
        payload.email = null;
        payload.discount_code = null;
        payload.from_date = null;
        payload.to_date = null;
      }

      const response = await getDiscountCodesListService(payload);
      if (response?.data?.status === 'success') {
        setTableData(response?.data?.data || []);
        setTotalRecords(response?.data?.totalrecord);
        setAPIState(response?.data);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
    }
  };

  const handleViewDetails = (data) => {
    setRevertModal(true);
    setRowData(data);
  };

  const handleRevertCode = async () => {
    setRevertLoading(true);
    try {
      const payload = {
        coupon_id: rowData?.coupan_id,
        customer_id: rowData?.customer_id,
        log_id: rowData?.log_id,
        shop: jwtState?.login_auth?.shop_name || '',
      };
      const response = await revertCodeService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: 'Code reverted successfully',
        });
        setRevertModal(false);
        getCodeData();
      } else {
        notification.error({
          message: 'error',
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setRevertLoading(false);
    }
  };

  const columns = [
    {
      title: 'Reward name',
      dataIndex: 'reward_id',
      key: 'reward_id',
      width: 200,
      sorter: true,
      sortValue: 'reward_id',
      render: (cell, row) => checkValidData(row?.reward_id),
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 150,
      sorter: true,
      sortValue: 'first_name',
      render: (cell, row) => checkValidData(row?.full_name),
    },
    {
      title: 'Email',
      dataIndex: 'decoded_email',
      key: 'decoded_email',
      width: 300,
      sorter: true,
      sortValue: 'decoded_email',
      render: (cell, row) => checkValidData(row?.decoded_email),
    },
    {
      title: 'Discount amount',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      width: 160,
      sorter: true,
      sortValue: 'discount_amount',
      render: (cell, row) => checkValidData(row?.discount_amount),
    },

    {
      title: 'Coupon code',
      dataIndex: 'coupan_code',
      key: 'coupan_code',
      width: 160,
      sorter: true,
      sortValue: 'coupan_code',
      render: (cell, row) => checkValidData(row?.coupan_code),
    },
    {
      title: 'Redeem points',
      dataIndex: 'redeem_points',
      key: 'redeem_points',
      width: 150,
      sorter: true,
      sortValue: 'redeem_points',
      render: (cell, row) => checkValidData(row?.redeem_points),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      sorter: true,
      sortValue: 'status',
      render: (cell, row) => {
        const statusColor = {
          used: 'green',
          claimed: 'gold',
        };

        const customStyles = {
          width: 'auto', // set fixed width
          fontSize: '11px',
          textAlign: 'center',
          //   color: row?.activitystatus === 'claimed' ? '#000' : undefined,
          display: 'inline-block',
          textTransform: 'capitalize',
          border: 'none',
        };
        return (
          <Tag
            color={statusColor[row?.status?.toLowerCase()] || 'default'}
            style={customStyles}
            variant="filled"
          >
            {checkValidData(row?.status?.toUpperCase())}
          </Tag>
        );
      },
    },

    {
      title: 'Revert',
      dataIndex: '',
      key: '',
      width: 80,
      fixed: 'left',
      sorter: false,
      sortValue: 'date_created',
      render: (cell, row) =>
        row?.status === 'Used' ? (
          '-'
        ) : !['1000', '1001', '2000', '2001'].includes(
            row?.reward_name_refer
          ) ? (
          <div
            onClick={() => handleViewDetails(row)}
            style={{
              color: 'var(--ant-color-primary)',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Revert
          </div>
        ) : (
          '-'
        ),
    },
    {
      title: 'Created date',
      dataIndex: 'date_created',
      key: 'date_created',
      width: 180,
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.date_created),
    },
  ];

  const handleApplyFilter = (values) => {
    setFilterValues(values);
    // Reset to first page when applying filters
    setCurrentPage(1);
    getCodeData(1, pageSize, values);
  };

  const handleResetFilter = () => {
    setFilterValues(null);
    // Reset to first page when clearing filters
    setCurrentPage(1);
    getCodeData(1, pageSize, null);
  };

  const handleExportFile = async () => {
    setExportLoading(true);
    try {
      const filters = filterValues;
      const hasFilters =
        filters &&
        (filters.name ||
          filters.email ||
          filters.discountCode ||
          filters.discountCategory ||
          filters.discountStatus ||
          filters.discountType ||
          filters.startDate ||
          filters.endDate);

      const payload = {
        act: 'get_allmember_list',
        coupan_type: filters?.discountStatus || '',
        currentPage: currentPage,
        keyword: searchValue || '',
        messageFilter: 'all',
        limit: pageSize,
        order: sortOrder,
        sort: sortValue,
        reward_discount_id: 0,
        reward_type: filters?.discountCategory || '',
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
        discount_type: filters?.discountType || '',
        exportActivities: true, // Export flag
      };

      if (searchValue || hasFilters) {
        payload.filter = 1;
        payload.reset = true;
      } else {
        payload.reset = false;
      }

      // Map filter form values to API parameters
      if (hasFilters) {
        if (filters.name) {
          payload.name = filters.name;
        } else {
          payload.name = null;
        }

        if (filters.email) {
          payload.email = filters.email;
        } else {
          payload.email = null;
        }

        if (filters.discountCode) {
          payload.discount_code = filters.discountCode;
        } else {
          payload.discount_code = null;
        }

        // Format dates to MM/DD/YYYY if they exist
        if (filters.startDate) {
          payload.from_date =
            typeof filters.startDate === 'string'
              ? filters.startDate
              : filters.startDate.format('MM/DD/YYYY');
        } else {
          payload.from_date = null;
        }

        if (filters.endDate) {
          payload.to_date =
            typeof filters.endDate === 'string'
              ? filters.endDate
              : filters.endDate.format('MM/DD/YYYY');
        } else {
          payload.to_date = null;
        }
      } else {
        payload.name = null;
        payload.email = null;
        payload.discount_code = null;
        payload.from_date = null;
        payload.to_date = null;
      }

      const response = await getDiscountCodesListService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (
        searchValue?.length >= 3 ||
        searchValue?.length === 0 ||
        !searchValue
      ) {
        navigateWithParam(newParams, router, router?.route);
        getCodeData();
      }
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const searchData = useMemo(() => {
    return Object.fromEntries(searchParams ? searchParams.entries() : []);
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchQuery)?.length && activeTab === '1') {
      getCodeData();
    }
  }, [searchData]);

  useEffect(() => {
    if (
      Object.keys(searchQuery)?.length === 0 &&
      !searchValue &&
      activeTab === '1'
    ) {
      getCodeData();
    }
  }, [activeTab]);

  const buttons = [
    {
      title: 'Export file',
      icon: <ExportOutlined />,
      onClick: handleExportFile,
      loading: exportLoading,
      disabled: !tableData?.length > 0,
    },
  ];

  return (
    <>
      <AitPageHeader
        title="Discount codes"
        subtitle="Detailed report of discount codes generated."
        hideButton
      />

      <CustomAitTable
        isCard
        filterPopover
        onSearch={(e) => setSearchValue(e)}
        searchPlaceholder="Coupon code , email"
        popoverExtraClassName="discount-code-filter"
        filterContent={(onClose) => (
          <DiscountCodeFilterForm
            onApplyFilter={handleApplyFilter}
            onResetFilter={handleResetFilter}
            onClose={onClose}
          />
        )}
        tableData={tableData}
        columns={columns}
        loading={tableLoading}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalRecords={totalRecords}
        setPageSize={setPageSize}
        pageSize={pageSize}
        setSortValue={setSortValue}
        setSortOrder={(val) => setSortOrder(val === 'asc' ? true : false)}
        verticalScrollHeight={'39vh'}
        buttons={buttons}
      />

      <AitConfirmationModal
        visible={revertModal}
        setVisible={setRevertModal}
        confirmText="Confirm!"
        cancelText="Cancel"
        description="You want to revert the points?"
        onConfirm={() => {
          handleRevertCode();
        }}
        confirmButtonLoading={revertLoading}
      />
    </>
  );
}

export default DiscountCodesTamplate;
