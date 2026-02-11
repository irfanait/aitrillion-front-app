import React from 'react';
import { Input, Tooltip } from 'antd';
import {
  ErrorText,
  FieldWrapper,
  HelperText,
  Label,
  LabelRow,
  Wrapper,
  SubHelperText,
} from './style';

const { TextArea } = Input;

const AitTextAreaBox = ({
  name = '',
  placeholder = '',
  label = '',
  value,
  size,
  labelFontSize = '14px',
  labelSpacingBottom,
  required = false,
  error = false,
  errorMessage = '',
  helperText = '',
  labelSubText = false,
  labelIcon = null,
  tooltipText = '',
  ...rest
}) => {
  return (
    <Wrapper>
      {label && (
        <>
        <LabelRow>
          <Label
            labelFontSize={labelFontSize}
            labelSpacingBottom={labelSpacingBottom}
          >
            {label} {required && <span className="field-required">*</span>}
          </Label>
          {labelIcon && (
            <Tooltip title={tooltipText}>
              <span style={{ marginLeft: 8, cursor: 'pointer' }}>
                {labelIcon}
              </span>
            </Tooltip>
          )}
        </LabelRow>
        {labelSubText && <SubHelperText>{labelSubText || ''}</SubHelperText>}
        </>
      )}

      <FieldWrapper>
        <TextArea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          size={size}
          status={error ? 'error' : ''}
          {...rest}
        />
      </FieldWrapper>

      {!error && helperText && <HelperText>{helperText}</HelperText>}
      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default AitTextAreaBox;
