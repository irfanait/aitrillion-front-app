import styled from 'styled-components';
import { Alert, Button } from 'antd';

export const StyleAlert = styled(Alert)`
  position: relative;
  border: ${({ border }) => !border && 'none'};
  border-radius: ${({ borderradius }) => !borderradius && '0px'};
  ${({ barpadding }) =>
    barpadding ? `padding: ${barpadding}` : `padding:6px 15px 6px 15px`};

  display: ${({ block }) => (block ? block : 'flex')};
  align-items: center;

  ${({ bgcolor }) => bgcolor && `background: ${bgcolor}`};
  ${({ color }) => color && `color: ${color}`};

  .anticon {
    ${({ alignicon }) =>
      alignicon ? `align-self: ${alignicon}` : 'align-self:center'};
    ${({ icontopspacing }) =>
      icontopspacing && `margin-top: ${icontopspacing}px`};
  }

  /* 🔹 Left bar */
  ${({ barcolor }) =>
    barcolor &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: ${barcolor};
      border-radius: 0;
    }
  `}

  .ant-alert-icon {
    ${({ iconcolor }) => iconcolor && `color: ${iconcolor}`};
    ${({ hidedefaulticon }) => hidedefaulticon && `display:none`};
  }

  ${({ hascustomicon }) =>
    hascustomicon &&
    `.alert-custom-icon {
        margin-right: 8px;
        display: flex;
        align-items: center;
        font-size: 16px;
      }
    `};

  .ant-alert-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: ${({ justify }) =>
      justify ? justify : `center`}; /* 🔹 horizontal centering */
  }
`;

export const StyledAlertMessageDiv = styled.div`
  display: ${({ block }) => (block ? block : 'flex')};
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${({ gap }) => (gap ? `${gap}px` : '0px')};
  flex: 1; /* 🔹 allow it to grow and fill */
  text-align: ${({ textAlign }) => (textAlign ? textAlign : `center`)};

  ${({ barfontsize }) =>
    barfontsize ? `font-size: ${barfontsize}px` : `font-size: 14px`};
  line-height: normal;

  &.alert_meg_div_responsive {
    flex-wrap: wrap;
    text-align: left;
    display: inline-block;
  }

  @media (max-width: 768px) {
    line-height: 18px;
  }
`;

export const AlertButtonStyle = styled(Button)`
  ${({ buttonstyle }) => buttonstyle && buttonstyle};
  ${({ buttonstyle }) =>
    buttonstyle?.color
      ? `color:${buttonstyle.color}`
      : `color:white !important`};
  ${({ variant }) =>
    variant && variant === 'link'
      ? `text-decoration:underline !important`
      : `text-decoration:none !important`};

  > span {
    ${({ buttonstyle }) =>
      buttonstyle?.fontWeight
        ? `font-weight:${buttonstyle.fontWeight}`
        : `font-weight:500`};
  }

  &:hover {
    ${({ buttonhoverstyle }) => buttonhoverstyle && buttonhoverstyle};
  }
`;
