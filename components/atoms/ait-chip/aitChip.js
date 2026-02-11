import React from 'react';
import { ChipButton, IconWrap, StyledTooltip } from './style';
import { faToAntIcon } from '@/modules/customers/utils/segmentListIconMapper';

const AitChip = ({ label, iconClass, active, disabled, title, onClick }) => {
  const chipContent = (
    <ChipButton $active={active} disabled={disabled} onClick={onClick}>
      {<IconWrap>{faToAntIcon(iconClass)}</IconWrap>}
      <span>{label}</span>
    </ChipButton>
  );

  return title ? (
    <StyledTooltip title={title} placement="top" arrow>
      {chipContent}
    </StyledTooltip>
  ) : (
    chipContent
  );
};

export default AitChip;
