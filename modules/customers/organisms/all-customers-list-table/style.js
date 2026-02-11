import { Tag } from 'antd';
import styled from 'styled-components';

export const SelectColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledTag = styled(Tag)`
  font-size: 14px;
  font-weight: 500;
  background-color: #c5ffd9;
  line-height: 14px;
  padding: 5px 10px;
`;

export const IconButton = styled.button`
  border: none;
  border-radius: 12px;
  width: 36px;
  height: 36px;
  // margin: 0 4px;
  cursor: pointer;
  transition:
    box-shadow 0.18s,
    transform 0.18s;

  &:hover {
    //transform: translateY(-2px) scale(1.08);
    transform: scale(1.08);
  }
`;
