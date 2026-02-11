import styled from 'styled-components';

export const StyleMainWrapper = styled.div`
  background: #fafcff !important;
  ${({ padding }) =>
    padding?.md ? `padding: ${padding.md};` : 'padding:24px 25px 10px 25px;'}

  @media (max-width: 1211px) {
    ${({ padding }) =>
      padding?.sm ? `padding: ${padding.sm};` : 'padding:15px 25px 24px 25px;'}
  }

  @media (max-width: 768px) {
    ${({ padding }) =>
      padding?.xs ? `padding: ${padding.xs};` : 'padding:10px 16px 24px 16px;'}
  }
`;
