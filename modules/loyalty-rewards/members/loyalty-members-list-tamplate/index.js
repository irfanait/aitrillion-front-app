/* eslint-disable react-hooks/exhaustive-deps */
import CustomAitTable from '@/components/molecules/custom-ait-table';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '@/utils/logger';
import { checkValidCount, checkValidData } from '@/utils/common.util';
import moment from 'moment';
import { useRouter } from 'next/router';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import {
  getAllActivitiesDataService,
  getAllMembersDataService,
  getLoyaltyMemberDataService,
} from '../../api/members/loyaltyMember';
import { CloudUploadOutlined } from '@ant-design/icons';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { App, Select } from 'antd';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import { ExportMemberIcon } from '../../svg-icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { moduleRoute } from '@/modules/layouts/routeControl/route';

const { Option } = Select;

function LoyaltyMembersListTamplate() {
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('tc.date_created');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchValue, setSearchValue] = useState();
  const [activitiesData, setActivityData] = useState([]);
  const [activitiesLoading, setActivityLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState('');
  const [exportDataState, setExportDataState] = useState(false);
  const [selectListType, setSelectListType] = useState('allmembers');

  const handleViewDetails = (id) => {
    window.open(
      `${moduleRoute?.loyalty_rewards?.loyalty_members}/${id}`,
      '_blank'
    );
  };
  const coloms = [
    {
      title: 'Username',
      // dataIndex: 'username',
      // key: 'customer-name',
      // width: 320,
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
            textTransform: 'capitalize',
          }}
        >
          {checkValidData(row?.full_name)}
        </div>
      ),
    },
    {
      title: 'Email',
      // dataIndex: 'email',
      // key: 'email',
      // width: 320,
      // fixed: 'left',
      sorter: true,
      sortValue: 'decoded_email',
      render: (cell, row) => (
        <div
          onClick={() => handleViewDetails(row?.customer_id)}
          style={{
            color: 'var(--ant-color-primary)',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {checkValidData(row?.customer_email)}
        </div>
      ),
    },
    {
      title: 'Enrolled at',
      // dataIndex: 'email',
      // key: 'email',
      // width: 320,
      // fixed: 'left',
      sorter: true,
      sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.date_created),
    },
    {
      title: 'Total activities',
      // dataIndex: 'email',
      // key: 'email',
      width: 140,
      // fixed: 'left',
      sorter: true,
      sortValue: 'totalactivities',
      render: (cell, row) => checkValidData(row?.customer_activity),
    },
    {
      title: 'Lifitime points',
      // dataIndex: 'email',
      // key: 'email',
      width: 140,
      // fixed: 'left',
      sorter: true,
      sortValue: 'lyt_points_earned',
      render: (cell, row) => checkValidCount(row?.lyt_points_earned),
    },
    {
      title: 'Available points',
      // dataIndex: 'email',
      // key: 'email',
      width: 140,
      // fixed: 'left',
      sorter: false,
      // sortValue: 'status',
      render: (cell, row) => checkValidCount(row?.available_points),
    },
    {
      title: 'Points expiry date',
      // dataIndex: 'email',
      // key: 'email',
      width: 140,
      // fixed: 'left',
      sorter: false,
      // sortValue: 'date_created',
      render: (cell, row) => checkValidData(row?.point_expiry_date),
    },
  ];

  const getListData = async (
    page = currentPage,
    pageSize,
    filter = statusFilter
  ) => {
    setTableLoading(true);
    setTableData([]);
    try {
      const payload = {
        activityFilter: activityFilter,
        currentPage: page,
        dateFilter: '',
        filter: searchValue !== '' ? '1' : '',
        keyword: searchValue || '',
        lastdays: statusFilter,
        limit: pageSize,
        order: sortOrder,
        pointexpiryfrom: '',
        pointexpiryto: '',
        reset: filter === '' ? false : true,
        shop_email: jwtState?.login_auth?.email || '',
        sort: sortValue || 'tc.date_created',
        upcomingdays: '',
        messageFilter: 'all',
      };

      if (exportDataState) {
        payload.act = 'get_allmember_list';
        payload.exportActivities = true;
        payload.export_type = 'activity-customers';
      }

      const response =
        selectListType === 'allmembers'
          ? await getAllMembersDataService(payload)
          : await getLoyaltyMemberDataService(payload);

      if (response?.data?.status === 'success') {
        setTableData(response?.data?.data || []);
        setTotalRecords(response?.data?.totalrecord || 0);
        if (exportDataState) {
          notification.success({
            message: response?.data?.msg,
          });
          setExportDataState(false);
        }
      } else {
        setTableData([]);
        setTotalRecords(0);
        if (exportDataState) {
          notification.error({
            message: response?.data?.msg,
          });
          setExportDataState(false);
        }
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
    }
  };

  const getActivityData = async (
    filter = statusFilter,
    sortValue,
    searchValue
  ) => {
    setActivityLoading(true);
    try {
      const payload = {
        activityFilter: '',
        dateFilter: '',
        filter: '',
        // keyword: searchValue || '',
        lastdays: filter || '',
        pointexpiryfrom: '',
        pointexpiryto: '',
        reset: filter === '' ? false : true,
        currentPage: '1',
        limit: '20',
        order: false,
        sort: sortValue,
        shop_email: jwtState?.login_auth?.email || '',
        upcomingdays: '',
      };
      const response = await getAllActivitiesDataService(payload);
      if (response?.data?.status === 'success') {
        let arr = response?.data?.allActivities?.map((item) => {
          return {
            label: item?.rule_name || '',
            value: item?.id,
          };
        });

        arr.unshift({ value: '', label: 'All activities' });

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

  const filterItems = [
    { value: 'alltime', label: 'All time' },
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
        <AitSelectBox
          allowClear={false}
          showSearch={false}
          extraStyle={{ minWidth: 160 }}
          placeholder="Select member type"
          options={[
            {
              label: 'All members',
              value: 'allmembers',
            },
            {
              label: 'Loyalty members',
              value: 'loyaltyMembers',
            },
          ]}
          value={selectListType}
          onChange={(e) => {
            setSelectListType(e);
            setCurrentPage(1);
          }}
        />
      ),
    },
    {
      field: (
        <>
          <AitSelectBox
            allowClear={false}
            showSearch={false}
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
          allowClear={false}
          showSearch={false}
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
          //extraStyle={{ minwidth: '150px' }}
          block
          title="Reset"
          onClick={() => {
            setStatusFilter('');
            setActivityFilter('');
            setSearchValue();
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
      getListData(currentPage, pageSize, statusFilter, activityFilter);
    }
  }, [
    currentPage,
    pageSize,
    statusFilter,
    sortValue,
    sortOrder,
    activityFilter,
    selectListType,
  ]);

  useEffect(() => {
    if (searchValue?.length >= 3 || searchValue?.length === 0) {
      const delayDebounce = setTimeout(() => {
        getListData(currentPage, pageSize, statusFilter, searchValue);
      }, 2000);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchValue]);

  useEffect(() => {
    if (currentPage) {
      if (exportDataState === true) {
        getListData(currentPage, pageSize, statusFilter, sortValue, sortOrder);
      }
    }
  }, [
    currentPage,
    pageSize,
    statusFilter,
    sortValue,
    sortOrder,
    exportDataState,
  ]);

  return (
    <>
      <AitPageHeader
        buttonIcon={<ExportMemberIcon />}
        title=" Members list"
        subtitle="List of customers who have performed different activities and earned points using the loyalty program"
        // hideButton
        buttonLabel="Export members"
        onButtonClick={() => setExportDataState(true)}
      />

      <CustomAitTable
        search
        searchValue={searchValue}
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
        isCard
      />
    </>
  );
}

export default LoyaltyMembersListTamplate;
