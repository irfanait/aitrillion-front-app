import styled from 'styled-components';
import { Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';

const { Text } = Typography;

export const ListWrap = styled.div`
  max-height: 56vh;
  overflow: auto;
  padding-right: 4px;
  width: 100%;
`;

export const Item = styled.div`
  border-radius: 8px;
  padding: 10px 12px;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  background: ${({ $active }) =>
    $active ? 'rgba(79,70,229,.06)' : 'transparent'};
  box-shadow: ${({ $active }) =>
    $active ? 'inset 0 0 0 1px rgba(79,70,229,.35)' : 'none'};

  &:hover {
    background: rgba(79, 70, 229, 0.06);
  }
`;

export const IconBox = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  margin-top: 6px;
  flex-shrink: 0;
`;

export const TitleBox = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: 4A566B;
  padding: 6px 0px;
`;

export const DescBox = styled(Text)`
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
`;

export const DeleteIcon = styled(DeleteOutlined)`
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    color: #ef4444;
  }
`;

export const SearchInput = styled(AitInputBox)`
  margin: 16px 10px 16px 0px;
  padding: 10px;
  // border-radius: 6px;
`;
