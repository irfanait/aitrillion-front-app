import { Typography } from 'antd';
import styled from 'styled-components';
const { Text } = Typography;

export const EllipsisWrapper = styled(Text)(() => ({
  maxWidth: 170,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle',
}));
