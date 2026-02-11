import { Tooltip } from 'antd';
import styled from 'styled-components';

export const ChipButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: ${(p) =>
    p.$active
      ? '1px solid var(--primary-700, #d6e7ff)'
      : '1px solid var(--chip-border, #d3d6db)'};
  background: ${(p) => (p.$active ? 'var(--primary-50, #e8f1fd)' : '#fcfcfc')};
  color: ${(p) => (p.$active ? 'var(--primary-700, #1a73e8)' : '#232E41')};
  padding: ${(p) => (p.$active ? '10px 10px' : '8px 10px')};
  border-radius: 6px;
  font-size: 13px;
  line-height: 17px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  height: 36px !important;
  &:hover {
    border: ${(p) =>
      p.$active
        ? '1px solid var(--primary-700, #d6e7ff)'
        : '1px solid var(--chip-border, #d3d6db)'};
    background-color: ${(p) =>
      p.$active ? 'var(--primary-50, #e8f1fd)' : '#fcfcfc'};
    color: ${(p) => (p.$active ? 'var(--primary-700, #1a73e8)' : '#1A73E8')};
    box-shadow: ${(p) => `0px 3px 8px rgba(15, 98, 206, 0.12) `};
  }
  &:focus-visible {
    outline: 2px solid var(--primary-300, #a5b4fc);
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  ${ChipButton}:hover & {
    color: #1a73e8;
  }
`;

export const StyledTooltip = styled(Tooltip)`
  .segment-tooltip .ant-tooltip-inner {
    background-color: #0f172a; /* dark */
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    max-width: 280px;
    white-space: normal; /* multiline */
    padding: 10px 12px;
    border-radius: 8px;
  }
  .segment-tooltip .ant-tooltip-arrow::before {
    background-color: #0f172a;
  }
`;
