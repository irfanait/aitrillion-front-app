/* eslint-disable react-hooks/exhaustive-deps */
import CustomAitTable from '@/components/molecules/custom-ait-table';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '@/utils/logger';
import {
  checkValidData,
  convertToFormDataCustom,
  textFormatter,
} from '@/utils/common.util';
import moment from 'moment';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { getLoyaltyMemberDataService } from '../../api/members/loyaltyMember';
import { ArrowDownOutlined, CloudUploadOutlined } from '@ant-design/icons';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { App, Select } from 'antd';
import {
  getImportMemberDataService,
  getNewMemberService,
  uploadCSVService,
  uploadloyaltyRemoteCSVService,
} from '../../api/members/importMember';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import parse from 'html-react-parser';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';

const { Option } = Select;

function ImportMembersListTamplate() {
  const jwtState = useSelector((state) => state?.jwtState);
  const fileInputRef = useRef(null);
  const { notification } = App.useApp();
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('id');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewListModal, setViewListModal] = useState(false);
  const [viewListData, setViewListData] = useState();
  const [modalLoading, setModalLoading] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href =
      jwtState?.login_auth?.shop_type === 'shopify'
        ? `${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/demo-loyalty-csv-23-24.csv`
        : `${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/demo-loyalty-csv-2023.csv`;
    link.download =
      jwtState?.login_auth?.shop_type === 'shopify'
        ? 'demo-loyalty-csv-23-24.csv'
        : 'demo-loyalty-csv-2023.csv';
    link.click();
  };

  const handleViewDetails = async (data) => {
    setViewListModal(true);
    setModalLoading(true);
    try {
      let payload = {
        id: data,
      };
      const response = await getNewMemberService(payload);
      if (response?.data?.status === 'success') {
        setViewListData(response?.data?.data);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setModalLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const getListData = async (
    page = currentPage,
    pageSize,
    sortValue,
    sortOrder
  ) => {
    setTableData([]);
    setTableLoading(true);
    try {
      const payload = {
        activityFilter: '',
        currentPage: page,
        filter: '1',
        keyword: searchValue,
        limit: pageSize,
        order: sortOrder,
        reset: searchValue ? true : false,
        shop_email: jwtState?.login_auth?.email || '',
        sort: sortValue,
      };
      const response = await getImportMemberDataService(payload);
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

  const handleFileChange = async (event) => {
    setFileUploadLoading(true);
    try {
      const file = event.target.files[0];
      if (file?.type === 'text/csv') {
        event.target.value = null;
        let payload = convertToFormDataCustom({ members_csv: file });
        const response = await uploadCSVService(payload);
        if (response?.data?.status === 'success') {
          let obj = convertToFormDataCustom({
            csv_import_id: response?.data?.csv_import_id,
            is_billing_process: '1',
          });
          const res = await uploadloyaltyRemoteCSVService(obj);
          if (res?.data?.status === 'success') {
            notification.success({
              message: res?.data?.msg,
            });
            getListData(currentPage, pageSize, sortValue, sortOrder);
          } else {
            notification.error({
              message: response?.data?.msg,
            });
          }
        } else {
          notification.error({
            message: response?.data?.msg,
          });
        }
      } else {
        notification.error({
          message: 'Please upload a valid CSV file',
        });
        return;
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setFileUploadLoading(false);
    }
  };

  const coloms = [
    {
      title: 'File name',
      dataIndex: 'csv_name',
      key: 'csv_name',
      width: 320,
      // fixed: 'left',
      sorter: true,
      sortValue: 'csv_url',

      render: (cell, row) => checkValidData(row?.csv_name),
    },
    {
      title: 'Status',
      dataIndex: 'email',
      key: 'email',
      width: 120,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'is_process',
      render: (cell, row) =>
        textFormatter(row?.is_proccess) === 'Pending' ? (
          <span style={{ background: '#FFF5DA', padding: '4px 6px' }}>
            {' '}
            {checkValidData(row?.is_proccess)}
          </span>
        ) : (
          <span style={{ background: '#D9FFE7', padding: '4px 6px' }}>
            {' '}
            {checkValidData(row?.is_proccess)}
          </span>
        ),
    },
    {
      title: 'Error',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'is_error_process',
      render: (cell, row) => checkValidData(row?.is_error_process),
    },
    {
      title: 'New members',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      //  fixed: 'left',
      sorter: false,
      // sortValue: 'lyt_cus_discount_code',
      render: (cell, row) =>
        // console.log(
        //   'TESTTT----',
        //   row?.new_customers_json !== null
        //     ? JSON?.parse(row?.new_customers_json)
        //     : ''
        // ),

        row?.new_customers_json !== null ? (
          // JSON?.parse(row?.new_customers_json || ' []')?.length > 0 ? (
          <div
            onClick={() => handleViewDetails(row?.id)}
            style={{
              color: 'var(--ant-color-primary)',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            View list
          </div>
        ) : (
          // ) : (
          //   '-'
          // )
          '-'
        ),
    },
    {
      title: 'Created date',
      dataIndex: 'email',
      key: 'email',
      ///  width: 320,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.date_created),
    },
    {
      title: '	Updated date',
      dataIndex: 'email',
      key: 'email',
      // width: 320,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'date_updated',
      render: (cell, row) => checkValidData(row?.date_updated),
    },
  ];

  const buttons = [
    {
      title: 'Download sample CSV',
      icon: <ArrowDownOutlined />,
      onClick: handleDownload,
    },
    {
      title: 'Upload CSV',
      icon: <CloudUploadOutlined />,
      onClick: handleButtonClick,
      loading: fileUploadLoading,
      disabled: fileUploadLoading,
    },
  ];

  useEffect(() => {
    if (currentPage) {
      getListData(currentPage, pageSize, sortValue, sortOrder);
    }
  }, [currentPage, pageSize, sortValue, sortOrder]);

  useEffect(() => {
    if (searchValue?.length >= 3 || searchValue?.length === 0) {
      const delayDebounce = setTimeout(() => {
        getListData(currentPage, pageSize, sortValue, sortOrder, searchValue);
      }, 2000);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchValue]);

  return (
    <>
      <AitPageHeader
        title="Import member's points"
        subtitle="Update the existing customer's Birthday, Points etc."
        hideButton
      />

      <CustomAitTable
        isCard
        search
        onSearch={(e) => setSearchValue(e)}
        searchPlaceholder="File name"
        tableData={tableData}
        columns={coloms}
        buttons={buttons}
        loading={tableLoading}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalRecords={totalRecords}
        setPageSize={setPageSize}
        pageSize={pageSize}
        setSortValue={setSortValue}
        setSortOrder={(val) => setSortOrder(val === 'asc' ? true : false)}
      />

      <AitModal
        maskClosable={false}
        open={viewListModal}
        title="New members"
        handleModalClose={() => {
          setViewListData();
          setViewListModal(false);
        }}
        footer={null}
        centered
        width={'450px'}
        destroyOnHidden
      >
        <FullPageLoader loading={modalLoading} padding>
          <spnn style={{ overflow: 'auto', padding: 55 }}>
            {' '}
            {parse(checkValidData(viewListData) || '')}
          </spnn>
        </FullPageLoader>
      </AitModal>

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
}

export default ImportMembersListTamplate;
