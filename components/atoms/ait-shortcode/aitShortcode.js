import React, { useRef, useState } from 'react';
import { StyleShortCode, StyleFlex } from './style';
import AitButton from '../ait-button/aitButton';
import { App, Tag, Tooltip, Flex, Grid } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
const { useBreakpoint } = Grid;

const AitShortcode = ({
  copybtn = false,
  copybtnicon = false,
  cardpadding = { xs: '10px 16px', sm: '10px 16px', md: '10px 12px' },
  shortcode = '',
  block = false,
  gap = 16,
  children,
  ...rest
}) => {
  const screens = useBreakpoint();
  const codeRef = useRef(null);
  const [tooltipTitle, setTooltipTitle] = useState('Copy');

  const handleCopy = () => {
    if (codeRef.current) {
      const textToCopy = codeRef?.current?.textContent;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setTooltipTitle('Copied');
          setTimeout(() => {
            setTooltipTitle('Copy');
          }, 1000);
        })
        .catch(() => {
          setTooltipTitle('Failed to copy!');
          setTimeout(() => {
            setTooltipTitle('Copy');
          }, 1000);
        });
    }
  };

  return (
    <StyleShortCode screens={screens} block={block}>
      {
        <Tag
          color="#F3FFEF"
          style={{
            border: 'none',
            marginBottom: 24,
            whiteSpace: 'normal',
            width: `${block ? '100%' : 'auto'}`,
            color: '#6E809D',
            padding: '0px',
            margin: 0,
          }}
        >
          <StyleFlex
            align="center"
            justify="space-between"
            screens={screens}
            cardpadding={cardpadding}
            gap={gap}
          >
            <span ref={codeRef}>{shortcode}</span>

            {copybtn === true && (
              <>
                {copybtnicon === true ? (
                  <Tooltip title={tooltipTitle}>
                    <AitButton
                      variant="solid"
                      padding="0px 0px"
                      fontSize="16px"
                      style={{ backgroundColor: 'none', color: '#08979c' }}
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={handleCopy}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={tooltipTitle}>
                    <AitButton
                      variant="solid"
                      padding="0px 0px"
                      fontSize="16px"
                      width="36px"
                      height="36px"
                      style={{
                        backgroundColor: '#13B223',
                        borderColor: '#13B223',
                        color: '#fff',
                      }}
                      icon={<CopyOutlined />}
                      onClick={handleCopy}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </StyleFlex>
        </Tag>
      }
    </StyleShortCode>
  );
};

export default AitShortcode;
