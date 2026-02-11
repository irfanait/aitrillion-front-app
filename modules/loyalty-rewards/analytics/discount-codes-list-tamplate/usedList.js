/* eslint-disable react-hooks/exhaustive-deps */
import CustomAitTable from '@/components/molecules/custom-ait-table';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '@/utils/logger';
import { checkValidData } from '@/utils/common.util';
import { ArrowDownOutlined, CloudUploadOutlined } from '@ant-design/icons';

import { getClaimedListDataService } from '../../api/analytics';
import { Tag } from 'antd';

function UsedList({ activeTab }) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('r.date_created');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchValue, setSearchValue] = useState();

  const coloms = [
    {
      title: 'Reward name',
      dataIndex: 'username',
      key: 'customer-name',
      width: 230,
      // fixed: 'left',
      sorter: true,
      sortValue: 'reward_id',
      render: (cell, row) => checkValidData(row?.reward_id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      // fixed: 'left',
      sorter: true,
      sortValue: 'first_name',
      render: (cell, row) => checkValidData(row?.full_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      // fixed: 'left',
      sorter: true,
      sortValue: 'decoded_email',
      render: (cell, row) => checkValidData(row?.decoded_email),
    },
    {
      title: 'Discount amount',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      //   fixed: 'left',
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
      title: 'Coupon code',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'coupan_code',
      render: (cell, row) => checkValidData(row?.coupan_code),
    },
    {
      title: 'Redeem points',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'redeem_points',
      render: (cell, row) => checkValidData(row?.redeem_points),
    },
    {
      title: 'Status',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      //  fixed: 'left',
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
      dataIndex: 'email',
      key: 'email',
      width: 160,
      // fixed: 'left',
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.date_created),
    },
  ];

  const getCodeData = async (page = currentPage, pageSize) => {
    setTableLoading(true);
    setTableData([]);
    try {
      const payload = {
        act: 'get_allmember_list',
        coupan_type: '2',
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
    if (currentPage && activeTab === '2') {
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
        verticalScrollHeight={'39vh'}
      />
    </>
  );
}

export default UsedList;
