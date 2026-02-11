import React from 'react';
import { ArrowLeftOutlined, LeftOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const { Text } = Typography;

const BackHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
`;

const BackArrow = styled(LeftOutlined)`
  font-size: 12px;
  color: #1f5eff;
  cursor: pointer;
`;

const HeaderTitle = styled(Text)`
  font-size: 14px !important;
  font-weight: 500 !important;
  letter-spacing: -0.02em;
  margin: 0 !important;
  color: ${(props) => (props.isClickable ? '#1f5eff' : 'rgba(0, 0, 0, 0.88)')};
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};

  &:hover {
    color: ${(props) => (props.isClickable ? '#4080ff' : 'inherit')};
  }
`;

const CustomerDetailsBackHeader = () => {
  const router = useRouter();

  const fromList = router.query?.fromList;
  const segmentId = router.query?.segment_id;
  const listId = router.query?.listId;

  // Determine header config
  const getHeaderConfig = () => {
    if (fromList === 'true') {
      // Navigated from list - clickable back button
      if (segmentId) {
        return {
          title: 'Back to list',
          tooltip: 'Go back to previous filtered customer list',
          isClickable: true,
        };
      } else if (listId) {
        return {
          title: 'Back to List',
          tooltip: 'Go back to customer list',
          isClickable: true,
        };
      } else {
        return {
          title: 'All Customer List',
          tooltip: 'Go back to all customers',
          isClickable: true,
        };
      }
    } else {
      // Opened directly or in new tab - static display
      return {
        title: 'All Customer List',
        tooltip: 'Go back to all customers',
        isClickable: true,
      };
    }
  };

  const handleBackToList = () => {
    const queryParams = new URLSearchParams();

    if (segmentId) {
      queryParams.set('segment_id', segmentId);
    }

    if (listId) {
      queryParams.set('listId', listId);
    }

    const listUrl = queryParams.toString()
      ? `/customers/all-customers/list?${queryParams.toString()}`
      : '/customers/all-customers/list';

    router.push(listUrl);
  };

  const config = getHeaderConfig();

  const handleClick = () => {
    if (config.isClickable) {
      handleBackToList();
    }
  };

  return (
    <Tooltip title={config.tooltip} placement="topLeft">
      <BackHeaderWrapper isClickable={config.isClickable} onClick={handleClick}>
        <BackArrow
          onClick={config.isClickable ? handleBackToList : undefined}
        />
        <HeaderTitle
          type="secondary"
          level={5}
          isClickable={config.isClickable}
        >
          {config.title}
        </HeaderTitle>
      </BackHeaderWrapper>
    </Tooltip>
  );
};

export default CustomerDetailsBackHeader;
