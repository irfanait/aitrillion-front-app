import { Alert } from 'antd';
import React from 'react';
import { StyledAlertMessageDiv } from './style';
import { WarningFilled } from '@ant-design/icons';
import Link from 'next/link';

const DkimAlertBar = () => {
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
            It’s mandatory to complete DKIM settings for domain authentication
            and reliable delivery before sending campaigns — set up DKIM from{' '}
            <Link
              style={{
                fontWeight: 500,
                color: '#000',
                textDecoration: 'underline',
              }}
              href="/email-marketing/settings/dkimsetting"
            >
              here
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

export default DkimAlertBar;
