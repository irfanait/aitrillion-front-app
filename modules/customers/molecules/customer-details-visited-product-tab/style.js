import styled from 'styled-components';
import { List, Avatar } from 'antd';
const { Item } = List;
const { Meta } = Item;

export const StyleVisitedWrapper = styled.div`
  width: 100%;
  max-height: 68vh;
  overflow-y: auto;
  position: relative;
  padding-right: 10px;
`;

export const StyleItemWrapper = styled(Item)`
  padding: 16px 0 !important;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: flex-start;
  gap: 15px;
`;
export const StyleMetaWrapper = styled(Meta)`
  .ant-list-item-meta-title {
    //min-height: 50px;
    display: inline-flex;
    align-items: center;
    a {
      line-height: normal;
    }
  }
`;

export const StyleItemAvatar = styled(Avatar)`
  padding: 2px 7px;
  border: 1px solid var(--ant-color-text-secondary);
  background: #fff;
  z-index: 1;
  position: relative;

  img {
    object-fit: contain;
    object-position: center;
  }
`;

export const StyleItemAvatarWarpper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const StyleItemAvatarLine = styled.span`
  position: absolute;
  background: var(--ant-color-text-secondary);
  width: 2px;
  height: 5;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 0;
  top: 50px;
`;
export const StyleItemAvatarDot = styled.span`
  display: block;
  height: 12px;
  width: 12px;
  border: 2px solid var(--ant-color-text-secondary);
  border-radius: 100px;
  margin-top: 5px;
  background: #fff;
  position: relative;
  top: 5px;
`;
