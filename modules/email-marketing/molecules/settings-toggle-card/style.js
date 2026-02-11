import Link from 'next/link';
import styled from 'styled-components';
import {Typography} from 'antd';
const { Title } = Typography;


export const StyleTitleWrap = styled(Title)`
font-size:18px;
line-height:21px;
${({ titlemargin }) => (titlemargin && `margin:${titlemargin};`)}
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

