import React, { useEffect, useState } from 'react';
import { Radio, Tooltip, Flex, ColorPicker } from 'antd';
import {
  Label,
  Wrapper,
  FieldWrapper,
  LabelRow,
  RadioRound,
  RadioRoundChild,
  ColorPickerStyle,
} from './style';

const AitColorSwitch = ({
  name = '',
  label = '',
  onChange = false,
  required = false,
  labelIcon = null,
  tooltipText = '',
  defaultValue,
  colorOptions = [],
  round = false,
  gap = 10,
  // ...rest
}) => {
  const [selectedColor, setSelectedColor] = useState(defaultValue);

  const handleRadioChange = (e) => {
    setSelectedColor(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleColorPickerChange = (color) => {
    const hex = color?.toHexString();

    setSelectedColor(hex);
    if (onChange) {
      onChange(hex?.replace('#', ''));
    }
  };

  const isSelected = (colorValue) =>
    selectedColor?.toLowerCase() === colorValue?.toLowerCase();

  return (
    <Wrapper>
      <LabelRow>
        <Label htmlFor={name}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Label>
        {labelIcon && (
          <Tooltip title={tooltipText}>
            <span style={{ marginLeft: 8, cursor: 'pointer' }}>
              {labelIcon}
            </span>
          </Tooltip>
        )}
      </LabelRow>

      <FieldWrapper>
        {round ? (
          <RadioRound gap={gap} selectedColor={selectedColor}>
            <Radio.Group
              defaultValue={defaultValue}
              buttonStyle="solid"
              onChange={handleRadioChange}
              value={selectedColor}
            >
              {colorOptions.map((option) => (
                <RadioRoundChild
                  key={option.label}
                  value={option.value}
                  className={
                    selectedColor === option.value ? 'radio-selected' : ''
                  }
                ></RadioRoundChild>
              ))}
            </Radio.Group>
            <ColorPicker
              value={
                defaultValue?.startsWith('#')
                  ? defaultValue
                  : `#${defaultValue}`
              }
              onChange={handleColorPickerChange}
              className={isSelected(selectedColor) ? 'selectedColor' : ''}
            />
          </RadioRound>
        ) : (
          <Flex gap={10}>
            <Radio.Group
              defaultValue={defaultValue}
              buttonStyle="solid"
              onChange={handleRadioChange}
              value={selectedColor}
            >
              {colorOptions.map((option) => (
                <Radio.Button key={option.label} value={option.value}>
                  {option.label}
                </Radio.Button>
              ))}
            </Radio.Group>
            <ColorPicker
              value={
                defaultValue?.startsWith('#')
                  ? defaultValue
                  : `#${defaultValue}`
              }
              onChange={handleColorPickerChange}
            />
          </Flex>
        )}
      </FieldWrapper>
    </Wrapper>
  );
};

export default AitColorSwitch;
