import CustomAitTable from '@/components/molecules/custom-ait-table';
import logger from '@/utils/logger';
import { ExportOutlined } from '@ant-design/icons';
import {
  exportRewardCodeDataService,
  getGiftCodeDataService,
} from '../../../api/giftCode';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { App } from 'antd';
import { checkValidData, nameFormatter } from '@/utils/common.util';

function GiftCodePage({ activeTab }) {
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  const [state, setState] = useState({
    tableLoading: false,
    data: [],
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('pc.used_at');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [callFirstTime, setCallFirstTime] = useState(true);
  const coloms = [
    {
      title: 'Customer name',
      dataIndex: 'customer_name',
      key: 'customer-name',
      //width: 320,
      fixed: 'left',
      sorter: true,
      sortValue: 'tc.first_names',
      render: (cell, row) => nameFormatter(row?.first_name, row?.last_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      //  width: 320,
      //  fixed: 'left',
      sortValue: 'tc.email',
      sorter: true,
      render: (cell, row) => checkValidData(row?.email),
    },
    {
      title: 'Code used',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      // fixed: 'left',
      sorter: true,
      sortValue: 'pc.purchase_code',
      render: (cell, row) => checkValidData(row?.purchase_code),
    },
    {
      title: 'Points gained',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'pc.points',
      render: (cell, row) => checkValidData(row?.points),
    },
    {
      title: 'Created at',
      dataIndex: 'email',
      key: 'email',
      //  width: 320,
      // fixed: 'left',
      sorter: true,
      sortValue: 'pc.created_at',
      render: (cell, row) => checkValidData(row?.created_at),
    },
    {
      title: 'Used at',
      dataIndex: 'email',
      key: 'email',
      //  width: 320,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'pc.used_at',
      render: (cell, row) => checkValidData(row?.used_at),
    },
  ];

  // const getGiftCodeData = async () => {
  //   setState({
  //     ...state,
  //     tableLoading: true,
  //   });
  //   try {
  //     let payload = {
  //       act: 'list_puchasecode',
  //       currentPage: 1,
  //       gridOrMap: 'grid',
  //       isFirstRequest: true,
  //       limit: 20,
  //       order: false,
  //       selectedOperatorType: 'and',
  //       selectedpeopleType: 'Customers',
  //       sort: 'pc.used_at',
  //     };
  //     const response = await getGiftCodeDataService(payload);
  //     console.log('response', response);

  //     if (response?.data?.status === 'success') {
  //       setTableData(response?.data?.data || []);
  //     }
  //   } catch (error) {
  //     logger(error?.response);
  //   } finally {
  //     setState({
  //       ...state,
  //       tableLoading: false,
  //     });
  //   }
  // };

  const getGiftCodeData = async (
    page = currentPage,
    pageSize,
    sortValue,
    sortOrder
  ) => {
    setTableData([]);
    setTableLoading(true);
    try {
      let payload = {
        act: 'list_puchasecode',
        currentPage: 1,
        gridOrMap: 'grid',
        isFirstRequest: callFirstTime,
        limit: pageSize,
        masterFilter: '[]',
        order: sortOrder,
        selectedOperatorType: 'and',
        selectedpeopleType: 'Customers',
        sort: sortValue,
      };

      console.log('payload', payload);

      // if (sortValue !== 'id') {
      //   payload.order_by_col = sortValue;
      // }

      const response = await getGiftCodeDataService(payload);

      if (response?.data?.status === 'success') {
        setTableData(response?.data?.rows || []);
        setCallFirstTime(false);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
    }
  };

  const exportRewardCodeData = async () => {
    setExportLoading(true);
    try {
      let payload = {
        action: 'exportreward',
        loginId: jwtState?.login_auth?.login_id,
        shopId: jwtState?.login_auth?.shop_id,
      };
      const response = await exportRewardCodeDataService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: `Your export result will be delivered by email to: ${jwtState?.login_auth?.email}`,
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
      title: 'Export reward code',
      icon: <ExportOutlined />,
      onClick: exportRewardCodeData,
      loading: exportLoading,
    },
  ];

  useEffect(() => {
    if (currentPage && activeTab === '1') {
      getGiftCodeData(currentPage, pageSize, sortValue, sortOrder);
    }
  }, [currentPage, pageSize, sortValue, sortOrder, activeTab]);

  return (
    <CustomAitTable
      tableData={tableData}
      columns={coloms}
      buttons={buttons}
      // switchBtn
      // switchBtnValue={(e) => setStatusFilter(e)}
      loading={tableLoading}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      totalRecords={totalRecords}
      setPageSize={setPageSize}
      pageSize={pageSize}
      setSortValue={setSortValue}
      setSortOrder={(val) => setSortOrder(val === 'asc' ? true : false)}
    />
  );
}

export default GiftCodePage;
