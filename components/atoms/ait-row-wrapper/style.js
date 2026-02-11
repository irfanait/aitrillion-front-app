import styled from 'styled-components';

export const StyleRowWrapper = styled.div`
 ${({ screens, padding }) =>
  (screens?.xs && padding?.xs)
    ? `padding-left: ${padding.xs}px; padding-right: ${padding.xs}px;`
    : (screens?.sm && padding?.sm)
    ? `padding-left: ${padding.sm}px; padding-right: ${padding.sm}px;`
    : (screens?.md && padding?.md)
    ? `padding-left: ${padding.md}px; padding-right: ${padding.md}px;`
    : `padding-left: 0px; padding-right: 0px;`
}


  ${({ margin }) => margin && `margin: ${margin};`}
`;
