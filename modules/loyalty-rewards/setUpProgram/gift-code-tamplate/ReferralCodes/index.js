import CustomAitTable from '@/components/molecules/custom-ait-table';
import { ExportOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getReferralCodeDataService } from '../../../api/giftCode';
import logger from '@/utils/logger';
import { checkValidData } from '@/utils/common.util';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';

function ReferralCodesPage({ activeTab }) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('id');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');

  const router = useRouter();

  const handleViewDetails = (id) => {
    window.open(`/loyalty-rewards/program/gift-code/${id}`, '_blank');
    // router.push(`/loyalty-rewards/gift-code/${id}`);
  };
  const coloms = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'customer-name',
      //width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'first_name',
      render: (cell, row) => (
        <div
          onClick={() => handleViewDetails(row?.customer_id)}
          style={{
            color: 'var(--ant-color-primary)',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {checkValidData(row?.full_name)}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      //  width: 320,
      sorter: true,
      sortValue: 'decoded_email',
      render: (cell, row) => checkValidData(row?.decoded_email),
    },
    {
      title: 'Discount Amount',
      dataIndex: 'email',
      key: 'email',
      width: 150,
      sorter: true,
      sortValue: 'discount_amount',
      render: (cell, row) => checkValidData(row?.discount_amount),
    },
    {
      title: 'Coupon Code',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      sorter: true,
      sortValue: 'lyt_cus_discount_code',
      render: (cell, row) => checkValidData(row?.lyt_cus_discount_code),
    },
    {
      title: 'Claimed Count',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      fixed: 'left',
      sorter: true,
      sortValue: 'triggerCount',
      render: (cell, row) => checkValidData(row?.triggerCount),
    },
    {
      title: 'Status',
      dataIndex: 'email',
      key: 'email',
      //  width: 320,
      sorter: true,
      sortValue: 'status',
      render: (cell, row) =>
        checkValidData(row?.status === '1' ? 'Active' : 'InActive'),
    },
    {
      title: 'Created date',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) =>
        checkValidData(moment(row?.date_created)?.format('DD/MM/YYYY')),
    },
  ];

  const getCodeData = async (
    page = currentPage,
    pageSize,
    filter = statusFilter,
    sortValue,
    sortOrder
  ) => {
    setTableLoading(true);
    try {
      setTableData([]);
      const payload = {
        act: 'get_refer_coupons_list',
        countSync: sortOrder ? '0' : '1',
        currentPage: page,
        filter_list: filter,
        messageFilter: 'all',
        limit: pageSize,
        order: sortOrder ? 1 : 0,
        totalRecords: '0',
        sort: 'tc.id',
      };

      if (sortValue !== 'id') {
        payload.order_by_col = sortValue;
      }

      const response = await getReferralCodeDataService(payload);

      if (response?.data?.status === 'success') {
        setTableData(response?.data?.data || []);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
    }
  };

  // useEffect(() => {
  //   getCodeData(currentPage, statusFilter);
  // }, [currentPage, statusFilter]);

  useEffect(() => {
    if (currentPage && activeTab === '3') {
      getCodeData(currentPage, pageSize, statusFilter, sortValue, sortOrder);
    }
  }, [currentPage, pageSize, statusFilter, sortValue, sortOrder, activeTab]);

  return (
    <CustomAitTable
      tableData={tableData}
      columns={coloms}
      //   buttons={buttons}
      switchBtn
      switchBtnValue={(e) => setStatusFilter(e)}
      loading={tableLoading}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      totalRecords={totalRecords}
      setPageSize={setPageSize}
      pageSize={pageSize}
      setSortValue={setSortValue}
      setSortOrder={(val) => setSortOrder(val === 'asc' ? true : false)}
      marginleft="-10px"
      marginright="-10px"
    />
  );
}

export default ReferralCodesPage;
