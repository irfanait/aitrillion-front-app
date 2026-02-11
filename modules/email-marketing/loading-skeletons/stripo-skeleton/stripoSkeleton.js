import React from 'react';
import { LeftSkeleton, RightSkeleton, SkeletonWrapper } from './style';
import { Skeleton } from 'antd';

const StripoSkeleton = () => {
  return (
    <SkeletonWrapper>
      <LeftSkeleton>
        <Skeleton active paragraph={{ rows: 25 }} />
      </LeftSkeleton>
      <RightSkeleton>
        <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 25 }} />
      </RightSkeleton>
    </SkeletonWrapper>
  );
};

export default StripoSkeleton;
