import styled from 'styled-components';
import { Card, Tabs } from 'antd';

export const CardHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: #fff;
  border-radius: 8px;
`;

export const TabHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 12px 16px 0;
  border-bottom: 1px solid #f0f0f0;
`;

// export const FilterScrollWrapper = styled.div`
//   display: flex;
//   overflow-x: auto;
//   white-space: nowrap;
//   gap: 8px;
//   padding: 12px 16px;
//   border-bottom: 1px solid #f0f0f0;
//   background: #fff;

//   &::-webkit-scrollbar {
//     height: 6px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background: #ccc;
//     border-radius: 10px;
//   }
// `;

export const FilterScrollWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const FilterTag = styled.div`
  background: ${({ active }) => (active ? '#1890ff' : '#f0f0f0')};
  color: ${({ active }) => (active ? 'white' : 'black')};
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: all 0.3s;
`;
export const StyledCard = styled(Card)`
  border-radius: 8px !important;

  .ant-card-body {
    padding: 0px 0px 24px 0px;
  }
`;
export const StyledTabsWrapper = styled.div`
  padding: 10px 24px 0px 24px;
  .ant-tabs-top > .ant-tabs-nav::before {
    right: -24px;
    left: -24px;
  }

  @media (max-width: 768px) {
    padding: 10px 20px 0px 20px;
  }

  @media (max-width: 576px) {
    padding: 10px 20px 0px 20px;
  }
`;

export const CardContentWrapper = styled.div`
  max-height: 85vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SpinContainerDiv = styled.div`
  text-align: center;
  padding: 16px;
  font-weight: 500;
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FlexScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .content-scrollable {
    flex: 1;
    overflow-y: auto;
  }
`;
