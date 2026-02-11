import CustomAitTable from '@/components/molecules/custom-ait-table';
import { CloudUploadOutlined } from '@ant-design/icons';
import {
  getUploadGiftCodeDataService,
  uploadFileService,
} from '../../../api/giftCode';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { checkValidData, convertToFormDataCustom } from '@/utils/common.util';
import AWS from 'aws-sdk';
import logger from '@/utils/logger';
import { App } from 'antd';
import { identity } from 'lodash';

function UploadGiftCodes({ activeTab }) {
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('id');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchValue, setSearchValue] = useState();
  const fileInputRef = useRef(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const getCodeData = async (
    currentPage,
    pageSize,
    sortVal,
    sortOrder,
    searchValue
  ) => {
    setTableData([]);
    setTableLoading(true);
    try {
      let payload = {
        activityFilter: '',
        currentPage: currentPage,
        keyword: searchValue || '',
        // isFirstRequest: true,
        limit: pageSize,
        order: sortOrder,
        reset: searchValue ? true : false,
        shop_email: jwtState?.login_auth?.email,
        sort: sortVal,
      };

      if (searchValue) {
        payload.filter = 1;
      }

      const response = await getUploadGiftCodeDataService(payload);
      if (response?.data?.status === 'success') {
        setTableData(response?.data?.data);
        setTotalRecords(response?.data?.totalrecord);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
    }
  };

  const handleUploadFile = async (obj) => {
    setFileUploadLoading(true);
    try {
      let payload = convertToFormDataCustom(obj);
      const response = await uploadFileService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        getCodeData(currentPage, pageSize, sortValue, sortOrder);
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setFileUploadLoading(false);
    }
  };

  const uploadCsv = async (file) => {
    setFileUploadLoading(true);
    try {
      const s3Key = `lyt_purchasecode_uploaded_csv/csv-${Date.now()}.csv`;
      const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: process.env.NEXT_PUBLIC_APP_AWS_BUCKET },
      });

      const uploadToS3 = () =>
        new Promise((resolve, reject) => {
          try {
            s3.upload({
              Key: s3Key,
              Body: file,
              ACL: 'public-read',
            })
              .on('httpUploadProgress', (evt) => {
                const uploaded = parseInt((evt.loaded * 100) / evt.total);
                setProgress(uploaded);
              })
              .send((err, data) => {
                if (err) reject(err);
                else resolve(data);
              });
          } catch (error) {
            reject(error);
          }
        });

      const s3Response = await uploadToS3();

      if (!s3Response || !s3Response.Location) {
        throw new Error('S3 upload failed.');
      } else {
        const payload = {
          file_name: file.name,
          key: s3Key,
          selected_file_name: file.name,
        };

        handleUploadFile(payload);
      }
    } catch (err) {
      logger(err.message || 'Something went wrong during upload.');
    } finally {
      setFileUploadLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    event.target.value = null;
    if (!file) return;
    if (file?.type === 'text/csv') {
      uploadCsv(file);
    } else {
      notification.error({
        message: 'Please upload a valid CSV file',
      });
    }
  };
  const coloms = [
    {
      title: 'CSV',
      dataIndex: 'customer_name',
      key: 'customer-name',
      // width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'csv_url',
      render: (cell, row) => checkValidData(row?.csv_name),
    },
    {
      title: 'Status',
      dataIndex: 'email',
      key: 'email',
      // width: 320,
      sorter: true,
      sortValue: 'is_process',
      render: (cell, row) => checkValidData(row?.is_proccess),
    },
    {
      title: 'Message',
      dataIndex: 'email',
      key: 'email',
      //  width: 320,
      sorter: false,
      render: (cell, row) =>
        checkValidData(
          row?.is_error_process?.length > 0 ? row?.is_error_process[0] : ''
        ),
    },
    {
      title: 'Created date',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.date_created),
    },
    {
      title: 'Updated date',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      sorter: true,
      sortValue: 'date_updated',
      render: (cell, row) => checkValidData(row?.date_updated),
    },
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/point-purchase-code-csv.csv`;
    link.download = 'point-purchase-code-csv.csv'; // optional custom filename
    link.click();
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const buttons = [
    {
      title: 'Upload CSV',
      icon: <CloudUploadOutlined />,
      onClick: handleButtonClick,
      loading: fileUploadLoading,
      disabled: fileUploadLoading,
    },
    {
      title: 'View demo CSV',
      //   icon: <ExportOutlined />,
      onClick: handleDownload,
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
        getCodeData(currentPage, pageSize, sortValue, sortOrder, searchValue);
      }, 2000);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchValue]);

  useEffect(() => {
    AWS.config.update({
      region: process.env.NEXT_PUBLIC_APP_AWS_REGION,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityId: process.env.NEXT_PUBLIC_AWS_DATA_IDENTITY_ID,
      }),
    });
  }, []);

  return (
    <>
      <CustomAitTable
        tableData={tableData}
        columns={coloms}
        search
        onSearch={(e) => setSearchValue(e)}
        buttons={buttons}
        loading={tableLoading}
        totalRecords={totalRecords}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        setPageSize={setPageSize}
        pageSize={pageSize}
        setSortValue={setSortValue}
        setSortOrder={(val) => setSortOrder(val === 'asc' ? true : false)}
        searchPlaceholder="CSV"
      />
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

export default UploadGiftCodes;
