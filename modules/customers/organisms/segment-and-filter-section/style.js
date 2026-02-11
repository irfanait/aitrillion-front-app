import { Tag } from 'antd';
import styled from 'styled-components';

export const Wrap = styled.div`
  display: grid;
  gap: 10px;

  .field-popover-full {
    // width: calc(100% - 30px);
    //width: calc(100vw - 180px);
    //  max-width: 1100px;
    //  min-width: 900px;
    padding: 2px 20px;
    //   border-radius: 12px;
    //  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  color: #111827;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  &::after {
    content: 'i';
    display: inline-grid;
    place-items: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 12px;
    background: #f3f4f6;
    color: #6b7280;
  }
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

export const CreateRow = styled.div`
  display: grid;
  grid-template-columns: 220px 220px auto auto;
  gap: 10px;
  align-items: center;

  select,
  button {
    height: 36px;
    border: 1px solid #e5e7eb;
    background: #fff;
    border-radius: 8px;
    padding: 0 10px;
    font-size: 14px;
  }
  .primary {
    background: #4f46e5;
    color: #fff;
    border-color: transparent;
  }
  .link {
    border: 1px dashed #d1d5db;
    background: #fafafa;
  }
`;

export const MoreWrap = styled.div`
  position: relative;
  display: inline-block;
  margin-left: ${({ ismargin }) => (ismargin ? '8px' : '0px')};
`;
export const MoreMenu = styled.div`
  position: absolute;
  z-index: 20;
  top: 42px;
  left: 0;
  min-width: 280px;
  max-height: 280px;
  overflow: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  display: grid;
  gap: 8px;
`;

export const StyledTag = styled(Tag)`
  font-size: 14px;
  // line-height: 14px;
  padding: 6.2px 12px 6.2px 10px;
  margin: 0px;
  border-radius: 6px;
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ChipRowWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 6px;
  }
`;
