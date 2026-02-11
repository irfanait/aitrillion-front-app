import React from 'react';
import { StyleWrapper } from './style';
import { Grid } from 'antd';

const AitFieldWrapper = ({ padding, margin, children }) => {
  return (
    <StyleWrapper padding={padding} margin={margin}>
      {children}
    </StyleWrapper>
  );
};

export default AitFieldWrapper;
