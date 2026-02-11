/* eslint-disable react-hooks/exhaustive-deps */
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import CustomAitTable from '@/components/molecules/custom-ait-table';
import logger from '@/utils/logger';
import { useEffect, useState } from 'react';
import { getRewardOrderService } from '../../api/rewardOrder';
import { checkValidData, nameFormatter } from '@/utils/common.util';
import { useSelector } from 'react-redux';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import OrderHistoryDetails from '../gift-code-tamplate/CustomerDetailsPage/orderHistoryModal';

function RewardOrdersPage() {
  const jwtState = useSelector((state) => state?.jwtState);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('to.created_at');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [orderHistoryModal, setOrderHistoryModal] = useState('');
  const coloms = [
    {
      title: 'Order no.',
      dataIndex: 'name',
      key: 'name',
      // width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'order_id',
      render: (cell, row) => (
        <div
          onClick={() => setOrderHistoryModal(row?.order_id)}
          style={{
            color: 'var(--ant-color-primary)',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {checkValidData(row?.name)}
        </div>
      ),
    },
    {
      title: 'Customer name',
      dataIndex: 'customer_name',
      key: 'customer-name',
      // width: 320,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'first_name',
      render: (cell, row) => nameFormatter(row?.first_name, row?.last_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // width: 320,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'decoded_email',
    },
    {
      title: 'Amount',
      dataIndex: 'total_price',
      key: 'total_price',
      //  width: 320,
      // fixed: 'left',
      sorter: true,
      sortValue: 'total_price',
    },
    {
      title: 'Order date',
      dataIndex: 'created_at',
      key: 'created_at',
      //   width: 320,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'created_at',
    },
  ];

  const getListData = async (currentPage, pageSize, sortVal, sortOrder) => {
    setTableData([]);
    setTableLoading(true);
    try {
      let payload = {
        act: 'list_rewardorder',
        currentPage: currentPage,
        keyword: '',
        messageFilter: 'all',
        limit: pageSize,
        order: sortOrder,
        reset: false,
        shop_email: jwtState?.login_auth?.email,
        sort: sortVal,
      };
      const response = await getRewardOrderService(payload);
      if (response?.status === 'success') {
        setTableData(response?.rows);
        setTotalRecords(response?.totalrecord);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage) {
      getListData(currentPage, pageSize, sortValue, sortOrder);
    }
  }, [currentPage, pageSize, sortValue, sortOrder]);

  return (
    <>
      <AitPageHeader
        title="Reward orders"
        subtitle="List of all orders placed by the customer using loyalty rewards"
        hideButton
      />
      <AitCard
        bodypadding={{
          xs: '10px 20px 10px 20px',
          sm: '10px 20px 10px 20px',
          md: '10px 24px 14px 24px',
        }}
      >
        <CustomAitTable
          tableData={tableData}
          columns={coloms}
          loading={tableLoading}
          totalRecords={totalRecords}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          setSortValue={setSortValue}
          setSortOrder={(val) => setSortOrder(val === 'asc' ? true : false)}
          verticalScrollHeight={420}
        />
      </AitCard>

      <AitModal
        maskClosable={false}
        open={orderHistoryModal}
        title="Order details"
        handleModalClose={() => {
          setOrderHistoryModal('');
        }}
        footer={null}
        centered
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
        destroyOnHidden
      >
        <OrderHistoryDetails orderHistoryModal={orderHistoryModal} />
      </AitModal>
    </>
  );
}

export default RewardOrdersPage;
