import React from 'react';
import { StyleTooltip } from './style';

const AitTooltip = ({
  title,
  placement,
  trigger,
  overlayClassName,
  children,
}) => {
  return (
    <StyleTooltip
      title={title}
      placement={placement}
      trigger={trigger}
      overlayClassName={overlayClassName}
    >
      {children}
    </StyleTooltip>
  );
};

export default AitTooltip;
