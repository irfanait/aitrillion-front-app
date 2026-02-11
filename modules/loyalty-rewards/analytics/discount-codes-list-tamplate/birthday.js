/* eslint-disable react-hooks/exhaustive-deps */
import CustomAitTable from '@/components/molecules/custom-ait-table';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '@/utils/logger';
import { checkValidData } from '@/utils/common.util';
import { getClaimedListDataService } from '../../api/analytics';
import { App, Tag } from 'antd';
import DiscountCodeFilter from './birthdayListFilter';
import { ExportOutlined } from '@ant-design/icons';

function BirthdayDiscountCodes({ activeTab }) {
  const { notification } = App.useApp();
  const jwtState = useSelector((state) => state?.jwtState);
  const [tableLoading, setTableLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('r.date_created');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchValue, setSearchValue] = useState();
  const [filterValues, setFilterValues] = useState(null);

  const coloms = [
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
      title: 'Created date',
      dataIndex: 'date_created',
      key: 'date_created',
      width: 180,
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.date_created),
    },
  ];

  const getCodeData = async (
    page = currentPage,
    pageSize,
    filters = filterValues,
    exportActivities = false
  ) => {
    setTableLoading(true);
    setTableData([]);
    try {
      const payload = {
        act: 'get_allmember_list',
        birthday_coupan_type: '',
        coupan_type: '4',
        currentPage: page,
        keyword: searchValue || '',
        messageFilter: 'all',
        limit: pageSize,
        order: sortOrder,
        sort: sortValue,
        reward_discount_id: 0,
        reward_type: 2000,
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
        exportActivities: exportActivities,
      };

      // Add filter parameters
      const hasFilters =
        filters &&
        (filters.name ||
          filters.email ||
          filters.discountCode ||
          filters.status ||
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
        // Only add filter fields if they have values
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

        // Map status values: 'claimed' -> 1, 'used' -> 2, empty/null -> send empty string
        if (filters.status === 'claimed') {
          payload.status = 1;
        } else if (filters.status === 'used') {
          payload.status = 2;
        } else {
          // If status is empty or 'All', send empty string
          payload.status = '';
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
        payload.status = ''; // Send empty string when no filters
      }

      const response = await getClaimedListDataService(payload);
      if (response?.data?.status === 'success') {
        setTableData(response?.data?.data || []);
        setTotalRecords(response?.data?.totalrecord);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage && activeTab === '4') {
      getCodeData(currentPage, pageSize, filterValues);
    }
  }, [currentPage, pageSize, sortValue, sortOrder, activeTab, filterValues]);

  useEffect(() => {
    if (searchValue?.length >= 3 || searchValue?.length === 0) {
      const delayDebounce = setTimeout(() => {
        getCodeData(currentPage, pageSize, filterValues);
      }, 1500);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchValue]);

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
          filters.status ||
          filters.startDate ||
          filters.endDate);

      const payload = {
        act: 'get_allmember_list',
        birthday_coupan_type: '',
        coupan_type: '4',
        currentPage: currentPage,
        keyword: searchValue || '',
        messageFilter: 'all',
        limit: pageSize,
        order: sortOrder,
        sort: sortValue,
        reward_discount_id: 0,
        reward_type: 2000,
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
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
        // Only add filter fields if they have values
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

        // Map status values: 'claimed' -> 1, 'used' -> 2, empty/null -> send empty string
        if (filters.status === 'claimed') {
          payload.status = 1;
        } else if (filters.status === 'used') {
          payload.status = 2;
        } else {
          // If status is empty or 'All', send empty string
          payload.status = '';
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
        payload.status = ''; // Send empty string when no filters
      }

      const response = await getClaimedListDataService(payload);
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
      <CustomAitTable
        filterPopover
        onSearch={(e) => setSearchValue(e)}
        searchPlaceholder="Coupon code , email"
        filterContent={(onClose) => (
          <DiscountCodeFilter
            onApplyFilter={handleApplyFilter}
            onResetFilter={handleResetFilter}
            onClose={onClose}
          />
        )}
        tableData={tableData}
        columns={coloms}
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
    </>
  );
}

export default BirthdayDiscountCodes;
