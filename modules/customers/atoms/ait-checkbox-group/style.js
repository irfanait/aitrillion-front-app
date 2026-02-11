import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-bottom: 16px;
`;

export const LabelRow = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: var(--ant-color-text-primary);
`;

export const Label = styled.label``;

export const FieldWrapper = styled.div``;

export const ErrorText = styled.div`
  color: var(--ant-color-text-error);
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 20px;
`;
