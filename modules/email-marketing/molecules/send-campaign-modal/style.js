import styled from 'styled-components';
import { Row } from 'antd';

export const StyledFormWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const ButtonWrapper = styled(Row)`
  margin-top: 8px;
`;
