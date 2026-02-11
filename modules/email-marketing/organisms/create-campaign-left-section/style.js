// style.js
import styled from 'styled-components';
import { Card, Col, Tag } from 'antd';

export const LayoutContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;

  //   @media (max-width: 768px) {
  //     ${({ padding }) =>
    padding?.xs ? `padding: ${padding.xs};` : 'padding:24px 16px 24px 16px;'}
  //   }
  //
`;

export const StickyAlertWrapper = styled.div`
  background: #3086e9;
  position: sticky;
  top: 0;
  z-index: 999;
`;

export const StickySubHeader = styled.div`
  background: #fff;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  z-index: 999;
`;

export const LeftSection = styled.div`
  width: 100%;
  background: #fff;
  padding: 0px;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
  padding-top: 25px;
  padding-bottom: 30px;
  h3.ant-typography {
    color: var(--ant-color-text-primary);
  }
`;

export const ButtonWrapper = styled.div`
  display: 'flex';
  justifycontent: 'flex-end';
`;

export const StyledCol = styled(Col)`
  // margin-top: 16px;
`;
