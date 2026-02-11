import styled from 'styled-components';

export const StyleWrapper = styled.div`
  ${({ padding }) => padding && `padding: ${padding};`}
  ${({ margin }) =>
    margin ? `margin: ${margin};` : `margin: 0px 0px 20px 0px;`}
`;
