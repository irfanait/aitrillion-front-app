import React, { useEffect, useState } from 'react';
import { LayoutContainer, StyleSpan } from './style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { App, Spin, Typography } from 'antd';
import { Form, Formik } from 'formik';
import CreateCouponForm from '../../organisms/create-coupon-form/createCouponForm';
import { createCouponValidationSchema } from '../../utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCouponApi,
  deleteCouponApi,
  fetchProductCollectionsForDiscount,
  fetchProductList,
  getCouponInfoApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import {
  createCouponReset,
  deleteCouponReset,
  setCouponInfoFilter,
  setProductListFilter,
} from '@/redux/email-marketing-slices/couponsSlice/coupon-slice';
import CouponCodeViewEditHeader from '../../atoms/coupon-code-view-edit-header/couponCodeViewEditHeader';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import { getTimeZoneListApi } from '@/redux/apis/get-time-zone-list-api/getTimeZoneListApi';
import dayjs from 'dayjs';
import CreateCouponFormSkeleton from '../../loading-skeletons/create-coupon-form-skeleton/createCouponFormSkeleton';
const { Text } = Typography;

const mapApiCouponDataToFormValues = (data) => {
  return {
    coupon_code: data.coupon_code || '',
    coupon_prefix: data.coupon_prefix || '',
    coupon_update_date: data.coupon_update_date || '',
    discountCodeStatus: data.discountCodeStatus || '',
    discount_type: data.discount_type || 'fixed',
    discount_amount: data.discount_amount || '',
    discount_generator_type: data.discount_generator_type || '1',

    minimum_purchase_status: data.minimum_purchase_status === '1',
    minimum_purchase: data.minimum_purchase || '',

    discount_apply_to: data.discount_apply_to || 'entireorder',
    discount_apply_to_product: data.discount_apply_to_product
      ? JSON.parse(data.discount_apply_to_product)
      : [],
    discount_apply_to_collection: data.discount_apply_to_collection
      ? JSON.parse(data.discount_apply_to_collection)
      : [],

    freeshiping_countries_type: data.freeshiping_countries_type || 'allcountry',
    freeshiping_selected_country: data.freeshiping_selected_country || null,

    discount_activation_type: data.discount_activation_type || 'instant',
    discount_activation_date:
      data.discount_activation_date &&
      data.discount_activation_date !== '0000-00-00 00:00:00'
        ? dayjs(data.discount_activation_date, 'YYYY-MM-DD HH:mm:ss')
        : null,

    discount_expiration_type: data.discount_expiration_type || 'never',
    discount_expiration_date:
      data.discount_expiration_date &&
      data.discount_expiration_date !== '0000-00-00 00:00:00'
        ? dayjs(data.discount_expiration_date, 'YYYY-MM-DD HH:mm:ss')
        : null,
    discount_expiration_days_hrs_selection:
      data.discount_expiration_days_hrs_selection || null,
    discount_expiration_days_hrs_val:
      data.discount_expiration_days_hrs_val || '0',

    is_discount_code_limit: data.is_discount_code_limit === '1',
    is_order_discount: data.is_order_discount || '0',
    is_product_discount: data.is_product_discount || '0',
    is_shipping_discount: data.is_shipping_discount || '0',
    is_temporary_deactivated: data.is_temporary_deactivated || '0',
    last_generated_price_rule_id: data.last_generated_price_rule_id || null,
    usage_limit: data.usage_limit || '',
    once_per_customer: data.once_per_customer === '1',

    selected_time_zone: data.selected_time_zone || '',
    setting_change_status: data.setting_change_status || '0',
    shop_id: data.shop_id,
  };
};

