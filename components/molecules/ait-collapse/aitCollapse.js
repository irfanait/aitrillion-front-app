import React from 'react';
import { Collapse, Divider, Grid } from 'antd';
import { StyledCollapse } from './style';
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

const AitCollapse = ({
  // forceRender = false,
  firstitemtopborder,
  itemHeaderPadding = { xs: '5px 16px', sm: '5px 24px', md: '5px 24px' },
  firstItemTopspacing = '20px',
  firstItemBottomspacing = '20px',
  borderTop,
  borderBottom,
  itemBodyPadding = { xs: '5px 16px', sm: '5px 24px', md: '0px 24px' },
  collapseIconTopSpacing = '14px',
  headerLeftRightTopSpacing = '14px',
  headerMinHeight = '48px',
  itemSpacing = '12px',
  bodyBorderTop,
  titlefontsize,
  minimumCustomerCount = Number(
    process.env.NEXT_PUBLIC_CREATE_AB_MINIMUM_CUSTOMER || 0
  ),
  panels = [],
  headericonalign = 'center',
  extraiconbg = '#EEF2F5',
  borderRadius = '0',
  maxHeight,
  headeralignvertival,
  bordered = false,
  itemborderedandround = false,
  ...restProps
}) => {
  const screens = useBreakpoint();

  return (
    <StyledCollapse
      // forceRender={forceRender}
      firstitemtopborder={firstitemtopborder}
      maxHeight={maxHeight}
      borderRadius={borderRadius}
      itemHeaderPadding={itemHeaderPadding}
      firstItemTopspacing={firstItemTopspacing}
      firstItemBottomspacing={firstItemBottomspacing}
      borderTop={borderTop}
      borderBottom={borderBottom}
      itemBodyPadding={itemBodyPadding}
      collapseIconTopSpacing={collapseIconTopSpacing}
      headerLeftRightTopSpacing={headerLeftRightTopSpacing}
      headerMinHeight={headerMinHeight}
      itemSpacing={itemSpacing}
      minimumCustomerCount={minimumCustomerCount}
      bodyBorderTop={bodyBorderTop}
      titlefontsize={titlefontsize}
      headericonalign={headericonalign}
      extraiconbg={extraiconbg}
      screens={screens}
      headeralignvertival={headeralignvertival}
      bordered={bordered}
      itemborderedandround={itemborderedandround}
      {...restProps}
    >
      {panels.map(({ key, title, extra, icon, children }, index) => (
        <Panel
          forceRender
          key={key}
          header={
            <div className="custom-header-content">
              <div className="header-left">
                {icon && <span className="header-icon">{icon}</span>}
                {title}
              </div>
              <div className="header-right">{extra}</div>
            </div>
          }
        >
          {children}
        </Panel>
      ))}
    </StyledCollapse>
  );
};
export default AitCollapse;
