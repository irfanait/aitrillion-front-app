import React, { useEffect } from 'react';
import { App, Switch, Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

import { HeaderWrapper, AvatarCircle } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomerStatusReset } from '@/redux/customers-slice/customer-details-slices/customerDetailsSlice';

const { Text, Title } = Typography;

const CustomerDetailsHeader = ({
  name,
  location,
  customer,
  onToggleStatus,
}) => {
  const { notification } = App.useApp();
  const dispatch = useDispatch();

  const { statusUpdating, statusUpdatingApiState, emailUpdateMessage } =
    useSelector((state) => state.customerDetailsState);
  const isActive = String(customer?.is_inactive) === '0';

  const initials =
    name
      ?.split(' ')
      ?.map((word) => word[0])
      ?.join('')
      ?.slice(0, 2)
      ?.toUpperCase() || 'U';

  useEffect(() => {
    if (statusUpdatingApiState === 'success') {
      notification.success({
        message: emailUpdateMessage,
      });
      dispatch(updateCustomerStatusReset());
    }
    if (statusUpdatingApiState === 'error') {
      notification.error({
        message: emailUpdateMessage,
      });
      dispatch(updateCustomerStatusReset());
    }
  }, [statusUpdatingApiState]);

  return (
    <HeaderWrapper>
      {/* AVATAR */}
      <AvatarCircle>{initials}</AvatarCircle>

      {/* NAME + LOCATION */}
      <div className="header-middle">
        <Title type="primary" level={5} className="cust-name">
          {name}
        </Title>

        {/* <Text type="secondary" className="location">
          <EnvironmentOutlined /> {location}
        </Text> */}
      </div>

      {/* RIGHT SIDE STATUS BADGE */}
      <div className={isActive ? 'active' : 'inactive'}>
        <div className="status-toggle">
          <Switch
            checked={isActive}
            onChange={onToggleStatus}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            loading={statusUpdating}
            className={isActive ? 'active-switch' : 'inactive-switch'}
          />
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default CustomerDetailsHeader;
