import React from 'react';
import { Checkbox, Tooltip } from 'antd';
import {
  Wrapper,
  LabelRow,
  ErrorText,
  FieldWrapper,
  StyleCheckbox,
} from './style';

const AitCheckboxButton = ({
  name = '',
  label = '',
  labelIcon = null,
  tooltipText = '',
  value = false,
  onChange,
  required = false,
  error = false,
  errorMessage = '',
  disabled = false,
  marginbottom = 16,
  fontweight = '500',
  ...rest
}) => {
  return (
    <Wrapper marginbottom={marginbottom} fontweight={fontweight}>
      <FieldWrapper>
        <StyleCheckbox
          id={name}
          name={name}
          checked={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        >
          <LabelRow fontweight={fontweight}>
            {label}
            {required && (
              <span className="field-required" style={{ marginLeft: 4 }}>
                *
              </span>
            )}
            {labelIcon && tooltipText && (
              <Tooltip title={tooltipText}>
                <span style={{ marginLeft: 8, cursor: 'pointer' }}>
                  {labelIcon}
                </span>
              </Tooltip>
            )}
          </LabelRow>
        </StyleCheckbox>
      </FieldWrapper>

      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default AitCheckboxButton;
