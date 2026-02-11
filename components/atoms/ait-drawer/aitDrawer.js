import React from 'react';
import { Drawer } from 'antd';
import { CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import {
  DrawerContainer,
  DrawerHeader,
  DrawerTitle,
  DrawerWrapper,
} from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';

const AitDrawer = ({
  title,
  width,
  placement = 'right',
  children,
  open = false,
  setVisible,
  canDismiss = true,
  closeIconVisible = true,
  showBackArrow = false,
  handleDrawerClose,
  headerVisible = true,
  headerBg,
  headerHeight,
  headerBorderBottom = true,
  isHeaderAtCenter = false,
  forMobileResponsive,
  padding = 0,
  topspacing,
  ...rest
}) => {
  const onClose = () => {
    if (!canDismiss) return;
    if (setVisible) setVisible(false);
    if (handleDrawerClose) handleDrawerClose();
  };

  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      closable={false}
      width={width}
      placement={placement}
      topspacing={topspacing}
      //className="custom-drawer-wrapper"
      zIndex={1500}
      {...rest}
      style={{ maxWidth: '100%' }}
    >
      <DrawerContainer
        width={width}
        forMobileResponsive={forMobileResponsive}
        padding={padding}
      >
        {headerVisible && (
          <DrawerHeader
            headerBg={headerBg}
            headerHeight={headerHeight}
            headerBorderBottom={headerBorderBottom}
          >
            {showBackArrow && (
              <AitButton
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={handleDrawerClose}
              />
            )}
            <DrawerTitle level={4} isHeaderAtCenter={isHeaderAtCenter}>
              {title}
            </DrawerTitle>
            {closeIconVisible && (
              <AitButton
                icon={<CloseOutlined />}
                type="text"
                onClick={onClose}
              />
            )}
          </DrawerHeader>
        )}
        {children}
      </DrawerContainer>
    </DrawerWrapper>
  );
};

export default AitDrawer;
