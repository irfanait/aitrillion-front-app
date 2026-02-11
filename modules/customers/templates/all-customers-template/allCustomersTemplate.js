import React, { useEffect, useRef, useState } from 'react';
import { LayoutContainer } from './style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AllCustomersListTable from '../../organisms/all-customers-list-table/allCustomersListTable';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCustomerCustomFieldsApi,
  getCustomerInItDataApi,
} from '@/redux/apis/customers-api/customersApi';
import {
  deleteSegmentResetCustomerList,
  setAllCustomerFilters,
  setCustomerInitDataFilters,
} from '@/redux/customers-slice/all-customers-slices/all-customers-slice';
import SegmentAndFilterSection from '../../organisms/segment-and-filter-section/segmentAndFilterSection';
import { useSearchParams } from 'next/navigation';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import { updateModuleVersionApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { App } from 'antd';
import { getToken } from '@/utils/authHelpers';
const token = getToken();

const AllCustomersTemplate = () => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const allCustomerState = useSelector((state) => state.allCustomersState);
  const searchParams = useSearchParams();
  const { login_auth } = useSelector((state) => state.jwtState);
  const segmentIdFromUrl = searchParams.get('segment_id');
  const listIdFromUrl = searchParams.get('listId');
  const { getCustomerInitDataFilters } = allCustomerState;

  const { shop_id = '' } = login_auth;

  const {
    updateModuleVersionApiState,
    updateModuleVersionMessage,
    updateModuleVersionLoading,
  } = useSelector((state) => state.emailMarketingSettingsState);

  const [activeSegmentId, setActiveSegmentId] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const initLoadedRef = useRef(false);

  useEffect(() => {
    if (!shop_id) return;

    // dispatch(setAllCustomerFilters({ shop_id: shop_id }));
    dispatch(setCustomerInitDataFilters({ shop_id: shop_id }));
    dispatch(deleteSegmentResetCustomerList());
  }, [shop_id, dispatch]);

  useEffect(() => {
    if (!shop_id) return;

    if (listIdFromUrl) {
      // List mode: treat listId as filter only
      setActiveSegmentId('');

      dispatch(
        setAllCustomerFilters({
          shop_id,
          currentPage: 1,
          list_search: listIdFromUrl,
          gridOrMap: 'grid',
          isFirstRequest: true,
          isRequestForActiveCustomers: 0,
          just_seen: '',
          limit: 20,
          order: false,
          selectedOperatorType: 'and',
          selectedpeopleType: 'Customers',
          sort: 'c.last_seen_date',
          segment_id: '',
          masterFilter: '[]',
        })
      );
    } else if (segmentIdFromUrl) {
      setActiveSegmentId(segmentIdFromUrl);

      dispatch(
        setAllCustomerFilters({
          shop_id,
          currentPage: 1,
          segment_id: segmentIdFromUrl,
          list_search: '',
        })
      );
    } else {
      setActiveSegmentId('');
      setShowFilters(false);

      dispatch(
        setAllCustomerFilters({
          shop_id,
          currentPage: 1,
          list_search: '',
          segment_id: '',
          masterFilter: '[]',
          isFirstRequest: true,
          selectedOperatorType: 'and',
          selectedpeopleType: 'Customers',
          sort: 'c.last_seen_date',
          order: false,
          gridOrMap: 'grid',
          act: 'list_customer',
          isRequestForActiveCustomers: 0,
          just_seen: '',
          limit: 20,
          is_count_req: 0,
          get_only_data: 0,
          get_filter_customer_count: 1,
          is_sort_req: 0,
          moduleField: null,
          moduleFieldOperator: null,
        })
      );
    }
  }, [shop_id, listIdFromUrl, segmentIdFromUrl, dispatch]);

  useEffect(() => {
    if (!shop_id) return;
    if (initLoadedRef.current) return;
    initLoadedRef.current = true;

    dispatch(
      getCustomerInItDataApi({
        ...getCustomerInitDataFilters,
        currentPage: 1,
      })
    );
    dispatch(
      getCustomerCustomFieldsApi({
        act: 'get_customer_custom_fields',
        shop_id,
      })
    );
  }, [dispatch, getCustomerInitDataFilters, shop_id]);

  useEffect(() => {
    if (updateModuleVersionApiState === 'success') {
      notification.success({ message: updateModuleVersionMessage });
      window.location.replace(
        `${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`
      );
    }
    if (updateModuleVersionApiState === 'error') {
      notification.error({ message: updateModuleVersionMessage });
    }
  }, [updateModuleVersionApiState]);

  const handleUpdateModuleVersion = () => {
    const payload = {
      act: 'update_enable_email_marketing_v2',
      module_type: 'customersegmentation',
      // **is_enable_email_marketing_v2** key should be set dynamically from the getProfilePicture API
      is_enable_customer_segmentation_v2: 0,
    };
    dispatch(updateModuleVersionApi(payload));
  };

  return (
    <LayoutContainer>
      <AitAlert
        type="warning"
        hascustomicon={false}
        barpadding={'2px 2px 2px 2px'}
        bgcolor="#2f80ed"
        color="#ffffff"
        message="Welcome to AiTrillion's customer segmentation v2 – Faster, Smarter & More Optimized! Having issue?"
        buttonText={
          updateModuleVersionLoading
            ? 'Switching...'
            : 'Switch back to customer segmentation v1'
        }
        onClick={() => {
          handleUpdateModuleVersion();
        }}
      />
      <MainWrapper>
        <AitPageHeader
          title="Customers"
          subtitle="Create segments or click timeline to view individual customer journeys in the store."
          subtitleLink=""
          buttonLabel={'Create segment'}
          onButtonClick={() => {
            setShowFilters(true);
          }}
        />
        {/* Hide segment section when viewing by listId */}
        {!listIdFromUrl && (
          <SegmentAndFilterSection
            onSegmentSelect={(val) => setActiveSegmentId(val)}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        )}
        <div style={{ marginTop: '20px' }}>
          <AllCustomersListTable
            activeSegmentId={activeSegmentId}
            showFilters={showFilters}
          />
        </div>
      </MainWrapper>
    </LayoutContainer>
  );
};

export default AllCustomersTemplate;
