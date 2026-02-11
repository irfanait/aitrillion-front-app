import styled from 'styled-components';

export const StyleWrapper = styled.div`
  ${({ screens, padding }) =>
    screens?.md && padding
      ? `padding: ${padding};`
      : padding
        ? `padding:${padding}`
        : `padding:0px 0px;`}
  ${({ margin }) => margin && `margin: ${margin};`}
`;
