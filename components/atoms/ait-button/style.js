import styled from 'styled-components';
import { Button } from 'antd';

export const StyledButton = styled(Button)`
  white-space: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  font-weight: ${({ fontweight }) => fontweight || '500'};
  padding: ${({ padding }) => padding || '8px 14px'};
  height: ${({ height }) => height || 'auto'};
  width: ${({ width }) => width || 'auto'};
  ${({ height }) => (height && `flex: 0 0 ${height};`) || ''}
  ${({ variant, color }) =>
    variant === 'filled' &&
    color === 'default' &&
    `border-color:#E7E8EB !important;`}
  
  > span {
    font-weight: inherit;
  }

  // display: inline-flex;

  ${({ bgColor }) => bgColor && `background-color: ${bgColor} !important;`}
  ${({ squareshape }) =>
    squareshape && `border-radius: ${squareshape} !important;`}
  

  &:hover {
    opacity: 0.9;
    ${({ variant, color }) =>
      variant === 'outlined' &&
      color === 'primary' &&
      `background:#E8F1FD !important;`}
    ${({ styleinput, variant, color }) =>
      styleinput === true &&
      variant === 'outlined' &&
      color === 'default' &&
      `color:var(--ant-button-color-text-default)!important;`}
  }

  /* ---------- DISABLED (Hover Off) ---------- */
  &:disabled {
    opacity: 0.55 !important;
    cursor: not-allowed !important;

    &:hover {
      /* Remove ALL hover effects */
      opacity: 0.55 !important;
      //  background: ${({ bgColor }) => bgColor || '#fff'} !important;
      // color: ${({ textColor }) => textColor || '#6e7f9d'} !important;
      //  border-color: ${({ bordercolor }) =>
        bordercolor || '#d3d6db'} !important;
      box-shadow: none !important;
    }
  }

  // @media (max-width: 768px) {
  //   padding: ${({ padding }) => padding || '6px 16px'};
  // }
`;

export const TagLabel = styled.span`
  background-color: ${(props) => props.tagcolor || '#1890ff'};
  color: rgb(42, 201, 137);
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
`;
