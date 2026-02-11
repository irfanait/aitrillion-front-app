import { Card } from 'antd';
import styled from 'styled-components';

export const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  border: none;
  box-shadow: none;
  padding: 0;
  margin-top: 10px;
  .ant-card-body {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #153b71;
`;

export const SubText = styled.div`
  color: #576f7c;
  font-size: 14px;
`;
