import styled from 'styled-components';
import { Typography } from 'antd';
const { Title, Text } = Typography;

export const StyledTextWrapper = styled.div`
  ${({ lineheight }) =>
    (lineheight && `line-height:${lineheight}px;`) || `line-height: 20px;`}
  ${({ bottommargin }) =>
    (bottommargin && `margin-bottom:${bottommargin}px;`) ||
    `margin-bottom: auto;`}
     ${({ topmargin }) =>
    (topmargin && `margin-top:${topmargin}px;`) || `margin-top: auto;`}
`;

export const StyledText = styled(Text)`
  ${({ size }) => size && 'font-size:' + size + 'px!important;'}
  ${({ weight }) => weight && 'font-weight:' + weight + ';'}
    line-height: inherit;
  ${({ type }) =>
    type && type === 'theme' ? `color: var(--ant-color-text-theme);` : ``}
`;
