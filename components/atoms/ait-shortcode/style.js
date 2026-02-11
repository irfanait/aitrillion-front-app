import styled from 'styled-components';
import { Alert, Button, Flex } from 'antd';

export const StyleShortCode = styled.div`
  ${({ block }) => (block ? 'width:100%' : 'width:auto;display:inline')}
`;

export const StyleFlex = styled(Flex)`
  ${({ screens, cardpadding }) =>
    screens?.xs
      ? `

      padding: ${cardpadding?.xs};
  
  `
      : screens?.sm
        ? `
  
      padding: ${cardpadding?.sm};
   
  `
        : screens?.md
          ? `
  
      padding: ${cardpadding?.md};
   
  `
          : `
  
       padding: ${cardpadding?.sm};
    
  `}
`;
