import React from 'react';
import { Input, Tooltip } from 'antd';
import {
  ErrorText,
  Label,
  Wrapper,
  FieldWrapper,
  LabelRow,
  HelperText,
  SubHelperText,
} from './style';

const AitInputBox = ({
  name = '',
  placeholder = '',
  label = '',
  value,
  size = 'large',
  labelFontSize = '14px',
  labelFontWeight = '500',
  labelSpacingBottom,
  required = false,
  passwordInput = false,
  error = false,
  errorMessage = '',
  helperText = '', // ✅ New prop for helper text
  labelIcon = null, // ✅ New prop
  tooltipText = '', // Optional tooltip content
  labelSubText = false,
  textArea = false,
  search = false,
  ...rest
}) => {
  const InputComponent = passwordInput
    ? Input.Password
    : textArea
      ? Input.TextArea
      : search
        ? Input.Search
        : Input;

  return (
    <Wrapper>
      {label && (
        <>
          <LabelRow>
            <Label
              labelFontSize={labelFontSize}
              labelFontWeight={labelFontWeight}
              labelSpacingBottom={labelSpacingBottom}
            >
              {label}
            </Label>
            {labelIcon && (
              <Tooltip title={tooltipText} className="label-tooltip">
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {labelIcon}
                </span>
              </Tooltip>
            )}
            {required && (
              <span
                className="field-required"
                style={{ position: 'relative', top: '-2px' }}
              >
                *
              </span>
            )}
          </LabelRow>
          {labelSubText && <SubHelperText>{labelSubText || ''}</SubHelperText>}
        </>
      )}

      <FieldWrapper>
        <InputComponent
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          size={size}
          status={error ? 'error' : ''}
          autoComplete="off"
          // style={{ background: '#fff' }}
          {...rest}
        />
      </FieldWrapper>

      {/* ✅ Show helper text when available */}
      {!error && helperText && <HelperText>{helperText}</HelperText>}

      {/* ✅ Show error message when error exists */}
      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default AitInputBox;
