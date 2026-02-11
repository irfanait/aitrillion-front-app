import styled from 'styled-components';
import { Typography } from 'antd';
const { Text, Title } = Typography;

export const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* centers icon, title, and buttons */
  width: 100%;

  > * {
    max-width: 100%;
  }
`;

export const StyleTitle = styled(Title)``;
