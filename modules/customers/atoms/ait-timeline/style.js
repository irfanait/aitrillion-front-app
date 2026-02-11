import styled from 'styled-components';
import { CaretDownOutlined } from '@ant-design/icons';

/* MAIN WRAPPER */
export const TimelineWrapper = styled.div`
  width: 100%;
  max-height: 68vh;
  overflow-y: auto;
  position: relative;
  padding-right: 10px;

  // padding-left: 29px; /* space for line + icons */
  scrollbar-gutter: stable;
`;

/* LEFT VERTICAL LINE */
export const LeftLine = styled.div`
  position: absolute;
  top: 38px; /* Below date chip */
  left: 34px; /* Perfect alignment with icon center */

  width: 2px;
  background: #dce7ff;

  bottom: 0; /* <-- This is the KEY FIX */
  height: auto; /* Let it stretch with content */
  z-index: 1;
`;

export const TimelineWrapperInner = styled.div`
  &:not(:nth-of-type(1)) {
    margin-top: 24px;
  }
`;

/* DATE HEADER */
export const DateGroup = styled.div`
  background: #f2f4f7;
  border-radius: 14px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  position: relative;
  z-index: 3; /* above the line */

  ::before {
    content: '';
    height: 100%;
    position: absolute;
    background: #d9e4f4;
    width: 1px;
    z-index: -1;
    left: 14px;
    top: 30px;
  }
`;

/* SMALL COMPACT ARROW */
export const ArrowIcon = styled(CaretDownOutlined)`
  font-size: 10px;
  color: #6b7280;
  transition: 0.2s ease;
  transform: ${(p) => (p.opened ? 'rotate(0deg)' : 'rotate(-90deg)')};
`;

export const DateChip = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #576f7c;
`;

/* ROW */
export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0px 0px 0px;
  position: relative;
  z-index: 2;

  ::before {
    content: '';
    height: 100%;
    position: absolute;
    background: #d9e4f4;
    width: 1px;
    z-index: -1;
    left: 14px;
  }
`;

/* ICON BUBBLE */
export const IconWrap = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  flex-shrink: 0;

  position: relative;
  left: 0px; /* pulls icon left so it sits ON the line perfectly */
`;

/* TEXT PART */
export const TextWrap = styled.div`
  flex: 1;

  .row-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .name {
    font-weight: 500;
    color: #1a73e8;
  }

  .time {
    font-size: 12px;
    color: #7a8a97;
    margin-right: 10px;
  }

  .object-text {
    font-size: 14px;
    margin-bottom: 4px;
  }
`;

export const EngagedBadge = styled.span`
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 6px;
`;

export const LoaderWrap = styled.div`
  text-align: center;
  padding: 12px 0;
`;
