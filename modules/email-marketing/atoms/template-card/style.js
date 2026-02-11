import AitButton from '@/components/atoms/ait-button/aitButton';
import { Tag } from 'antd';
import styled from 'styled-components';

export const CardWrapper = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .hover-actions {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
`;

export const OverlayButtons = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  z-index: 2;
`;
export const IconsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 60px;
`;
export const IconButton = styled.button`
  background: #fff;
  border: none;
  border-radius: 12px;
   width: 26px;
   height: 26px;
  // display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(204, 234, 252, 1);
  cursor: pointer;
  transition:
    box-shadow 0.18s,
    transform 0.18s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px) scale(1.08);
  }
`;

export const ActionButton = styled(AitButton)`
  width: 60%;
`;

export const StyledTagWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
`;
export const StyledTag = styled(Tag)`
  color: #09a43d;
  font-size: 12px;
  font-weight: 600;
  background-color: #c5ffd9;
  line-height: 14px;
  padding: 3px 8px;
`;

export const NameWrapper = styled.div`
  padding: 8px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-weight: 500 !important;

  div{
  font-weight: 500 !important;
  }
`;
