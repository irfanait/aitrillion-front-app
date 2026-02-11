import { Tooltip } from 'antd';
import styled from 'styled-components';

export const StyleTooltip = styled(Tooltip)`
  ${({ overlayClassName }) =>
    overlayClassName &&
    `
  .${overlayClassName}:{
    background:red
  }
  `}
`;
