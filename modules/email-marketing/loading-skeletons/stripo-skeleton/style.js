import React from 'react';
import { Skeleton } from 'antd';
import styled from 'styled-components';

export const SkeletonWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const LeftSkeleton = styled.div`
  width: 280px; /* Settings sidebar width */
  padding: 16px;
  border-right: 1px solid #f0f0f0;
`;

export const RightSkeleton = styled.div`
  flex: 1;
  padding: 16px;
`;
