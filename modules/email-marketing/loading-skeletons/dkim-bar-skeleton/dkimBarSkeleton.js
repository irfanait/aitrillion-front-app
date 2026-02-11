import React from 'react';
import { Skeleton, Alert } from 'antd';
import { StyledAlertMessageDiv } from './style';

const { Input, Avatar } = Skeleton;

const DkimAlertBarSkeleton = () => {
  return (
    <Alert
      style={{
        border: 'none',
        borderRadius: '0px',
      }}
      message={
        <StyledAlertMessageDiv>
          <div>
            <Input
              active
              size="default"
              style={{ width: '100%', marginBottom: 4 }}
            />
            {/* <Input active size="small" style={{ width: '40%' }} /> */}
          </div>
        </StyledAlertMessageDiv>
      }
      type="error"
      showIcon={false}
    />
  );
};

export default DkimAlertBarSkeleton;
