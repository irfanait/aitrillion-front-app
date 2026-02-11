import React from 'react';
import { StyledSwitchWrap, StyledSwitch, StyledSwitchLabel } from './style';
import { Flex, Tooltip } from 'antd';
import AitText from '../ait-text/aitText';
import { InfoCircleOutlined } from '@ant-design/icons';

const AitSwitch = ({
  label = '',
  helpertext = '',
  align = 'center',
  justify = 'flex-start',
  fontweight = 500,
  helpertextsize = 12,
  strong = false,
  lableTooltip = '',
  required = false,
  onChange,
  vertical = false,
  wrap,
  gap = 8,
  ...rest
}) => {
  return (
    <Flex
      align={align}
      wrap={wrap}
      gap={gap}
      justify={justify}
      vertical={vertical}
    >
      {label && (
        <Flex vertical>
          {label && (
            <StyledSwitchLabel fontweight={fontweight}>
              {label}
              {required && (
                <span className="field-required" style={{ marginLeft: 2 }}>
                  *
                </span>
              )}
              {lableTooltip && (
                <Tooltip title={lableTooltip} className="label-tooltip">
                  <span
                    style={{
                      cursor: 'pointer',
                      marginLeft: 5,
                    }}
                  >
                    <InfoCircleOutlined />
                  </span>
                </Tooltip>
              )}
            </StyledSwitchLabel>
          )}
          {helpertext && (
            <AitText
              style={{ marginTop: 4 }}
              lineheight={16}
              type="secondary"
              {...(strong || {})}
              size={helpertextsize}
            >
              {helpertext}
            </AitText>
          )}
        </Flex>
      )}
      <StyledSwitch
        {...rest}
        onChange={(checked, event) => {
          onChange?.(checked, event);
        }}
      />
    </Flex>
  );
};

export default AitSwitch;
