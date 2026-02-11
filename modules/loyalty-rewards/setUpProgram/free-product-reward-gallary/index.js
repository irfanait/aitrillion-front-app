/* eslint-disable @next/next/no-img-element */
import AitCard from '@/components/atoms/ait-card/aitCard';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import CustomAitTable from '@/components/molecules/custom-ait-table';
import { checkValidData, convertToFormDataCustom } from '@/utils/common.util';
import { useEffect, useState } from 'react';
import AddEditPrpductGallary from './addEditProductGallary';
import logger from '@/utils/logger';
import { useSelector } from 'react-redux';
import {
  deleteProductRewardService,
  getListDataService,
} from '../../api/freeProductRewardGallary';
import { App, Flex, Space } from 'antd';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';

function FreeProductRewardGallaryTamplate() {
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  const [modalState, setModalState] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('date_created');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [editProductModal, setEditProductModal] = useState(false);
  const [rowData, setRowData] = useState();
  const [visible, setVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const coloms = [
    {
      title: 'Reward image',
      dataIndex: 'customer_name',
      key: 'customer-name',
      width: 130,
      // fixed: 'left',
      //   sorter: true,
      render: (call, row) => (
        <img
          src={row?.reward_image}
          alt=""
          style={{ width: 100, height: 100 }}
        />
      ),
    },
    {
      title: 'Reward name',
      dataIndex: 'customer_name',
      key: 'customer-name',
      //width: 320,
      // fixed: 'left',
      //   sorter: true,
      sorter: (a, b) => a.age - b.age,
      render: (cell, row) =>
        checkValidData(
          row?.product_title ? `Free : ${row?.product_title}` : '-'
        ),
    },
    {
      title: 'Points to claim',
      dataIndex: 'email',
      key: 'email',
      //  width: 320,
      //  fixed: 'left',
      //   sorter: true,
      render: (call, row) => checkValidData(row?.points_to_claim),
    },
    {
      title: 'Action',
      dataIndex: 'email',
      key: 'email',
      width: 100,
      fixed: 'right',
      //   sorter: true,
      render(cell, row) {
        return (
          <Flex>
            <Space size={16}>
              <img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/edit_icon.svg`}
                alt="edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setEditProductModal(true);
                  setRowData(row);
                }}
              />
              <img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/delete_icon.svg`}
                alt="edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setVisible(true);
                  setRowData(row);
                }}
              />
            </Space>
          </Flex>
        );
      },
    },
  ];

  const getListData = async (currentPage, pageSize, sortVal, sortOrder) => {
    setTableData([]);
    setTableLoading(true);
    try {
      let payload = {
        act: 'list_freeproductreward',
        currentPage: currentPage,
        keyword: '',
        messageFilter: 'all',
        limit: pageSize,
        order: sortOrder,
        reset: false,
        shop_email: jwtState?.login_auth?.email,
        sort: sortVal,
      };

      const response = await getListDataService(payload);

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

  const handleDelete = async () => {
    setDeleteLoading(true);
    let obj = {};
    obj.id = rowData?.id;
    obj.reward_id = '4';
    const formData = convertToFormDataCustom(obj);
    try {
      const response = await deleteProductRewardService(formData);
      if (response?.status === 'success') {
        notification.success({
          message: 'Reward has been deleted successfully!',
        });
        setVisible(false);
        setRowData();
        getListData(currentPage, pageSize, sortValue, sortOrder);
      }
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setDeleteLoading(false);
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
        title="Free product reward gallery"
        subtitle="Create a free product reward for your customers that can be bought only using points."
        // hideButton
        buttonLabel="Create"
        onButtonClick={() => setModalState(true)}
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
          verticalScrollHeight={450}
        />
      </AitCard>

      <AitModal
        maskClosable={false}
        open={modalState || editProductModal}
        title="Create free product rule"
        handleModalClose={() => {
          setModalState(false);
          setEditProductModal(false);
          setRowData();
        }}
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
        <AddEditPrpductGallary
          setModalState={setModalState}
          getListData={getListData}
          editProductModal={editProductModal}
          setEditProductModal={setEditProductModal}
          setRowData={setRowData}
          rowData={rowData}
        />
      </AitModal>

      <AitConfirmationModal
        visible={visible}
        setVisible={setVisible}
        message="Are you sure"
        confirmText="Yes, delete it!"
        description="You want to delete?"
        onConfirm={() => {
          handleDelete();
        }}
        confirmButtonLoading={deleteLoading}
      />
    </>
  );
}

export default FreeProductRewardGallaryTamplate;
