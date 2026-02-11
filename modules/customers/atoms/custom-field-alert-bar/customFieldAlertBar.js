import React from 'react';
import { LimitAlert } from './style';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { wrap } from 'lodash';

const CustomFieldAlertBar = ({
  totalAllowed = 100,
  dateTypeLimit = 15,
  otherTypeLimit = 85,
  createdCount = 0,
}) => {
  return (
    <LimitAlert
      type="warning"
      justify="start"
      hascustomicon={true}
      alignicon="start"
      textAlign="left"
      icontopspacing="6"
      message={
        <div style={{ fontSize: 14, color: '#4A566B' }}>
          <span style={{ marginRight: 8 }}>
            You are allowed to create up to {totalAllowed} custom fields
            throughout your lifetime ({dateTypeLimit} date type fields and{' '}
            {otherTypeLimit} other type fields)
          </span>
          <span
            style={{
              background: 'rgb(252 237 207)',
              padding: '6px 12px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
              fontSize: 13,
              color: '#4A566B',
              display: 'inline-flex',
            }}
          >
            You’ve created {createdCount} fields out of {totalAllowed}
          </span>
        </div>
      }
      showIcon
    />
  );
};

export default CustomFieldAlertBar;
