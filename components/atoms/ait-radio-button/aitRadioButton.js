import React from 'react';
import { Col, Radio, Row, Tooltip } from 'antd';
import {
  ErrorText,
  Label,
  Wrapper,
  FieldWrapper,
  LabelRow,
  StyledRadio,
} from './style';
import AitText from '../ait-text/aitText';

const { Group } = Radio;

const AitRadioButton = ({
  name = '',
  label = '',
  options = [],
  value,
  onChange,
  required = false,
  error = false,
  errorMessage = '',
  labelIcon = null,
  tooltipText = '',
  columns = 1,
  helpertextspacefromleft,
  isRowCol = false,
  xs = 24,
  sm = 24,
  md = 24,
  lg = 24,
  gap = 16,
  helpertexttype = 'secondary',
  helpertextsize = '13',
  marginbottom = '16',
  fontweight = '400',
  ...rest
}) => {
  return (
    <Wrapper marginbottom={marginbottom}>
      {label && (
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
      )}

      <FieldWrapper
        xs={xs}
        sm={sm}
        md={md}
        lg={lg}
        gap={gap}
        isRowCol={isRowCol}
      >
        <Group
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...rest}
        >
          {isRowCol ? (
            <Row gutter={[gap, gap]}>
              {options.map((option) => (
                <Col key={option.value} xs={xs} sm={sm} md={md} lg={lg}>
                  <StyledRadio fontweight={fontweight} value={option.value}>
                    {option.label}
                  </StyledRadio>
                  {option?.helpertext && (
                    <div
                      className="radio-helpertext"
                      key={option.value}
                      style={{
                        paddingLeft: `${helpertextspacefromleft ? `${helpertextspacefromleft}px;` : `26px`}`,
                      }}
                    >
                      <AitText type={helpertexttype} size={helpertextsize}>
                        {option.helpertext}
                      </AitText>
                    </div>
                  )}
                </Col>
              ))}
            </Row>
          ) : (
            options.map((option) => (
              <>
                <StyledRadio
                  key={option.value}
                  value={option.value}
                  fontweight={fontweight}
                >
                  {option.label}
                </StyledRadio>
                {option?.helpertext && (
                  <div
                    className="radio-helpertext"
                    key={option.value}
                    style={{
                      paddingLeft: `${helpertextspacefromleft ? `${helpertextspacefromleft}px;` : `26px`}`,
                    }}
                  >
                    <AitText type={helpertexttype} size={helpertextsize}>
                      {option.helpertext}
                    </AitText>
                  </div>
                )}
              </>
            ))
          )}
        </Group>
      </FieldWrapper>

      {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default AitRadioButton;
