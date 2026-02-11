import React from 'react';
import { Checkbox } from 'antd';
import { ErrorText, FieldWrapper, Wrapper } from './style';
import { toSentenceCase } from '../../utils/helper';

const { Group } = Checkbox;

const AitCheckboxGroup = ({
  name = '',
  label = '',
  options = [],
  value = [],
  onChange,
  error,
  errorMessage,
  boldLabel = false, // ✅ Optional prop - defaults to false (won't affect existing usages)
}) => {
  return (
    <Wrapper>
      <FieldWrapper>
        <div
          style={{
            marginBottom: 6,
            fontWeight: boldLabel ? 600 : 'normal', // ✅ Bold only when prop is true
          }}
        >
          {boldLabel ? toSentenceCase(label) : label}
        </div>

        <Group
          options={options.map((opt) => ({
            label: boldLabel ? (
              <span style={{ fontWeight: 400 }}>{opt.label}</span>
            ) : (
              opt.label
            ),
            value: opt.value,
          }))}
          value={value}
          onChange={onChange}
        />
      </FieldWrapper>

      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default AitCheckboxGroup;
