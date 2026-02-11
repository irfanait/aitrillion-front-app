import React, { useEffect, useRef, useState } from 'react';
import { LayoutContainer } from '../coupons-list-template/style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { Col, Row, Typography } from 'antd';
import { SearchInputWrapper } from '@/modules/customers/templates/segment-list-template/style';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { SearchOutlined } from '@ant-design/icons';
import { StyledTag } from '@/components/molecules/ait-page-header/style';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import CouponCustomerListTable from '../../organisms/coupon-customer-list-table/couponCustomerListTable';
import {
  getCouponCustomerList,
  getReatTimeCouponCodes,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import {
  clearCouponCustomerList,
  setCouponCustomerListFilter,
} from '@/redux/email-marketing-slices/couponsSlice/coupon-slice';
import AitButton from '@/components/atoms/ait-button/aitButton';

const { Title } = Typography;

const CouponCustomersListTemplate = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { discount_code_id } = router.query;

  const { login_auth } = useSelector((state) => state.jwtState);
  const {
    getReatTimeCouponCodesApiState,
    getReatTimeCouponCodesList,
    getCouponCustomerListFilter,
  } = useSelector((state) => state.emailMarketingCouponState);

  const initialized = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  // ✅ Fetch discount codes once
  useEffect(() => {
    dispatch(getReatTimeCouponCodes());
  }, [dispatch]);

  // ✅ Format coupon list for dropdown
  const realTimeDiscountCodeList =
    getReatTimeCouponCodesApiState === 'success'
      ? [
          { label: 'All', value: 'all' },
          ...(getReatTimeCouponCodesList?.map((item) => ({
            label: item?.coupon_code,
            value: String(item?.id),
          })) || []),
        ]
      : [];

  // ✅ Initialize on first load (only when shop_name is ready)
  useEffect(() => {
    if (!router.isReady || !login_auth?.shop_name || initialized.current)
      return;

    const initialFilter = {
      ...getCouponCustomerListFilter,
      discount_code_id: discount_code_id || '',
      shop_name: login_auth.shop_name,
      currentPage: 1,
    };
    setInitialLoading(true);
    dispatch(setCouponCustomerListFilter(initialFilter));
    dispatch(getCouponCustomerList(initialFilter)).finally(() =>
      setInitialLoading(false)
    );

    initialized.current = true;
  }, [router.isReady, login_auth?.shop_name, discount_code_id]);

  // ✅ Single function to handle all filter changes
  const handleFilterChange = (changes) => {
    const updated = {
      ...getCouponCustomerListFilter,
      ...changes,
      currentPage: 1,
    };
    dispatch(setCouponCustomerListFilter(updated));
    dispatch(getCouponCustomerList(updated));
  };

  // ✅ Reset filters
  const handleReset = () => {
    setSearchTerm('');
    const resetFilter = {
      act: 'get_coupon_customer_list',
      countSync: 1,
      currentPage: 1,
      day_filter: 0,
      discount_code_id: getCouponCustomerListFilter?.discount_code_id || '',
      keyword: '',
      limit: 10,
      order: 0,
      shop_name: login_auth?.shop_name || '',
      sort: 'cc.created_date',
      totalRecords: 0,
      type: '',
    };
    dispatch(setCouponCustomerListFilter(resetFilter));
    // Directly call API, then let reducer update the state via fulfilled action
    dispatch(clearCouponCustomerList()); // <-- custom reducer to set [] safely

    // Fetch new list only if needed
    if (discount_code_id && login_auth?.shop_name) {
      dispatch(getCouponCustomerList(resetFilter));
    }
  };

  // ✅ Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length >= 3) {
        dispatch(
          getCouponCustomerList({
            ...getCouponCustomerListFilter,
            keyword: searchTerm,
            totalRecords: 0,
          })
        );
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  // ✅ Table pagination / sorting
  const handleTableChange = (pagination, filters, sorter) => {
    const newFilter = {
      ...getCouponCustomerListFilter,
      currentPage: pagination.current,
      limit: pagination.pageSize,
      sort: sorter.field
        ? `cc.${sorter.field}`
        : getCouponCustomerListFilter.sort,
      order: sorter.order === 'ascend' ? 1 : 0,
    };

    dispatch(setCouponCustomerListFilter(newFilter));
    dispatch(getCouponCustomerList(newFilter));
  };

  return (
    <LayoutContainer>
      <MainWrapper>
        <AitPageHeader hideButton title="Customer Coupons" />
        <AitCard
          hascustomheader
          hastabs
          custombodypadding="12px 24px 24px 24px"
          customheaderleft={
            <Row gutter={[20, 20]}>
              <Col>
                <SearchInputWrapper>
                  <Title type="primary" level={4}>
                    Total customers
                  </Title>
                  <StyledTag color="blue">
                    {getCouponCustomerListFilter?.totalRecords || 0}
                  </StyledTag>
                </SearchInputWrapper>
              </Col>
            </Row>
          }
          customheaderright={
            <Row gutter={[20, 20]}>
              <Col>
                <SearchInputWrapper>
                  <AitSelectBox
                    placeholder="Filter by discount code"
                    value={getCouponCustomerListFilter.discount_code_id || ''}
                    onChange={(value) =>
                      handleFilterChange({ discount_code_id: value })
                    }
                    options={realTimeDiscountCodeList}
                    style={{ width: 200 }}
                  />
                  <AitSelectBox
                    placeholder="Filter by type"
                    value={getCouponCustomerListFilter.type || ''}
                    onChange={(value) =>
                      handleFilterChange({
                        type: value === 'all' ? '' : value,
                        totalRecords: 0,
                        // day_filter: 0,
                      })
                    }
                    options={[
                      { value: 'all', label: 'All' },
                      { value: 'workflow', label: 'Workflow' },
                      { value: 'campaign', label: 'Campaign' },
                    ]}
                    style={{ width: 180 }}
                  />
                  <AitSelectBox
                    placeholder="Filter by created date"
                    value={getCouponCustomerListFilter.day_filter || ''}
                    onChange={(value) =>
                      handleFilterChange({
                        day_filter: value === 'all' ? '' : value,
                        totalRecords: 0,
                      })
                    }
                    options={[
                      { value: 'all', label: 'All time' },
                      { value: '7', label: 'Past 7 days' },
                      { value: '30', label: 'Past 30 days' },
                      { value: '60', label: 'Past 60 days' },
                      { value: '180', label: 'Past 180 days' },
                      { value: '360', label: 'Past 360 days' },
                    ]}
                    style={{ width: 180 }}
                  />
                  <AitInputBox
                    placeholder="Search by name or email"
                    suffix={
                      <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    }
                    style={{ height: 40, width: 250 }}
                    value={searchTerm || ''}
                    onChange={(e) => handleSearch(e)}
                  />
                  {searchTerm?.length > 0 && (
                    <AitButton
                      title="Reset"
                      style={{ height: 40 }}
                      onClick={handleReset}
                    />
                  )}
                </SearchInputWrapper>
              </Col>
            </Row>
          }
        >
          <CouponCustomerListTable
            forceLoading={initialLoading}
            handleTableChange={handleTableChange}
          />
        </AitCard>
      </MainWrapper>
    </LayoutContainer>
  );
};

export default CouponCustomersListTemplate;
