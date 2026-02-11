// style.js (for AitSelectBox)
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 14px;
`;

export const FieldWrapper = styled.div`
  .ant-select:not(.ant-select-multiple) {
    height: 40px;
  }
  .ant-select {
    color: var(--ant-color-text-contol);
    font-size: 14px;
  }

  .ant-select .ant-select-selection-search .ant-select-selection-search-input,
  .ant-select .ant-select-selection-placeholder {
    font-size: 14px !important;
  }

  .ant-select-selector {
    border: 1px solid #d3d6db;
    height: 36px;
    padding: 8px 16px;
    font-size: 13px;
  }
  .ant-select-multiple.ant-select-lg .ant-select-selection-item {
    height: 24px;
    line-height: 22px;
    font-size: 13px;
  }
  .ant-select-multiple .ant-select-selector {
    padding-left: 10px;
    padding-top: 1.2px !important;
    padding-bottom: 1.2px !important;
  }
  .ant-select-selection-item {
    color: var(--ant-color-text-contol);
    font-size: 14px;
    cursor: pointer;
  }
  .ant-select-dropdown .ant-select-item-option-content {
    color: var(--ant-color-text-contol);
    font-size: 14px;
  }
  .ant-select-multiple .ant-select-selector {
    padding-block: 5px;
  }
  .ant-select-selection-placeholder {
    font-weight: 400 !important;
  }

  .ant-select-item-option-disabled {
    color: #bfbfbf !important;
    background-color: #f5f5f5 !important;
    cursor: not-allowed !important;
    opacity: 0.7 !important;
  }

  .ant-select-item-option-disabled:hover {
    background-color: #f0f0f0 !important;
  }
`;

export const ErrorText = styled.div`
  color: var(--ant-color-text-error);
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 20px;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  .label-tooltip {
    margin-bottom: 2px;
    color: var(--ant-color-text-label-primary);
    line-height: 16px;
  }
`;

export const SubHelperText = styled.div`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  margin-bottom: ${({ marginBottom }) => marginBottom || '4px'};
`;
