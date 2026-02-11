// style.js
import styled from 'styled-components';
import { Card, Tag, Row } from 'antd';

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const StickyAlertWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 999;
  @media (max-width: 768px) {
    position: relative;
  }
`;

export const StickySubHeader = styled.div`
  position: sticky;
  z-index: 999;
  background: #fff;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid #eaebed;
  border-top: 1px solid #eaebed;

  .left {
    flex: 1;
    min-width: 200px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ant-breadcrumb-link,
  .ant-breadcrumb a {
    color: var(--ant-color-text-primary);
  }
  .ant-breadcrumb-link h5.ant-typography {
    color: inherit;
    margin-top: auto;
    margin-bottom: auto;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const StyleLeftRightPannelWrapper = styled(Row)`
  @media (max-width: 768px) {
    height: 90vh;
    overflow-y: auto;
  }
`;

export const ScrollableLeftPanel = styled.div`
  height: calc(100vh - 140px); // Adjust height depending on sticky header+alert
  overflow: auto;
  background: #fff;

  // Optional: hide scrollbar
  scrollbar-width: thin;
  scrollbar-color: #e3e9ef transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #e3e9ef;
    border-radius: 4px;
  }
  @media (max-width: 768px) {
    height: auto;
  }
`;

export const StyledAlertMessageDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
