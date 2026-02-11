import styled from 'styled-components';

export const SkeletonSection = styled.div`
  padding: 20px 24px 8px 24px;
`;

export const SkeletonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const SkeletonLeft = styled.div`
  // width: 40%;
`;

export const SkeletonRight = styled.div`
  // width: 35%;
`;

export const SkeletonHeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  background: #fff;
  padding: 10px 24px;
  z-index: 10;
  border-bottom: 1px solid #f0f0f0;
`;

export const LeftScrollableWrapper = styled.div`
  height: 100%;
  min-height: calc(100vh - 98px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 6px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d6d6d6;
    border-radius: 4px;
  }
`;
