import { Skeleton } from 'antd';
import { StyledSkeletonInput, Wrapper } from './style';

function GlobalSkeleton() {
  return (
    <Wrapper>
      <Skeleton.Avatar active size="small" shape="circle" />

      <StyledSkeletonInput active size="small" block />
    </Wrapper>
  );
}

export default GlobalSkeleton;
