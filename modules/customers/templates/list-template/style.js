import styled from 'styled-components';
import { Tag } from 'antd';

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  > {
    width: 100%;
  }
`;

export const StyledTag = styled(Tag)`
  font-size: 14px;
  font-weight: 500;
  background-color: #c5ffd9;
  line-height: 14px;
  padding: 5px 10px;
  color: var(--ant-color-primary);
  background-color: #eff6ff;
  border: none;
  margin-left: 8px;
`;
