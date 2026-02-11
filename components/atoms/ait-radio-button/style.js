import { Radio } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  ${({ marginbottom }) =>
    marginbottom ? ` margin-bottom:${marginbottom}px` : ` margin-bottom:0px;`}
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0px;
`;

export const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  color: #1c1c1c;
  line-height: 16px;
  margin-bottom: 4px;
`;

export const FieldWrapper = styled.div`
  .ant-radio-group {
    ${({ isRowCol }) =>
      isRowCol
        ? `
        width:100%
      ;      
      `
        : `
      gap: 16px; display: flex;flex-wrap: wrap;
      /* Optional: add vertical layout with class */
    &.vertical {
      flex-direction: column;
      gap: 8px;
    }/* Optional: add vertical layout with class */
    &.vertical {
      flex-direction: column;
      gap: 8px;
    }
      `}
  }

  .ant-input,
  .ant-radio-wrapper {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .radio-helpertext {
      line-height: 16px;
    }
    .radio-helpertext span {
      line-height: inherit;
    }
  }
`;

export const ErrorText = styled.div`
  color: var(--ant-color-text-error);
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 20px;
`;

export const StyledRadio = styled(Radio)`
  width: 100%;
  gap: 10px;
  > .ant-radio {
    align-self: start;
    margin-top: 3px;
    margin-bottom: auto;
    transform: none !important;
  }
  > .ant-radio-label {
    padding-inline-start: 0px !important;
    padding-inline-end: 0px !important;
    width: 100%;
    color: var(--ant-color-text-label-primary);
    font-size: 14px;
    font-weight: ${({ fontweight }) => (fontweight ? `${fontweight}` : `400`)};
    line-height: 16px;
  }
`;
