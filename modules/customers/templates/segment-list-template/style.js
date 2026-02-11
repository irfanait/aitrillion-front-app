// style.js
import styled from 'styled-components';

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

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  > div {
    width: 100%;
  }
`;
