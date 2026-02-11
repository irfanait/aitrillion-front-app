import styled from 'styled-components';
import Link from 'next/link';

export const StyledLink = styled(Link)`
  ${({ size }) => size && 'font-size:' + size + 'px;'}
  ${({ weight }) => weight && 'font-weight:' + weight + ';'}
${({ color }) =>
    color && color === 'primary'
      ? `color:var(--ant-color-primary) !important;`
      : `color:${color}`}

& * {
    ${({ weight }) => weight && 'font-weight:' + weight + ';'}
  }

  &:hover {
    ${({ color }) =>
      color && color === 'primary'
        ? `color:var(--ant-color-primary-bg-hover) !important;`
        : `color:${color};`}
    ${({ hoverline }) =>
      hoverline && hoverline === true
        ? `text-decoration: underline;!important;`
        : `text-decoration: none!important;`}
  }
`;
