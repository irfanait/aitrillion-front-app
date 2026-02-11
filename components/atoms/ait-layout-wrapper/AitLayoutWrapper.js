import React, { Children } from 'react'
import { LayoutContainer } from './style'

const AitLayoutWrapper = ({children}) => {
  return (
    <LayoutContainer>
        {children}
    </LayoutContainer>
  )
}

export default AitLayoutWrapper