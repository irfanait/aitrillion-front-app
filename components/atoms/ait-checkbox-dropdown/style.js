import styled from 'styled-components';
import { Input } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 14px;
`;

export const FieldWrapper = styled.div`
  .ait-dropdown-btn {
    width: 100%;
    text-align: left;
    height: 40px;
    color: #4a566b;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    background: #fff;
    display: flex;
    align-items: center;
    padding-left: 12px;
  }
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;

  background: #ffffff; /* ← this is the missing part */
  padding: 14px 0 12px 0;

  /* visual separation */
  border-bottom: 1px solid #eef1f6;
`;

export const DropdownMenu = styled.div`
  padding: 0px 14px 14px 14px;
  width: 230px;
  max-height: 350px;
  max-width: 230px;

  overflow-y: auto;
  overflow-x: hidden;

  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 8px 24px 0px #181d2f1f;
`;

export const SearchInput = styled(Input)`
  background-color: #ffffff !important;
  border-radius: 6px;
  padding: 8px 10px;
`;

export const CheckboxOption = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 8px;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;

  .ant-checkbox-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #26282c;
    font-weight: 500;
    background: transparent;
    border-radius: 6px;
    line-height: normal;
    // padding: 12px;
  }
  &:hover {
    background: #f6f9fc;
  }
`;

export const EmptyText = styled.div`
  text-align: center;
  color: #888;
  padding: 8px 0;
`;
