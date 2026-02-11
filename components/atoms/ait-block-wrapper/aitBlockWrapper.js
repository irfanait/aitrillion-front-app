import React from 'react';
import { StyleWrapper } from './style';
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

const AitBlockWrapper = ({ padding, margin, children }) => {
  const screens = useBreakpoint();
  return (
    <StyleWrapper padding={padding} margin={margin} screens={screens}>
      {children}
    </StyleWrapper>
  );
};

export default AitBlockWrapper;
