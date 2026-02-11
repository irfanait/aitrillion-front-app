/* eslint-disable react-hooks/exhaustive-deps */
import CustomAitTable from '@/components/molecules/custom-ait-table';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '@/utils/logger';
import { checkValidData } from '@/utils/common.util';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { App, Tag, Typography } from 'antd';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import { ExportMemberIcon } from '../../svg-icons';
import {
  checkExportReportPendingService,
  getActivityListDataService,
  getAllActivityService,
} from '../../api/analytics';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import CredtiBalanceForm from './creditBalanceForm';
import AitLink from '@/components/atoms/ait-link/aitLink';

const { Paragraph } = Typography;

function ActivityReportListTamplate() {
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('times');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchValue, setSearchValue] = useState();
  const [activitiesData, setActivityData] = useState([]);
  const [activitiesLoading, setActivityLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState('');
  const [exportActivity, setExportActivity] = useState(false);
  const [creditBalanceModal, setCreditBalanceModal] = useState(false);
  const [creditModalLoading, setCreditModalLoading] = useState(false);

  const handleViewDetails = (id) => {
    window.open(`/loyalty-rewards/activity-report/${id}`, '_blank');
    // router.push(`/loyalty-rewards/gift-code/${id}`);
  };
  const coloms = [
    {
      title: 'Member',
      dataIndex: 'username',
      key: 'member',
      width: 160,
      fixed: 'left',
      sorter: true,
      sortValue: 'first_name',
      render: (cell, row) => (
        // <div
        //   onClick={() => handleViewDetails(row?.id || '')}
        //   style={{
        //     color: 'var(--ant-color-primary)',
        //     fontWeight: '500',
        //     cursor: 'pointer',
        //   }}
        // >
        //   {checkValidData(parse(row?.full_name || ''))}
        // </div>
        <AitLink
          style={{ textTransform: 'capitalize' }}
          size={13}
          weight={500}
          // color="priamry"
          href={`/loyalty-rewards/analytics/activity-report/${row?.id}`}
          target="_blank"
        >
          {checkValidData(row?.full_name || '')}
        </AitLink>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'decoded_email',
      render: (cell, row) => (
        <>
          <AitLink
            size={13}
            weight={500}
            // color="priamry"
            href={`/loyalty-rewards/analytics/activity-report/${row?.id}`}
            target="_blank"
          >
            {checkValidData(row?.decoded_email || '')}
          </AitLink>
        </>
      ),
    },
    {
      title: 'Activity',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'activitytype',
      render: (cell, row) => checkValidData(row?.activitytype),
    },
    {
      title: 'Status',
      dataIndex: 'email',
      key: 'email',
      width: 140,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'activitystatus',
      render: (cell, row) => {
        const statusColor = {
          completed: 'green',
          claimed: 'gold', // background color
          in_progress: 'lime',
          approved: 'blue',
          incomplete: 'red',
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
        //  console.log('row?.activitystatus', row?.activitystatus);
        if (row?.activitystatus === 'In progress') {
          return (
            <Tag
              color={statusColor['in_progress'] || 'gold'}
              style={customStyles}
              variant="filled"
            >
              {checkValidData(row?.activitystatus?.toUpperCase())}
            </Tag>
          );
        } else {
          return (
            <Tag
              color={
                statusColor[row?.activitystatus?.toLowerCase()] || 'default'
              }
              style={customStyles}
              variant="filled"
            >
              {checkValidData(row?.activitystatus?.toUpperCase())}
            </Tag>
          );
        }
      },
    },
    {
      title: 'Points',
      dataIndex: 'email',
      key: 'email',
      width: 100,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'points',
      render: (cell, row) => checkValidData(row?.points),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      // fixed: 'left',
      sorter: true,
      sortValue: 'points',
      render: (cell, row) => checkValidData(row?.referal_discount_show),
    },
    {
      title: 'Created date',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      //  fixed: 'left',
      sorter: true,
      sortValue: 'activity_date',
      render: (cell, row) => checkValidData(row?.activity_date),
    },
  ];

  const getActivityData = async () => {
    setActivityLoading(true);
    try {
      const payload = {
        act: 'get_allmember_list',
        activityFilter: '',
        currentPage: '1',
        keyword: '',
        lastdays: '',
        limit: '20',
        messageFilter: 'all',
        order: false,
        reset: false,
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
        sort: 'times',
      };
      const response = await getAllActivityService(payload);
      if (response?.data?.status === 'success') {
        let arr = response?.data?.allActivities?.map((item) => {
          return {
            label: item?.rule_name || '',
            value: item?.id,
          };
        });

        arr.unshift({
          label: 'All activity',
          value: '',
        });

        setActivityData(arr);
      } else {
        setActivityData([]);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setActivityLoading(false);
    }
  };

  const getListData = async (page = currentPage, pageSize) => {
    setTableLoading(true);
    setTableData([]);
    try {
      const payload = {
        act: 'get_allmember_list',
        activityFilter: activityFilter || '',
        currentPage: page,
        keyword: searchValue || '',
        messageFilter: 'all',
        limit: pageSize,
        order: sortOrder,
        sort: sortValue,
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
        lastdays: '',
      };

      payload.lastdays = statusFilter;

      if (searchValue !== '' && searchValue !== undefined) {
        payload.filter = 1;
        payload.reset = true;
      } else {
        payload.filter = 0;
        payload.reset = false;
      }
      if (exportActivity) {
        payload.exportActivities = true;
      }

      const response = await getActivityListDataService(payload);
      if (response?.data?.status === 'success') {
        setTableData(response?.data?.data || []);
        setTotalRecords(response?.data?.totalrecord);

        if (exportActivity) {
          notification.success({
            message: response?.data?.msg,
          });
        }
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
      setExportActivity(false);
    }
  };

  const checkExportMonthlyCreditBalance = async () => {
    setCreditModalLoading(true);
    try {
      const payload = {
        act: 'get_allmember_list',
        activityFilter: '',
        currentPage: '1',
        keyword: '',
        lastdays: '',
        limit: '20',
        messageFilter: 'all',
        order: false,
        reset: false,
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
        sort: 'times',
      };
      const response = await checkExportReportPendingService(payload);

      if (response?.data?.status === 'success') {
        setCreditBalanceModal(true);
      } else {
        notification.error({
          message: response?.data?.msg,
        });
        setCreditModalLoading(false);
      }
    } catch (error) {
      notification.error({
        message: error?.response?.data?.msg,
      });
      logger(error?.response);
    } finally {
      setCreditModalLoading(false);
    }
  };

  const filterItems = [
    { value: '', label: 'All Time' },
    { value: '7', label: 'Past 7 days' },
    { value: '30', label: 'Past 30 days' },
    { value: '60', label: 'Past 60 days' },
    { value: '90', label: 'Past 90 days' },
    { value: '180', label: 'Past 180 days' },
    { value: '365', label: 'Past 365 days' },
  ];

  let buttons = [
    {
      field: (
        <>
          <AitSelectBox
            extraStyle={{ minWidth: 180 }}
            placeholder="Filter by enrollment date"
            options={filterItems}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e)}
          />
        </>
      ),
    },
    {
      field: (
        <AitSelectBox
          loading={activitiesLoading}
          disabled={activitiesLoading}
          extraStyle={{ minWidth: 160 }}
          placeholder="All activities"
          options={activitiesData}
          value={activityFilter}
          onChange={(e) => setActivityFilter(e)}
        />
      ),
    },
  ];

  if (statusFilter !== '' || activityFilter !== '') {
    const obj = {
      field: (
        <AitButton
          extraStyle={{ width: '100%' }}
          title="Reset"
          onClick={() => {
            setStatusFilter('');
            setActivityFilter('');
          }}
          style={{ color: 'var(--ant-color-primary' }}
        />
      ),
    };

    buttons = [...buttons, obj];
  }

  useEffect(() => {
    getActivityData();
  }, []);

  useEffect(() => {
    if (currentPage) {
      getListData(currentPage, pageSize, statusFilter, sortValue, sortOrder);
    }
  }, [
    currentPage,
    pageSize,
    statusFilter,
    sortValue,
    sortOrder,
    activityFilter,
  ]);

  useEffect(() => {
    if (searchValue?.length >= 3 || searchValue?.length === 0) {
      const delayDebounce = setTimeout(() => {
        getListData(currentPage, pageSize, sortValue, sortOrder, sortOrder);
      }, 2000);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchValue]);

  useEffect(() => {
    if (exportActivity) {
      getListData(currentPage, pageSize, sortValue, sortOrder, sortOrder);
    }
  }, [exportActivity]);

  const extraBtnArr = [
    {
      btn: (
        <AitButton
          title="Export monthly credit balance"
          type="primary"
          icon={<ExportMemberIcon />}
          onClick={() => {
            checkExportMonthlyCreditBalance();
          }}
          disabled={creditModalLoading}
          loading={creditModalLoading}
        />
      ),
    },
  ];

  return (
    <>
      <AitPageHeader
        buttonIcon={<ExportMemberIcon />}
        title="Activity report"
        subtitle="List of activities done by customers."
        // hideButton
        buttonLabel="Export members"
        extraBtnArr={extraBtnArr}
        btnLoading={exportActivity}
        disabled={exportActivity}
        onButtonClick={() => {
          setExportActivity(true);
        }}
      />

      <CustomAitTable
        isCard
        search
        onSearch={(e) => setSearchValue(e)}
        searchPlaceholder="name , email"
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
        verticalScrollHeight={'46vh'}
      />

      <AitModal
        maskClosable={false}
        open={creditBalanceModal}
        title="Export monthly credit balance"
        handleModalClose={() => setCreditBalanceModal(false)}
        footer={null}
        centered
        destroyOnHidden
      >
        <div style={{ marginTop: '10px' }}>
          <Paragraph type="secondary" style={{ lineHeight: '18px' }}>
            Select the month and enter your email address to receive the credit
            balance sheet on your email as soon as it is ready.
          </Paragraph>
          <CredtiBalanceForm
            setCreditBalanceModal={setCreditBalanceModal}
            getListData={getListData}
          />
        </div>
      </AitModal>
    </>
  );
}

export default ActivityReportListTamplate;
