import styled from 'styled-components';

export const RightSectionWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 80px); // full height minus top nav
  display: flex;
  flex-direction: column;
  overflow: hidden; // prevent internal scroll
  padding-left: 20px;
`;

export const SkeletonCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px 0px;
  margin-bottom: 20px;
`;

export const SkeletonRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const SkeletonCol = styled.div`
  flex: 1;
`;

export const SkeletonTitle = styled.div`
  margin-bottom: 12px;
`;

export const RightContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 12px;
`;
