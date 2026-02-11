import styled from 'styled-components';
import { Typography } from 'antd';
const { Text } = Typography;

export const LabelText = styled(Text)`
  font-weight: 500;
  color: var(--ant-color-text-label-primary);
  font-size: 13px;
`;

export const ValueText = styled(Text)`
  font-weight: 400;
  color: var(--ant-color-text-contol);
  font-size: 13px;
`;
