import React from 'react';
import { StylePopover } from './style';

const AitPopover = ({
  content,
  trigger,
  placement,
  overlayClassName,
  open,
  onOpenChange,
  children,
}) => {
  return (
    <StylePopover
      content={content}
      trigger={trigger}
      placement={placement}
      overlayClassName={overlayClassName}
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </StylePopover>
  );
};

export default AitPopover;
