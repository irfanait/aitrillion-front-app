import styled from 'styled-components';
import { Dropdown } from 'antd';

export const StyledDropdownButton = styled(Dropdown.Button)`
  &.ait-dropdown-button {
    border-radius: 6px;
    font-weight: 500;
    height: 38px;

    .ant-btn {
      height: 38px;
      color: #1a73e8;
      font-weight: 400;
      border: 1px solid #1a73e8;
    }
  }
`;
