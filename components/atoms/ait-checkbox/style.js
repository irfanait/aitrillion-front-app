import { Checkbox } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-bottom: ${({ marginbottom }) =>
    marginbottom ? `${marginbottom}px` : `0px`};
`;

export const LabelRow = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: ${({ fontweight }) => (fontweight ? fontweight : `500`)};
  font-size: 14px;
  line-height: 16px;
  color: var(--ant-color-text-default);
`;

export const Label = styled.label``;

export const FieldWrapper = styled.div``;

export const StyleCheckbox = styled(Checkbox)`
  > .ant-checkbox {
    align-self: start;
    margin-top: 3px;
    margin-bottom: auto;
  }
`;

export const ErrorText = styled.div`
  color: var(--ant-color-text-error);
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 20px;
`;
