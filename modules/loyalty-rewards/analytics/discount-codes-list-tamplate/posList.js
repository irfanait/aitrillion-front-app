/* eslint-disable react-hooks/exhaustive-deps */
import CustomAitTable from '@/components/molecules/custom-ait-table';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '@/utils/logger';
import { checkValidData } from '@/utils/common.util';
import { ArrowDownOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { getRewardPOSService } from '../../api/analytics';

function POSList({ activeTab }) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('r.created_date');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchValue, setSearchValue] = useState();

  const coloms = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'first_name',
      render: (cell, row) => checkValidData(row?.full_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'decoded_email',
      render: (cell, row) => checkValidData(row?.decoded_email),
    },
    {
      title: 'Discount amount',
      dataIndex: 'email',
      key: 'email',
      width: 400,
      fixed: 'left',
      sorter: true,
      sortValue: 'discount_amount',
      render: (cell, row) =>
        checkValidData(
          // row?.reward_name_refer === '2000' ||
          //   row?.reward_name_refer === 'Percentage off'
          //   ? `${row?.discount_amount}%`
          //   : // : `${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}${row?.discount_amount}`
          row?.discount_amount
        ),
    },

    {
      title: 'Redeem points',
      dataIndex: 'email',
      key: 'email',
      width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'redeem_points',
      render: (cell, row) => checkValidData(row?.redeem_points),
    },
    {
      title: 'Status',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      fixed: 'left',
      sorter: true,
      sortValue: 'status',
      render: (cell, row) => checkValidData(row?.status),
    },
    {
      title: 'Created date',
      dataIndex: 'email',
      key: 'email',
      width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.date_created),
    },
    {
      title: 'Order Id',
      dataIndex: 'email',
      key: 'email',
      width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.order_number),
    },
  ];

  const getCodeData = async (page = currentPage, pageSize) => {
    setTableLoading(true);
    setTableData([]);
    try {
      const payload = {
        act: 'get_allmember_list',
        coupan_type: '3',
        currentPage: page,
        keyword: searchValue || '',
        messageFilter: 'all',
        limit: pageSize,
        order: sortOrder,
        sort: sortValue,
        reward_discount_id: 0,
        reward_type: 0,
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
      };

      if (searchValue) {
        payload.filter = 1;
        payload.reset = true;
      } else {
        payload.reset = false;
      }
      const response = await getRewardPOSService(payload);
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

  const buttons = [
    {
      title: 'Download sample CSV',
      icon: <ArrowDownOutlined />,
      //   onClick: handleDownload,
    },
    {
      title: 'Upload CSV',
      icon: <CloudUploadOutlined />,
      //   onClick: handleButtonClick,
    },
  ];

  useEffect(() => {
    if (currentPage && activeTab === '3') {
      getCodeData(currentPage, pageSize, sortValue, sortOrder);
    }
  }, [currentPage, pageSize, sortValue, sortOrder, activeTab]);

  useEffect(() => {
    if (searchValue?.length >= 3 || searchValue?.length === 0) {
      const delayDebounce = setTimeout(() => {
        getCodeData(currentPage, pageSize, sortValue, sortOrder, sortOrder);
      }, 2000);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchValue]);

  return (
    <>
      <CustomAitTable
        search
        onSearch={(e) => setSearchValue(e)}
        searchPlaceholder="Coupon code , email"
        tableData={tableData}
        columns={coloms}
        buttons={buttons}
        btn={false}
        loading={tableLoading}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalRecords={totalRecords}
        setPageSize={setPageSize}
        pageSize={pageSize}
        setSortValue={setSortValue}
        setSortOrder={(val) => setSortOrder(val === 'asc' ? true : false)}
      />
    </>
  );
}

export default POSList;
