import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import React, { useEffect, useState } from 'react';
import { ButtonWrapper } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Col, Row, Space } from 'antd';
import { Typography } from 'antd';
import { addDiscountCodesApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { useDispatch, useSelector } from 'react-redux';
import { addDiscountcodesReset } from '@/redux/email-marketing-slices/couponsSlice/coupon-slice';

const { Text } = Typography;

const AddDiscountCodeModal = (props) => {
  const { visible, setVisible, setSelectedCampaignId, selectedCouponId } =
    props;
  const dispatch = useDispatch();

  const { notification } = App.useApp();

  const couponsState = useSelector((state) => state.emailMarketingCouponState);

  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );
  const { shop_id = '' } = userDetails || {};

  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState({
    errorState: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (couponsState?.addDiscountCodesApiState === 'success') {
      setError({
        errorState: false,
        errorMessage: '',
      });
      setCouponCode('');
      setVisible(false);
      notification.success({
        message: couponsState.addDiscountCodesMessage,
      });
      dispatch(addDiscountcodesReset());
    }

    if (couponsState?.addDiscountCodesApiState === 'error') {
      setVisible(true);
      notification.error({
        message: couponsState.addDiscountCodesError,
      });
      dispatch(addDiscountcodesReset());
    }
  }, [couponsState?.addDiscountCodesApiState]);

  const handleAddDicountCodes = () => {
    const trimmedCode = couponCode.trim();

    // ✅ Required
    if (trimmedCode.length === 0) {
      setError({
        errorState: true,
        errorMessage: 'Please enter the number of discount codes.',
      });
      return;
    }

    // ✅ Numbers only
    if (!/^\d+$/.test(trimmedCode)) {
      setError({
        errorState: true,
        errorMessage: 'Only numeric values are allowed.',
      });
      return;
    }

    // ✅ Greater than zero
    if (parseInt(trimmedCode, 10) <= 0) {
      setError({
        errorState: true,
        errorMessage: 'The number of discount codes must be greater than zero.',
      });
      return;
    }

    const payload = {
      payload: {
        countSync: 0,
        coupon_code_id: selectedCouponId,
        currentPage: 1,
        interedcode: trimmedCode,
        limit: 10,
        order: 0,
        shop_id: shop_id,
        totalRecords: couponsState?.totalCount,
      },
      query: {
        act: 'generate_discount_code',
      },
    };

    dispatch(addDiscountCodesApi(payload));
  };

  return (
    <>
      <AitModal
        open={visible}
        setVisible={setVisible}
        title="Add codes"
        centered
        width={500}
      >
        <div style={{ marginTop: 10 }}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  You are adding discount code for DISC01. Please specify the
                  number of codes you want to create and click submit.
                </Text>
              </div>
              <div style={{ marginTop: 16 }}>
                <AitInputBox
                  name="couponCode"
                  label="How many discount codes do you want to create?"
                  required
                  value={couponCode}
                  onChange={(e) => {
                    if (e.target.value) {
                      setError({ errorState: false, errorMessage: '' });
                    }
                    setCouponCode(e.target.value);
                  }}
                  placeholder="Enter Coupon name"
                  error={error.errorState}
                  errorMessage={error.errorMessage}
                />
              </div>
            </Col>
          </Row>

          <ButtonWrapper style={{ marginTop: 24 }}>
            <Space>
              <AitButton
                title={'Submit'}
                type="primary"
                onClick={() => {
                  handleAddDicountCodes();
                }}
                loading={couponsState?.addDiscountCodesLoading}
              />
              <AitButton
                type="text"
                title="Cancel"
                color="default"
                variant="filled"
                onClick={() => {
                  setError({
                    errorState: false,
                    errorMessage: '',
                  });
                  setCouponCode('');
                  setVisible(false);
                }}
              />
            </Space>
          </ButtonWrapper>
        </div>
      </AitModal>
    </>
  );
};

export default AddDiscountCodeModal;
