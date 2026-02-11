import React from 'react';
import { StyleMainWrapper } from './style';

const MainWrapper = ({ padding, children }) => {
  return <StyleMainWrapper padding={padding}>{children}</StyleMainWrapper>;
};

export default MainWrapper;
