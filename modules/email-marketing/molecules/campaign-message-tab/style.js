import styled from 'styled-components';
import { Card } from 'antd';

export const FullHeightCard = styled(Card)`
  height: 100vh;
  display: flex;
  flex-direction: column;

  .ant-card-body {
    flex: 1;
    overflow: auto;
  }
`;
