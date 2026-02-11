import { Alert } from 'antd';
import React from 'react';
import { StyledAlertMessageDiv } from './style';
import { WarningFilled } from '@ant-design/icons';
import Link from 'next/link';

const SuspiciousEmailAlertBar = () => {
  return (
    <Alert
      style={{
        border: 'none',
        borderRadius: '0px',
      }}
      message={
        <StyledAlertMessageDiv>
          <WarningFilled
            style={{
              marginRight: 8,
              color: '#fa2f14ff',
            }}
          />
          <span style={{ color: '#a94442' }}>
            Your last sent campaign bounce rate is high, so before proceeding
            please{' '}
            <Link
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_APP_URL}/index/support`}
            >
              contact us
            </Link>
            .
          </span>
        </StyledAlertMessageDiv>
      }
      type="error"
      showIcon={false}
    />
  );
};

export default SuspiciousEmailAlertBar;
