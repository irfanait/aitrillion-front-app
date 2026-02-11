import styled from 'styled-components';
import {Typography} from 'antd';
import Link from 'next/link';
const { Title } = Typography;

export const LayoutContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;

  //   @media (max-width: 768px) {
  //     ${({ padding }) =>
    padding?.xs ? `padding: ${padding.xs};` : 'padding:24px 16px 24px 16px;'}
  //   }
  //
`;

export const StyleTitleWrap = styled(Title)`
font-size:18px;
line-height:21px;
`;

export const TitleStyle = styled.span`
font-weight:500;
`;

export const LinkStyle = styled(Link)`
display:inline-block;
position: relative;
top: auto;
transform: translateY(16%);
`;
