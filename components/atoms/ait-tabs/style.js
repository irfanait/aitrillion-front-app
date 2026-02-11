import styled from 'styled-components';
import { Tabs } from 'antd';

export const StyledTabs = styled(Tabs)`
  padding: 0px !important;

  ${({ pills }) =>
    pills === true &&
    `.ant-tabs-tab {
   
   }`}

  .ant-tabs-tab {
    font-size: 16px;
    line-height: 16px;
    padding: 17px 0px;
    font-weight: 500 !important;
    ${({ hascustomheader }) => hascustomheader && 'min-height:62px;'}
  }
  .ant-tabs-tab-btn {
    font-weight: 500;
  }

  > .ant-tabs-nav {
    margin-bottom: 0px;
  }

  > .ant-tabs-nav:before {
    ${({ hascustomheader }) => hascustomheader && 'display:none;'}
  }

  @media (max-width: 768px) {
    .ant-tabs-tab {
      font-size: 16px;
      line-height: 16px;
      padding: 17px 0px;
      min-height: auto;
    }
  }

  @media (max-width: 576px) {
    .ant-tabs-nav-wrap {
      ${({ tabspadding }) =>
        tabspadding?.xs ? `padding:${tabspadding.xs}` : '0px'}
    }
  }

  @media (min-width: 576px) {
    .ant-tabs-nav-wrap {
      ${({ tabspadding }) =>
        tabspadding?.sm ? `padding:${tabspadding.sm};` : '0px'}
    }
  }

  @media (min-width: 768px) {
    .ant-tabs-nav-wrap {
      ${({ tabspadding }) =>
        tabspadding?.md ? `padding:${tabspadding.md};` : '0px'}
    }
  }
`;
