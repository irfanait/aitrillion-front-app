// style.js
import styled from 'styled-components';
import { Card, Tag, Row } from 'antd';

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
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

export const LeftSection = styled.div`
  width: 400px;
  background: #fff;
  padding: 24px;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const ScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  max-width: 700px;
  width: 100%;
`;

export const OptionCard = styled(Card)`
  .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
  }

  &:hover {
    box-shadow: 0 4px 12px #3086e9;
  }
`;

export const IconWrapper = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

export const Description = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
`;

export const PopularTag = styled(Tag)`
  margin-top: auto;
  font-size: 12px;
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
  position: absolute;
  top: 12px;
  right: 12px;
`;
