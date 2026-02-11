'use client';
import React from 'react';
import { Modal, Typography } from 'antd';
import { CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { HeaderContainer, ModalContainer, Title, StyleModal } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
const { Text } = Typography;

// Main Modal Component
export const AitModal = ({
  title,
  bg,
  width,
  height,
  maxHeight,
  children,
  headerVisible = true,
  closeIconVisible = true,
  canDismiss = true,
  headerBg,
  headerHeight,
  headerBorderBottom = false,
  isHeaderAtCenter = false,
  setVisible,
  forMobileResponsive,
  open = false,
  showBackArrow,
  handleModalClose,
  centered = false,
  padding = '0px',
  headerPadding = 0,
  headerTitleLevel = 4,
  hideScrollbar,
  modalcontentpadding,
  closeiconspaceright,
  modalcontainerradius,
  modalBodyPosition = false,
  headerSubTitle = false,
  headerSubTitleName = '',
  ...rest
}) => {
  const onCancel = () => {
    if (!canDismiss) return;
    if (setVisible) setVisible(false);
    if (handleModalClose) handleModalClose();
  };

  return (
    <StyleModal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={false}
      width={width}
      centered={centered}
      headerTitleLevel={headerTitleLevel}
      hideScrollbar={hideScrollbar}
      modalcontentpadding={modalcontentpadding}
      closeiconspaceright={closeiconspaceright}
      modalBodyPosition={modalBodyPosition}
      {...rest}
    >
      <ModalContainer
        height={height}
        maxHeight={maxHeight}
        forMobileResponsive={forMobileResponsive}
        padding={padding}
        bg={bg}
        hideScrollbar={hideScrollbar}
        modalcontainerradius={modalcontainerradius}
      >
        {headerVisible && (
          <HeaderContainer
            headerBg={headerBg}
            headerHeight={headerHeight}
            headerBorderBottom={headerBorderBottom}
            headerPadding={headerPadding}
            closeiconspaceright={closeiconspaceright}
          >
            {showBackArrow && (
              <AitButton
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={handleModalClose}
              />
            )}

            <div>
              <Title
                level={headerTitleLevel}
                isHeaderAtCenter={isHeaderAtCenter}
              >
                {title}
              </Title>
              {headerSubTitle && (
                <Text type="secondary">{headerSubTitleName}</Text>
              )}
            </div>

            {closeIconVisible && (
              <AitButton
                className="modal-close-btn"
                icon={<CloseOutlined />}
                type="text"
                onClick={onCancel}
              />
            )}
          </HeaderContainer>
        )}
        {children}
      </ModalContainer>
    </StyleModal>
  );
};
