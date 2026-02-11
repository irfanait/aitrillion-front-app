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

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FieldWrapper = styled.div`
  .ant-select {
    width: 100%;
    min-height: 40px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 6px;
  }

  .ant-select-selector {
    min-height: 40px !important;
    display: flex;
    align-items: center;
    padding: 4px 12px !important;
    border-radius: 6px !important;
  }

  .ant-select-selection-item {
    font-weight: 400;
    color: #000;
  }

  .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
  }

  .ant-select-multiple .ant-select-selector {
    overflow-y: auto;
    // max-height: 80px; /* Adjust if needed */ this is for scrollable selected Items
  }

  .ant-select-selection-overflow {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .ant-select-multiple .ant-select-selection-item {
    font-size: 13px;
    padding: 2px 8px;
    border-radius: 4px;
    background-color: #f0f0f0;
    margin-inline-end: 4px;
  }
`;

export const ErrorText = styled.div`
  color: var(--ant-color-text-error);
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 20px;
`;
