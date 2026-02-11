import { Dropdown, Tag } from 'antd';
import styled from 'styled-components';

export const StyledDropdown = styled(Dropdown)`
  .field-popover-full {
    padding: 10px;
  }

  .ant-dropdown {
    // transition:
    //  opacity 0.15s ease,
    // transform 0.15s ease;
  }

  .field-popover-full {
    //   position: absolute !important;
    //   inset: auto auto auto auto !important;
    //  transform: none !important;
  }

  // .field-popover-full .ant-dropdown-menu {
  //   background: #fff;
  //   border-radius: 12px;
  // }
`;

export const StyledFieldPopover = styled.div`
  display: inline-flex;
`;

export const StyledFieldPopoverInner = styled.div`
  max-height: 46vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ColumnWarpper = styled.div`
  column-count: 4;

  @media (max-width: 768px) {
    column-count: 2;
  }
  @media (max-width: 576px) {
    column-count: 1;
  }
`;
