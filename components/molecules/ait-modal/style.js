import { Modal, Typography } from 'antd';
import styled from 'styled-components';

// Styled components

export const StyleModal = styled(Modal)`
  .ant-modal-content {
    width: ${({ width }) => (width && `${width}px`) || 'auto'};
    max-width: 100%;
    padding: ${({ modalcontentpadding }) =>
      (modalcontentpadding && `${modalcontentpadding}`) ||
      '20px 25px 30px 25px'};
  }
  .ant-modal-body {
    position: ${({ modalBodyPosition }) =>
      modalBodyPosition ? `${modalBodyPosition}` : 'relative !important'};
  }
  .ant-modal-footer {
    display: none !important;
  }
`;

export const ModalContainer = styled.div`
  width: 100%;
  height: ${({ height }) => height || 'auto'};
  max-height: ${({ maxHeight }) => maxHeight || 'auto'};
  padding: ${({ padding }) =>
    typeof padding === 'number' ? `${padding}px` : padding || '0'};
  border-radius: ${({ modalcontainerradius }) =>
    modalcontainerradius ? modalcontainerradius : '0px'};
  background-color: ${({ bg }) => (typeof bg === 'string' ? bg : '#fff')};
  overflow-y: ${({ hideScrollbar }) =>
    (hideScrollbar && 'hidden') || 'visible'};
  scrollbar-width: ${({ hideScrollbar }) => (hideScrollbar && 'none') || '6px'};
  ::-webkit-scrollbar {
    width: ${({ hideScrollbar }) => (hideScrollbar && '0px') || '6px'};
  }

  @media (max-width: 768px) {
    width: ${({ forMobileResponsive }) =>
      forMobileResponsive ? '100%' : 'auto'};
    height: ${({ forMobileResponsive }) =>
      forMobileResponsive ? '100vh' : 'auto'};
    padding: 0;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ headerPadding }) => headerPadding || '0px'};
  background: ${({ headerBg }) => headerBg || '#fff'};
  border-bottom: ${({ headerBorderBottom }) =>
    headerBorderBottom ? '1px solid #f0f0f0' : 'none'};

  .modal-close-btn {
    position: absolute;
    left: auto;
    right: ${({ closeiconspaceright }) => closeiconspaceright || '0px'};
    top: 0px;
    color: #c1d0ee;
    background: none;
    padding: 0px 0px 0px 15px;
  }
  .modal-close-btn:hover {
    background: none !important;
    color: var(--ant-color-text-primary);
  }
`;

export const Title = styled(Typography.Title)`
  && {
    color: var(--ant-color-text-primary);
    margin: 0;
    text-align: ${({ isHeaderAtCenter }) =>
      isHeaderAtCenter ? 'center' : 'left'};
    flex: 1;
  }
`;
