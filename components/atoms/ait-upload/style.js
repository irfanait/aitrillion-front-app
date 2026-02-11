// style.js (for AitInputBox)
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: ${({ labelFontWeight }) => labelFontWeight || '500'};
  font-size: ${({ labelFontSize }) => labelFontSize || '14px'};
  margin-bottom: ${({ labelSpacingBottom }) => labelSpacingBottom || '4px'};
  color: var(--ant-color-text-label-primary);
  line-height: 16px;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  .label-tooltip {
    margin-bottom: 3px;
    color: var(--ant-color-text-label-primary);
    line-height: 16px;
  }
`;

export const FieldWrapper = styled.div`
  .ant-input {
    padding: 10.8px 12px;
    font-size: 14px;
    font-weight: 400;
    color: var(--ant-color-text-contol);
    line-height: 1;
    border-radius: 6px;
  }
  textarea.ant-input {
    line-height: 19px;
  }
  .ant-input-search .ant-input-group-addon > .ant-input-search-button {
    width: 40px;
    height: 40px;
  }
  .ant-input-search
    .ant-input-group-addon
    > .ant-input-search-button:not(:disabled) {
    color: var(--ant-color-primary) !important;
    border-color: var(--ant-color-primary);
  }
  .ant-input-search
    .ant-input-group-addon
    > .ant-input-search-button:not(:disabled):hover {
    color: #fff !important;
    background-color: var(--ant-color-primary);
    border-color: var(--ant-color-primary);
  }
  .ant-input-suffix span {
    color: var(--ant-color-text-placeholder) !important;
  }
  /* Standard (modern browsers) */
  .ant-input::placeholder {
    font-size: 14px;
  }

  /* Chrome, Edge, Safari */
  .ant-input::-webkit-input-placeholder {
    font-size: 14px;
  }

  /* Firefox (older versions) */
  .ant-input::-moz-placeholder {
    font-size: 14px;
    opacity: 1; /* Firefox reduces opacity by default */
  }

  /* Internet Explorer 10–11 */
  .ant-input:-ms-input-placeholder {
    font-size: 14px;
  }

  /* Edge (Legacy) */
  .ant-input::-ms-input-placeholder {
    font-size: 14px;
  }
`;

export const ErrorText = styled.div`
  color: var(--ant-color-text-error);
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 16px;
`;

export const HelperText = styled.div`
  font-size: 12px;
  color: #6b7280; /* gray-500 */
  // margin-top: 4px;
`;

export const SubHelperText = styled.div`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  margin-bottom: ${({ marginBottom }) => marginBottom || '4px'};
`;

export const StylerightContent = styled.div`
  ${({ showpreviewicononly }) =>
    showpreviewicononly &&
    `.ant-image-mask-info {
     border-radius:4px;
    }
  .ant-image-mask-info {
    width: 14px;
    height: 14px;
    overflow: hidden;
    text-align: center;
    padding: 0px !important;   
  }
`};
`;
