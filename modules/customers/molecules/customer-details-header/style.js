import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  padding-bottom: 0px;
  //padding-top: 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-middle {
    flex: 1;
    margin-left: 12px;
  }

  .cust-name {
    // margin-bottom: 0;
    font-weight: 600;
  }

  .location {
    font-size: 13px;
  }
`;

export const AvatarCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: var(--ant-color-primary);
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;
