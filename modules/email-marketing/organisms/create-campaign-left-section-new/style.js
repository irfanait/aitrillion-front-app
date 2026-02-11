import styled from 'styled-components';
import { Card, Col, Tag } from 'antd';

export const LeftSection = styled.div`
  width: 100%;
  background: #fff;
  padding: 0px;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
  padding-top: 20px;
  padding-bottom: 30px;
  h3.ant-typography {
    color: var(--ant-color-text-primary);
  }
`;

export const StyledCol = styled(Col)`
  // margin-top: 16px;
`;
