import CustomAitTable from '@/components/molecules/custom-ait-table';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '@/utils/logger';
import { checkValidData, getCurrencyByMoneyFormat } from '@/utils/common.util';

import { ArrowDownOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { App } from 'antd';

import {
  getClaimedListDataService,
  revertCodeService,
} from '../../api/analytics';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';

function CliamedList({
  activeTab,
  tableLoading,
  tableData,
  currentPage,
  pageSize,
  totalRecords,
  setSearchValue,
  setSortOrder,
  setSortValue,
  setPageSize,
  setCurrentPage,
  getCodeData,
}) {
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  // const [tableLoading, setTableLoading] = useState(false);
  // const [tableData, setTableData] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(20);
  // const [sortValue, setSortValue] = useState('r.date_created');
  // const [sortOrder, setSortOrder] = useState(false);
  // const [totalRecords, setTotalRecords] = useState(0);
  // const [statusFilter, setStatusFilter] = useState('all');
  // const [searchValue, setSearchValue] = useState();
  const [revertModal, setRevertModal] = useState(false);
  const [rowData, setRowData] = useState();
  const [revertLoading, setRevertLoading] = useState(false);

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

  const coloms = [
    {
      title: 'Reward name',
      dataIndex: 'username',
      key: 'customer-name',
      width: 200,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'reward_id',
      render: (cell, row) => checkValidData(row?.reward_id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'first_name',
      render: (cell, row) => checkValidData(row?.full_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      // fixed: 'left',
      sorter: true,
      sortValue: 'decoded_email',
      render: (cell, row) => checkValidData(row?.decoded_email),
    },
    {
      title: 'Discount amount',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      width: 160,
      // fixed: 'left',
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
      dataIndex: 'coupan_code',
      key: 'coupan_code',
      width: 140,
      // fixed: 'left',
      sorter: true,
      sortValue: 'coupan_code',
      render: (cell, row) => checkValidData(row?.coupan_code),
    },
    {
      title: 'Redeem points',
      dataIndex: 'redeem_points',
      key: 'redeem_points',
      width: 140,
      // fixed: 'left',
      sorter: true,
      sortValue: 'redeem_points',
      render: (cell, row) => checkValidData(row?.redeem_points),
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
        row?.reward_name_refer !== '1000' ||
        row?.reward_name_refer !== '1001' ||
        row?.reward_name_refer !== '2000' ||
        row?.reward_name_refer !== '2001' ? (
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
  ];

  // const getCodeData = async (page = currentPage, pageSize) => {
  //   setTableLoading(true);
  //   setTableData([]);
  //   try {
  //     const payload = {
  //       act: 'get_allmember_list',
  //       coupan_type: '1',
  //       currentPage: page,
  //       keyword: searchValue || '',
  //       messageFilter: 'all',
  //       limit: pageSize,
  //       order: sortOrder,
  //       sort: sortValue,
  //       reward_discount_id: 0,
  //       reward_type: 0,
  //       shop_email: jwtState?.login_auth?.email || '',
  //       shop_id: jwtState?.login_auth?.shop_id || '',
  //     };

  //     if (searchValue !== '') {
  //       payload.filter = 1;
  //       payload.reset = true;
  //     } else {
  //       payload.reset = false;
  //     }
  //     const response = await getClaimedListDataService(payload);
  //     if (response?.data?.status === 'success') {
  //       setTableData(response?.data?.data || []);
  //       setTotalRecords(response?.data?.totalrecord);
  //     }
  //   } catch (error) {
  //     logger(error?.response);
  //   } finally {
  //     setTableLoading(false);
  //   }
  // };

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

  // useEffect(() => {
  //   if (currentPage && activeTab === '1') {
  //     getCodeData(currentPage, pageSize, statusFilter, sortValue, sortOrder);
  //   }
  // }, [currentPage, pageSize, statusFilter, sortValue, sortOrder, activeTab]);

  // useEffect(() => {
  //   if (searchValue?.length >= 3 || searchValue?.length === 0) {
  //     const delayDebounce = setTimeout(() => {
  //       getCodeData(currentPage, pageSize, sortValue, sortOrder, sortOrder);
  //     }, 2000);

  //     return () => clearTimeout(delayDebounce);
  //   }
  // }, [searchValue]);

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

export default CliamedList;
