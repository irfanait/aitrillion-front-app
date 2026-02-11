import styled from 'styled-components';

export const StyleFormLeftWrapper = styled.div`
  //  position: relative;
  ${({ screens, padding }) =>
    screens?.md && padding
      ? `padding: ${padding};`
      : padding
        ? `padding:${padding};`
        : `padding:0px 0px;`}
  ${({ background }) =>
    background ? `background: ${background};` : `background:#fff;`}
// ${({ margin }) => margin && `margin: ${margin};`}




 ${({ screens }) =>
    !screens.md
      ? `height: auto;`
      : `height: calc(100vh - 310px);overflow-y: auto;border-right: 1px solid #f0f0f0;`}
`;
