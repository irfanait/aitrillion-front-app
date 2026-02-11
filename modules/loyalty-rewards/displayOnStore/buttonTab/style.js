import styled from 'styled-components';

export const PreviewLoyaltySiteBtn = styled.div`
  position: absolute;
  //left: 24px;
  //right: auto;
  bottom: 24px;
  padding: 5px 16px 5px 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 22px;
  z-index: 1;
  gap: 7px;

  &.right {
    right: 15px;
    left: auto;
  }
  &.left {
    left: 10px;
    right: auto;
  }
  &.left-center {
    transform-origin: left center;
    left: 20px;
    right: auto;
    //top: auto;
    bottom: auto;
    rotate: 90deg;
    ${({ buttonTabState }) =>
      buttonTabState?.percent && `top: ${buttonTabState?.percent}%;`}
  }
  &.right-center {
    transform-origin: right center;
    right: 25px;
    left: auto;
    //top: auto;
    bottom: auto;
    rotate: 90deg;
    ${({ buttonTabState }) =>
      buttonTabState?.percent && `top: ${buttonTabState?.percent}%;`}
  }
`;
export const LoyaltyButtonText = styled.span`
  font-size: 14px;
`;
