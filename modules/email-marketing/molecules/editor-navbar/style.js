import { Space } from 'antd';
import styled from 'styled-components';
// Styled sticky header
export const NavbarWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    align-items: flex-start;
    .edit_btn {
      margin-right: 12px;
      margin-top: 6px;
    }
  }
`;

// Left breadcrumb text
export const BreadcrumbText = styled.div`
  display: flex;
  align-tems: center;
`;

// Right actions (icons + buttons)
export const Actions = styled(Space)`
  column-gap: 12px;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button.icon_btn {
    padding: 5px 8px !important;
  }
  button.icon_btn:not(:disabled):hover svg path {
    fill: var(--ant-color-primary-bg-hover);
  }

  button.icon_btn svg {
    vertical-align: middle !important;
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    button.icon_btn svg {
      width: 24px;
      height: 24px;
    }
  }
`;
