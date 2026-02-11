import { Col, Row, Typography } from 'antd';
import Card from 'antd/es/card/Card';
import Link from 'next/link';
import styled from 'styled-components';
const { Text } = Typography;

export const StyleAllModulesWrapper = styled.div`
padding:30px
`;

export const StyleModuleCard = styled(Card)`
box-shadow: ${({ boxshadow }) => boxshadow || 'none'};
 a:hover{
 text-decoration:none
 }
svg{
width: ${({ iconwidth }) => iconwidth || 'auto'};
height: ${({ iconheight }) => iconheight || 'auto'};
}

&.module-disabled svg {
    filter: grayscale(1);
  }

.module-locked{
position:absolute;
top:5px;
right:5px;
}

`;

export const StyleModuleCardText = styled(Text)`
 font-size: ${({ bodyfontsize }) => typeof bodyfontsize === 'number' ? `${bodyfontsize}px` : bodyfontsize || '14px'};
 line-height: ${({ bodylineheight }) => bodylineheight || 'inherit'};

`;