const CreateCouponTemplate = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id, type } = router.query;
  const { notification } = App.useApp();
  const isViewMode = type === 'view';
  const isEditMode = type === 'edit';

  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );
  const jwtState = useSelector((state) => state.jwtState);

  const { shop_id = '' } = userDetails || {};

  const couponsState = useSelector((state) => state.emailMarketingCouponState);

  const formInitialValues =
    isEditMode || isViewMode
      ? mapApiCouponDataToFormValues(
          couponsState?.getCouponInfoData?.couponInfo || {}
        )
      : {
          // Basic Coupon Info
          coupon_code: '',
          coupon_prefix: '',
          coupon_update_date: '',
          discountCodeStatus: '',
          discount_type: 'fixed',
          discount_amount: '',
          discount_generator_type: '1',
          discount_expiration_days_hrs_val: '',
          // Minimum Purchase
          minimum_purchase_status: false,
          minimum_purchase: '',

          // Apply To
          discount_apply_to: 'entireorder',
          discount_apply_to_product: [],
          discount_apply_to_collection: [],

          // Free Shipping
          freeshiping_countries_type: 'allcountry',
          freeshiping_selected_country: null,

          // Activation & Expiration
          discount_activation_type: 'instant',
          discount_activation_date: null,
          discount_expiration_type: 'never',
          discount_expiration_date: null,
          discount_expiration_days_hrs_selection: null,

          // Limits & Flags
          is_discount_code_limit: false,
          is_order_discount: '0',
          is_product_discount: '0',
          is_shipping_discount: '0',
          is_temporary_deactivated: '0',
          last_generated_price_rule_id: null,
          usage_limit: 0,
          once_per_customer: false,

          // Misc
          selected_time_zone: jwtState?.login_auth?.timezone || '',
          setting_change_status: '0',
          shop_id,
        };
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    if (!shop_id) return;
    dispatch(
      setProductListFilter({ act: 'get_product_list', shop_id: shop_id })
    );
    dispatch(fetchProductList());
    dispatch(getTimeZoneListApi());

    dispatch(
      fetchProductCollectionsForDiscount({
        act: 'getSearchShopifyCollectionsForDiscount',
        shop_id: shop_id,
      })
    );
  }, [shop_id, dispatch]);

  useEffect(() => {
    if ((isEditMode || isViewMode) && id && shop_id) {
      dispatch(
        setCouponInfoFilter({
          act: 'get_coupon_info',
          shop_id: shop_id,
          coupon_code_id: id,
        })
      );
      dispatch(getCouponInfoApi());
    }
  }, [type, id, shop_id]);

  useEffect(() => {
    if (couponsState?.createCouponApiState === 'success') {
      notification.success({
        message: couponsState.createCouponMessage,
      });

      dispatch(createCouponReset());
      router.push('/email-marketing/coupons/list');
    }
  }, [couponsState?.createCouponApiState]);

  useEffect(() => {
    if (couponsState?.deleteCouponApiState === 'success') {
      notification.success({
        message: couponsState.deleteCouponMessage,
      });
      setDeleteModalVisible(false);
      dispatch(deleteCouponReset());
      router.push('/email-marketing/coupons/list');
    }
    if (couponsState?.deleteCouponApiState === 'error') {
      notification.error({
        message: couponsState.deleteCouponMessage,
      });
      dispatch(deleteCouponReset());
    }
  }, [couponsState?.deleteCouponApiState]);

  const handleCreateCoupon = (values) => {
    const isEditMode = type === 'edit';

    const payload = {
      payload: {
        ...values,
        discount_activation_date: values.discount_activation_date
          ? values.discount_activation_date.format('YYYY-MM-DD HH:mm:ss')
          : null,
        discount_expiration_date: values.discount_expiration_date
          ? values.discount_expiration_date.format('YYYY-MM-DD HH:mm:ss')
          : null,
        ...(isEditMode && { id: router.query.id }), // merge id only in edit mode
      },
      query: {
        act: isEditMode ? 'update_coupon_setting' : 'store_coupon_setting',
      },
    };

    dispatch(createCouponApi(payload));
  };

  const handleDeleteModalConfirm = () => {
    const payload = {
      act: 'delete_popup',
      coupon_code_id: router?.query?.id,
      shop_id: shop_id,
    };

    dispatch(deleteCouponApi(payload));
  };

  return (
    <LayoutContainer>
      {/*StickyAlertWrapper*/}
      <MainWrapper>
        {isViewMode || isEditMode ? (
          <CouponCodeViewEditHeader
            title={isViewMode ? 'View coupon info' : 'Edit coupon info'}
            onBack={() => router.push('/email-marketing/coupons/list')}
            showDelete={isViewMode || isEditMode}
            onDelete={() => {
              setDeleteModalVisible(true);
            }}
          />
        ) : (
          <AitPageHeader
            title="Add discount code"
            buttonLabel="Back to list"
            buttonIcon={<UnorderedListOutlined />}
            onButtonClick={() => {
              router.push('/email-marketing/coupons/list');
            }}
          />
        )}
        <AitCard
          headerborderradius="0px"
          extra={
            <StyleSpan style={{ fontSize: 13 }}>
              Use the below form to define a new discount offer. As a next step,
              you will need to insert a dynamic tag into your email template
              that represents this coupon. At send time, the dynamic tag will be
              replaced with a unique, one-time use coupon code. Each of your
              email recipients will receive a unique coupon code, generated just
              for them. Each coupon code can only be used once.
            </StyleSpan>
          }
        >
          {couponsState?.getCouponInfoLoading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Formik
              enableReinitialize
              initialValues={formInitialValues}
              validationSchema={
                isViewMode ? null : createCouponValidationSchema
              }
              onSubmit={(values) => {
                if (!isViewMode) handleCreateCoupon(values);
              }}
            >
              {({ values, setFieldValue, errors, touched }) => {
                return (
                  <Form>
                    <CreateCouponForm
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      isViewMode={isViewMode}
                      isEditMode={isEditMode}
                    />
                  </Form>
                );
              }}
            </Formik>
          )}
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
    </LayoutContainer>
  );
};

export default CreateCouponTemplate;
