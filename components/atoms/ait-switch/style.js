import styled from 'styled-components';
import { Switch } from 'antd';

export const StyledSwitch = styled(Switch)`
  min-width: 33px;
`;

export const StyledSwitchLabel = styled.label`
  margin-top: auto;
  margin-bottom: auto;
  line-height: 16px;
  ${({ fontweight }) =>
    fontweight ? `font-weight:${fontweight}` : `font-weight:400`};

  .label-tooltip {
    margin-bottom: 2px;
    color: var(--ant-color-text-label-primary);
    line-height: 16px;
  }
`;
