import React, { useEffect } from 'react';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { App, Col, Divider, Row, Typography } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import { customerDetailsEmailUpdateApi } from '@/redux/apis/customers-api/customersApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetEmailUpdateStatus,
  updateEmailUnsubscribeState,
} from '@/redux/customers-slice/customer-details-slices/customerDetailsSlice';
import AitText from '@/components/atoms/ait-text/aitText';

const { Title } = Typography;

const toBool = (v) => v === 1 || v === '1' || v === true;

const UnSubscribeCard = ({ data }) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const { emailUpdateLoading, emailUpdateMessage, emailUpdateApiState } =
    useSelector((state) => state.customerDetailsState);

  const [formState, setFormState] = React.useState({
    email_marketing: toBool(data?.email_marketing),
    review_email: toBool(data?.review_email),
    email_workflow: toBool(data?.email_workflow),
  });

  useEffect(() => {
    if (emailUpdateApiState === 'success') {
      dispatch(
        updateEmailUnsubscribeState({
          email_marketing: formState.email_marketing,
          review_email: formState.review_email,
          email_workflow: formState.email_workflow,
        })
      );
      notification.success({
        message: emailUpdateMessage,
      });
      dispatch(resetEmailUpdateStatus());
    }
    if (emailUpdateApiState === 'error') {
      notification.error({
        message: emailUpdateMessage,
      });
      dispatch(resetEmailUpdateStatus());
    }
  }, [emailUpdateApiState]);

  const handleChange = (key, e) => {
    const checked = e?.target?.checked ?? false;
    setFormState((prev) => ({ ...prev, [key]: checked }));
  };

  const handleUpdate = () => {
    const payload = {
      act: 'saveUnsubscibedInfo',
      unsubscriber_customer_email: data?.encoded_customer_email,
      unsubscriber_shop_id: data?.encoded_shop_id,
      manual_request: 1,

      email_marketing: formState.email_marketing ? 1 : 0,
      review_email: formState.review_email ? 1 : 0,
      email_workflow: formState.email_workflow ? 1 : 0,
    };

    dispatch(customerDetailsEmailUpdateApi(payload));
  };

  return (
    <AitCard
      borderless
      title="Unsubscribed from email list"
      bodypadding={{
        xs: '5px 20px 20px 20px',
        sm: '5px 20px 20px 20px',
        md: '5px 24px 24px 24px',
      }}
    >
      <AitText bottommargin={10} type="default" strong>
        Select communication this customer wants to stop receiving:
      </AitText>

      <Row gutter={[20, 0]}>
        {/* Left column */}
        <Col xs={24} sm={24} md={12}>
          <AitCheckboxButton
            fontweight="400"
            label="Marketing email campaign"
            checked={formState.email_marketing}
            onChange={(e) => handleChange('email_marketing', e)}
          />

          <AitCheckboxButton
            fontweight="400"
            label="Review request email"
            checked={formState.review_email}
            onChange={(e) => handleChange('review_email', e)}
          />
        </Col>

        {/* Right column */}
        <Col xs={24} sm={24} md={12}>
          <AitCheckboxButton
            fontweight="400"
            label="Transaction emails"
            checked={formState.email_workflow}
            onChange={(e) => handleChange('email_workflow', e)}
          />
        </Col>
      </Row>

      <AitButton
        title="Update"
        type="primary"
        style={{ width: 150, marginTop: 10 }}
        loading={emailUpdateLoading}
        onClick={handleUpdate}
      />
    </AitCard>
  );
};

export default UnSubscribeCard;
