import React from 'react';
import { Empty, Select, Tooltip } from 'antd';
import { Wrapper, Label, FieldWrapper, ErrorText, LabelRow } from './style';

const AitAutocomplete = ({
  name = '',
  label = '',
  value = [],
  onChange,
  options = [],
  required = false,
  error = false,
  errorMessage = '',
  placeholder = 'Select options',
  labelIcon = null, // ✅ New icon prop
  tooltipText = '', // ✅ Optional tooltip
  noDataMessage = 'No results found', // ✅ new prop
  ...rest
}) => {
  return (
    <Wrapper>
      <LabelRow>
        <Label htmlFor={name}>
          {label} {required && <span className="field-required">*</span>}
        </Label>
        {labelIcon && (
          <Tooltip title={tooltipText}>
            <span style={{ cursor: 'pointer' }}>{labelIcon}</span>
          </Tooltip>
        )}
      </LabelRow>

      <FieldWrapper>
        <Select
          id={name}
          name={name}
          mode="multiple"
          allowClear
          showSearch
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ width: '100%' }}
          status={error ? 'error' : ''}
          optionFilterProp="label"
          notFoundContent={<Empty description={noDataMessage} />} // ✅ custom message
          {...rest}
        >
          {options.map((option) => (
            <Select.Option
              key={option.value}
              value={option.value}
              label={option.label}
            >
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </FieldWrapper>

      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default AitAutocomplete;
