import { useEffect, useMemo, useState } from 'react';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import CliamedList from './claimedList';
import UsedList from './usedList';
import POSList from './posList';
import { getClaimedListDataService } from '../../api/analytics';
import logger from '@/utils/logger';
import { useSelector } from 'react-redux';
import BirthdayDiscountCodes from './birthday';
import { useSearchParams } from 'next/navigation';
import { navigateWithParam } from '@/utils/common.util';
import { useRouter } from 'next/router';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';

function DiscountCodesListTamplate() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jwtState = useSelector((state) => state?.jwtState);
  const [activeTab, setActiveTab] = useState('1');
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [pageSize, setPageSize] = useState(20);
  const [sortValue, setSortValue] = useState('r.date_created');
  const [sortOrder, setSortOrder] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchValue, setSearchValue] = useState();
  const [apiData, setAPIState] = useState();
  const searchQuery = Object.fromEntries(
    searchParams ? searchParams.entries() : {}
  );

  let newParams = {
    ...Object.fromEntries(searchParams.entries()),
    page: '1',
  };

  const getCodeData = async () => {
    setTableLoading(true);
    setTableData([]);
    try {
      const payload = {
        act: 'get_allmember_list',
        coupan_type: '1',
        currentPage: searchQuery?.page || 1,
        keyword: searchValue || '',
        messageFilter: 'all',
        limit: parseFloat(searchQuery?.pageSize) || 20,
        order: searchQuery?.order || false,
        sort: searchQuery?.sortVal || 'r.date_created',
        reward_discount_id: 0,
        reward_type: 0,
        shop_email: jwtState?.login_auth?.email || '',
        shop_id: jwtState?.login_auth?.shop_id || '',
      };

      if (searchValue !== '') {
        payload.filter = 1;
        payload.reset = true;
      } else {
        payload.reset = false;
      }
      const response = await getClaimedListDataService(payload);
      if (response?.data?.status === 'success') {
        setTableData(response?.data?.data || []);
        setTotalRecords(response?.data?.totalrecord);
        setAPIState(response?.data);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setTableLoading(false);
    }
  };

  // useEffect(() => {
  //   if (activeTab === '1') {
  //     getCodeData(currentPage, pageSize, statusFilter, sortValue, sortOrder);
  //   }
  // }, [currentPage, pageSize, statusFilter, sortValue, sortOrder, activeTab]);

  // useEffect(() => {
  //   if (searchValue?.length >= 3 || searchValue?.length === 0) {
  //     const delayDebounce = setTimeout(() => {
  //       setTableData([]);
  //       setTableLoading(true);
  //       getCodeData(currentPage, pageSize, sortValue, sortOrder, sortOrder);
  //     }, 700);

  //     return () => clearTimeout(delayDebounce);
  //   }
  // }, [searchValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue.length >= 3 || searchValue.length === 0) {
        navigateWithParam(newParams, router, router?.route);
        getCodeData(currentPage, pageSize, sortValue, sortOrder, sortOrder);
      }
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const searchData = useMemo(() => {
    return Object.fromEntries(searchParams ? searchParams.entries() : []);
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchQuery)?.length && activeTab === '1') {
      getCodeData();
    }
  }, [searchData]);

  useEffect(() => {
    if (
      Object.keys(searchQuery)?.length === 0 &&
      !searchValue &&
      activeTab === '1'
    ) {
      getCodeData();
    }
  }, [activeTab]);

  return (
    <>
      <AitPageHeader
        title="Discount codes"
        subtitle="Detailed report of discount codes generated."
        hideButton
      />
      <AitCard
        hascustomheader={true}
        custombodypadding={{ md: '12px 24px 10px 24px' }}
        hastabs={true}
        customheaderleft={
          <AitTabs
            hascustomheader={true}
            hascardheaderrightsection={true}
            activeKey={activeTab}
            defaultActiveKey="1"
            onChange={(e) => {
              setTotalRecords(0);
              setSearchValue();
              setActiveTab(e);
              if (newParams !== '{}') {
                router.replace(router.pathname, undefined, { shallow: true });
              }
            }}
            items={[
              { label: 'Claimed', key: '1' },
              { label: 'Used', key: '2' },
              // { label: 'POS', key: '3' },
              {
                ...(parseFloat(apiData?.show_birthday_coupon_list) > 1 && {
                  label: 'Birthday discount codes',
                  key: '4',
                }),
              },
            ]}
          />
        }
      >
        {activeTab === '1' && (
          <CliamedList
            activeTab={activeTab}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            totalRecords={totalRecords}
            sortOrder={sortOrder}
            tableLoading={tableLoading}
            tableData={tableData}
            currentPage={searchParams?.page || 1}
            pageSize={searchParams?.pageSize || 20}
            sortValue={sortValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setSortOrder={setSortOrder}
            setSortValue={setSortValue}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
            getCodeData={getCodeData}
          />
        )}

        {activeTab === '2' && <UsedList activeTab={activeTab} />}

        {/* {activeTab === '3' && <POSList activeTab={activeTab} />} */}

        {parseFloat(apiData?.show_birthday_coupon_list) > 1 &&
          activeTab === '4' && <BirthdayDiscountCodes activeTab={activeTab} />}
      </AitCard>
    </>
  );
}

export default DiscountCodesListTamplate;
