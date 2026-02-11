import styled from 'styled-components';

export const FieldWrapper = styled('div')({
  marginBottom: '10px',
  // marginTop: '16px',
});

export const HeadingWrapper = styled.div`
  margin-top: 16px;
  h4{
    font-size:18px;
  }
`;

export const StyleSpan = styled.div`
color:var(--text-color-secondary-ii);
line-height: 18px;
`;


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
