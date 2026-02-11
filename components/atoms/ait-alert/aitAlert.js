import React from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import { StyleAlert, StyledAlertMessageDiv, AlertButtonStyle } from './style';
import AitButton from '../ait-button/aitButton';
import { ModalAlertIcon } from '@/modules/loyalty-rewards/svg-icons';
import AitLink from '../ait-link/aitLink';

const AitAlert = ({
  message,
  type,
  banner,
  style,
  bgcolor,
  barpadding,
  barfontsize,
  color,
  iconcolor,
  hidedefaulticon,
  hascustomicon,
  barcolor,
  hascustomclass,
  customicon,
  link, // { href, text }
  buttonText, // string
  buttonColor = 'default',
  buttonVariant = 'link',
  onClick,
  buttonSize = 'small',
  buttonstyle,
  buttonhoverstyle,
  justify,
  textAlign,
  border,
  borderradius,
  note,
  block = 'flex',
  btnLoading,
  worningIcon = false,
  linkfontwight = '400',
  gap = 0,
  contentAlign = 'center',
  alignicon = 'center',
  icontopspacing = 5,
  ...rest
}) => {
  return (
    <StyleAlert
      type={type}
      banner={banner}
      contentAlign={contentAlign}
      style={style}
      bgcolor={bgcolor}
      color={color}
      barpadding={barpadding}
      barfontsize={barfontsize}
      iconcolor={iconcolor}
      hidedefaulticon={hidedefaulticon}
      hascustomicon={hascustomicon}
      barcolor={barcolor}
      buttonVariant={buttonVariant}
      // onClick={onClick}
      buttonSize={buttonSize}
      buttonstyle={buttonstyle}
      buttonhoverstyle={buttonhoverstyle}
      justify={justify}
      textAlign={textAlign}
      border={border}
      borderradius={borderradius}
      note={note}
      block={block}
      alignicon={alignicon}
      icontopspacing={icontopspacing}
      hascustomclass={hascustomclass}
      message={
        <StyledAlertMessageDiv
          className={hascustomclass ? `${hascustomclass}` : ''}
          barfontsize={barfontsize}
          textAlign={textAlign}
          block={block}
          gap={gap}
          alignicon={alignicon}
          icontopspacing={icontopspacing}
        >
          {hascustomicon && customicon && (
            <span className="alert-custom-icon">{customicon}</span>
          )}
          {worningIcon && (
            <span className="alert-custom-icon">
              {' '}
              <ModalAlertIcon color="#121210ff" />
            </span>
          )}
          <span>
            {note && <strong>Note: </strong>}
            {message}
          </span>

          {/* 🔹 Render Button if buttonText + onClick provided */}
          {buttonText && onClick && (
            <AlertButtonStyle
              color={buttonColor}
              variant={buttonVariant ? buttonVariant : 'link'}
              onClick={onClick}
              size={buttonSize}
              buttonstyle={buttonstyle}
              buttonhoverstyle={buttonhoverstyle}
              loading={btnLoading}
              disabled={btnLoading}
            >
              {buttonText}
            </AlertButtonStyle>
          )}

          {/* 🔹 Render Link if link prop provided */}
          {link?.href && link?.text && (
            <AitLink
              weight={linkfontwight}
              href={link.href}
              target={link?.target || ''}
              style={{
                marginLeft: 8,
                textDecoration: link?.underline || 'underline',
              }}
            >
              {link.text}
            </AitLink>
          )}
        </StyledAlertMessageDiv>
      }
      {...rest}
    />
  );
};

export default AitAlert;
