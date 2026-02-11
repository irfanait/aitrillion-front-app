import React, { useEffect, useState } from 'react';
import { LayoutContainer } from './style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitCard from '@/components/atoms/ait-card/aitCard';
import CouponListTable from '../../organisms/coupons-list-table/couponListTable';
import { useDispatch, useSelector } from 'react-redux';
import {
  activateDesctivateCouponCodesApi,
  deleteCouponApi,
  fetchCouponList,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import {
  activateDeactivateCouponCodesReset,
  deleteCouponReset,
  setCouponListFilter,
} from '@/redux/email-marketing-slices/couponsSlice/coupon-slice';
import { useRouter } from 'next/router';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import { App } from 'antd';
import AddDiscountCodeModal from '../../molecules/add-discount-code-modal/addDiscountCodeModal';

const CouponsListTemplate = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { notification } = App.useApp();

  const { login_auth } = useSelector((state) => state.jwtState);

  const couponsState = useSelector((state) => state.emailMarketingCouponState);

  const { shop_id = '' } = login_auth;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState('');
  const [addDiscCodeModalVisible, setAddDiscCodeModalVisible] = useState(false);
  const [activateDeactivateModalVisible, setActivateDeactivateModalVisible] =
    useState(false);
  const [selectedCouponData, setSelectedCouponData] = useState({});

  const isDeactivated = selectedCouponData?.is_temporary_deactivated === '1';

  useEffect(() => {
    if (shop_id) {
      let payload = {
        act: 'get_coupon_list',
        shop_id: shop_id,
      };

      dispatch(setCouponListFilter(payload));
      dispatch(fetchCouponList());
    }
  }, [shop_id, dispatch]);

  useEffect(() => {
    if (couponsState?.deleteCouponApiState === 'success') {
      notification.success({
        message: couponsState.deleteCouponMessage,
      });
      setDeleteModalVisible(false);
      dispatch(deleteCouponReset());
    }
    if (couponsState?.deleteCouponApiState === 'error') {
      notification.error({
        message: couponsState.deleteCouponMessage,
      });
      dispatch(deleteCouponReset());
    }
  }, [couponsState?.deleteCouponApiState]);

  useEffect(() => {
    if (couponsState?.activateDesctivateCouponCodesApiState === 'success') {
      notification.success({
        message: couponsState.activateDesctivateCouponCodesMessage,
      });
      setActivateDeactivateModalVisible(false);
      dispatch(activateDeactivateCouponCodesReset());
    }
    if (couponsState?.activateDesctivateCouponCodesApiState === 'error') {
      notification.error({
        message: couponsState.activateDesctivateCouponCodesMessage,
      });
      dispatch(activateDeactivateCouponCodesReset());
    }
  }, [couponsState?.activateDesctivateCouponCodesApiState]);

  const handleTableChange = (pagination, filtersFromTable, sorter) => {
    dispatch(
      setCouponListFilter({
        currentPage: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        order_by_col: sorter.field,
      })
    );
    dispatch(fetchCouponList());
  };

  const handleViewClick = (couponId, type) => {
    if (type === 'view') {
      router.push(`/email-marketing/coupons/${couponId}?type=${type}`);
    }
  };

  const handleEditClick = (couponId, type) => {
    if (type === 'edit') {
      router.push(`/email-marketing/coupons/${couponId}?type=${type}`);
    }
  };

  const handleDeleteModalConfirm = () => {
    const payload = {
      act: 'delete_popup',
      coupon_code_id: selectedCouponId,
      shop_id: shop_id,
    };

    dispatch(deleteCouponApi(payload));
  };

  const handleActivateDeactivateCouponCode = () => {
    const payload = {
      act: isDeactivated ? 'active_popup' : 'deactive_popup',
      coupon_code_id: selectedCouponData?.id,
      shop_id,
    };
    dispatch(activateDesctivateCouponCodesApi(payload));
  };

  return (
    <LayoutContainer>
      {/*StickyAlertWrapper*/}
      <MainWrapper>
        <AitPageHeader
          title="Discount codes"
          buttonLabel="Create"
          onButtonClick={() => {
            router.push('/email-marketing/coupons/add');
          }}
          showhowHelpDoc={true}
          helpdoclink="https://docs.aitrillion.com/portal/en/kb/articles/send-dynamic-discount-code-in-the-email-16-2-2025#Introduction"
        />

        <AitCard
          variant={'borderless'}
          style={{ boxShadow: 'none' }}
          borderless={true}
        >
          <CouponListTable
            handleTableChange={handleTableChange}
            handleEditClick={(id, type) => {
              handleEditClick(id, type);
            }}
            handleViewClick={(id, type) => handleViewClick(id, type)}
            handleDeleteCoupon={(id) => {
              setSelectedCouponId(id);
              setDeleteModalVisible(true);
            }}
            handleAddCouponCode={(id) => {
              setAddDiscCodeModalVisible(true);
              setSelectedCouponId(id);
            }}
            handleActivateDeactivateClick={(record) => {
              setSelectedCouponData(record);
              setActivateDeactivateModalVisible(true);
            }}
          />
        </AitCard>
      </MainWrapper>
      <AitConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        confirmText="Yes, delete it!"
        description="You want to delete it? It will be deleted permanently"
        onConfirm={() => {
          handleDeleteModalConfirm();
        }}
        confirmButtonLoading={couponsState?.deleteCouponLoading}
      />
      <AitConfirmationModal
        visible={activateDeactivateModalVisible}
        setVisible={setActivateDeactivateModalVisible}
        confirmText={`Yes, ${isDeactivated ? 'active' : 'deactive'} it!`}
        description={`You want to ${isDeactivated ? 'active' : 'deactivate'} it.`}
        onConfirm={() => {
          handleActivateDeactivateCouponCode();
        }}
        confirmButtonLoading={
          couponsState?.activateDesctivateCouponCodesLoading
        }
      />
      <AddDiscountCodeModal
        visible={addDiscCodeModalVisible}
        setVisible={setAddDiscCodeModalVisible}
        selectedCouponId={selectedCouponId}
      />
    </LayoutContainer>
  );
};

export default CouponsListTemplate;
