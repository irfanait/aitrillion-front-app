import React from 'react';
import { Empty, Select, Tooltip } from 'antd';
import {
  ErrorText,
  Label,
  Wrapper,
  FieldWrapper,
  LabelRow,
  SubHelperText,
} from './style';

const { Option } = Select;

const AitSelectBox = ({
  name = '',
  label = '',
  value,
  onChange,
  options = [],
  required = false,
  error = false,
  loading = false,
  errorMessage = '',
  placeholder = 'Select an option',
  noDataMessage = 'No results found', // ✅ new prop
  allowClear = true,
  extraStyle = {},
  FieldWrapperStyle = false,
  showSearch = true,
  labelIcon = null, // ✅ New prop
  tooltipText = '',
  labelSubText = false,
  size,
  ...rest
}) => {
  return (
    <Wrapper style={extraStyle}>
      {label && (
        <>
          <LabelRow>
            <Label htmlFor={name}>
              {label} {required && <span style={{ color: 'red' }}>*</span>}
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
          </LabelRow>
          {labelSubText && <SubHelperText>{labelSubText || ''}</SubHelperText>}
        </>
      )}
      <FieldWrapper style={FieldWrapperStyle || {}}>
        <Select
          size={size || 'large'}
          id={name}
          name={name}
          loading={loading}
          value={value || undefined} // Fixes placeholder issue
          onChange={onChange}
          placeholder={placeholder}
          style={{ width: '100%' }}
          status={error ? 'error' : ''}
          showSearch={showSearch}
          allowClear={allowClear}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
          notFoundContent={<Empty description={noDataMessage} />} // ✅ custom message
          {...rest}
        >
          {options.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={
                option.disabled ? 'ant-select-item-option-disabled' : ''
              }
            >
              {option.label}
            </Option>
          ))}
        </Select>
      </FieldWrapper>
      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default AitSelectBox;
