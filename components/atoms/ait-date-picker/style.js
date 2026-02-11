// style.js (for AitDatePicker)
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 4px;
  font-size: ${({ labelFontSize }) => labelFontSize || '14px'};
  color: ${({ error }) => (error ? 'var(--ant-color-text-placeholder)' : 'var(--ant-color-text-label-primary)')};
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  label{
  color:var(--ant-color-text-label-primary)
  }
`;

export const FieldWrapper = styled.div`
  .ant-picker {
    min-height: 40px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 1.5715;
    border-radius: 6px;
    width: 100%;
  }

  .ant-picker-input > input::placeholder {
    color: var(--ant-color-text-placeholder);
    font-size: 14px;
  }

  .ant-picker-status-error {
    border-color:  var(--ant-color-text-error) !important;
    box-shadow: none !important;
  }

  .ant-picker-status-error .ant-picker-input > input {
    color: var(--ant-color-text-error);
  }
`;

export const ErrorText = styled.div`
  color:  var(--ant-color-text-error);
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 20px;
`;
