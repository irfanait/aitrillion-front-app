import React from 'react'
import { StyleFormLeftWrapper } from './style'
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

const FormLeftWrapper = ({padding, margin, children, background, scroll, height}) => {
 const screens = useBreakpoint();
  return (
    <StyleFormLeftWrapper padding={padding} margin={margin} screens={screens}  background={background}>
        {children}
    </StyleFormLeftWrapper>
  )
}

export default FormLeftWrapper