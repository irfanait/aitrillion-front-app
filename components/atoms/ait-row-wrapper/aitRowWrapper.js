import React, { useEffect } from 'react';
import { StyleRowWrapper } from './style';
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

const AitRowWrapper = ({
  padding = { xs: 0, sm: 0, md: 0 },
  margin,
  children,
}) => {
  const screens = useBreakpoint();

  return (
    <StyleRowWrapper padding={padding} margin={margin} screens={screens}>
      {children}
    </StyleRowWrapper>
  );
};

export default AitRowWrapper;
