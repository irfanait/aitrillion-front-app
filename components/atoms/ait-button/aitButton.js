/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { StyledButton, TagLabel } from './style';
import { useSelector } from 'react-redux';
import { trackEvent } from '@/utils/trackEvent';

const AitButton = ({
  title,
  icon,
  type = 'default',
  bgColor,
  htmlType,
  textColor,
  bordercolor,
  rightTagLabel,
  rightTagColor = '#1890ff',
  hovertextcolor = '',
  hoverbgcolor = '',
  squareshape = '',
  padding,
  height,
  width,
  fontweight,
  onClick,
  'data-amp-event-name': ampEventName,
  styleinput = false,
  ...rest
}) => {
  const jwt = useSelector((s) => s?.jwtState?.login_auth) || {};

  const handleClick = useCallback(
    (e) => {
      if (onClick) onClick(e);

      // ✅ Fallback event name
      const eventName =
        ampEventName ||
        `Click_${String(title || 'Button')
          .trim()
          .replace(/\s+/g, '_')}`;

      // ✅ Descriptive button label for analytics dashboard
      const buttonName = title || rest?.id || rest?.name || 'Unnamed Button';

      // ✅ Track event with rich metadata
      trackEvent(eventName, {
        button_name: buttonName,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        page_path:
          typeof window !== 'undefined' ? window.location.pathname : '',
        shop_name: jwt?.shop_name,
        login_id: jwt?.login_id,
        email: jwt?.email,
        user_role: jwt?.user_role || '',
      });
    },
    [onClick, ampEventName, title, jwt, rest]
  );

  return (
    <StyledButton
      type={type}
      htmlType={htmlType || 'button'}
      icon={icon}
      bgColor={bgColor}
      textColor={textColor}
      bordercolor={bordercolor}
      hovertextcolor={hovertextcolor}
      hoverbgcolor={hoverbgcolor}
      squareshape={squareshape}
      padding={padding}
      height={height}
      width={width}
      fontweight={fontweight}
      onClick={handleClick}
      styleinput={styleinput}
      {...rest}
    >
      {title}
      {rightTagLabel && (
        <TagLabel tagcolor={rightTagColor}>{rightTagLabel}</TagLabel>
      )}
    </StyledButton>
  );
};

export default AitButton;
