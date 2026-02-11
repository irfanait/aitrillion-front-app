import styled from 'styled-components';
import { Tabs } from 'antd';

export const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    font-size: 16px; /* Adjust the size */
    // font-weight: 900 !important;
  }
  && .ant-tabs-tab-btn {
    font-weight: 700;
  }
`;

export const SpinWrapperDiv = styled.div`
  textalign: center;
  display: flex;
  justify-content: center;
  alignitems: center;
  height: 650px;
`;
