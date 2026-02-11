// AitDatePicker.jsx
import React from 'react';
import { DatePicker } from 'antd';
import { Wrapper, Label, ErrorText, FieldWrapper } from './style';

const AitDatePicker = ({
  name = '',
  placeholder = '',
  label = '',
  value,
  required = false,
  error = false,
  errorMessage = '',
  onChange,
  onBlur,
  format = 'MM/DD/YYYY',
  picker,
  showTime = true,
  ...rest
}) => {
  return (
    <Wrapper>
      {label && (
        <Label htmlFor={name}>
          {label} {required && <span className="field-required">*</span>}
        </Label>
      )}
      <FieldWrapper>
        <DatePicker
          id={name}
          format={format}
          showTime={showTime ? { format: 'h:mm A' } : false}
          onChange={(date) => {
            if (onChange) onChange(date || null); // ✅ keep moment in Formik
          }}
          picker={picker || 'date'}
          name={name}
          value={value || null} // value is moment, not string
          placeholder={placeholder}
          status={error ? 'error' : ''}
          style={{ width: '100%' }}
          onBlur={() => {
            if (onBlur) onBlur({ target: { name } });
          }}
          {...rest}
        />
      </FieldWrapper>
      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default AitDatePicker;
