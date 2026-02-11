import { Layout, Avatar, Button } from 'antd';
import styled from 'styled-components';
const { Header } = Layout;
// import { Avatar } from 'antd';

export const StyledHeader = styled(Header)`
  top: 0;
  left: 0;
  right: 0;
  /*z-index: 1000;  higher than Drawer */
  height: 60px;
  background: #ffffff;
  padding: ${({ screens }) =>
    screens?.sm ? '0 30px 0px 14px' : '10px 16px 10px 16px'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: none;
  border-bottom: 1px solid #e7ecfa;
  position: relative;
  z-index: 999;
`;

export const StyleHeaderLeft = styled.div`
  display: flex;
  align-items: center;

  button {
    color: #000 !important;
    font-size: 18px;
    margin-right: 10px;
    width: 22px !important;
    text-align: center;
    background: transparent !important;
  }
  button:hover {
    background: transparent !important;
  }
  button .ant-btn-icon {
    display: flex;
  }
  svg.aitrillion-logo {
    width: ${({ screens }) => (screens?.xs ? '90px' : 'auto')};
    height: ${({ screens }) => (screens?.xe ? '90px' : 'auto')};
  }
  padding: 4px 4px 4px 0px;
`;

export const StyleHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ screens }) => (screens?.sm ? '16px' : '12px')};
`;
export const CreateNewButtonStyle = styled(Button)`
  font-size: 13px;
  font-weight: 500;

  svg {
    vertical-align: middle !important;
  }
`;

export const ReuestforBasicSetupbtn = styled(Button)`
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background-color: var(--color-green) !important;
  border-color: var(--color-green) !important;

  &:hover {
    color: #fff !important;
    background-color: var(--color-green) !important;
    border-color: var(--color-green) !important;
  }
`;

export const UpgradePlanbtn = styled(Button)`
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background-color: var(--color-green) !important;
  border-color: var(--color-green) !important;

  &:hover {
    color: #fff !important;
    background-color: var(--color-green) !important;
    border-color: var(--color-green) !important;
  }
`;

export const StyledAvtarButton = styled(Avatar)`
  background: #ffc107;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  text-transform: uppercase;
  flex: 0 0 32px;
  font-size: 13px;
  text-transform: uppercase;
  transform: scale(1);
`;
export const StyleModulesDrawerBtn = styled.div`
  display: inline-flex;
  .ant-btn-icon {
    height: auto;
    display: inline-flex;
    margin: auto auto;
  }
`;
export const StyleSupportBtn = styled.div`
  display: inline-flex;
  .ant-btn-icon {
    height: auto;
    display: inline-flex;
    margin: auto auto;
  }
`;

export const LanguageDropdownWrapper = styled.div`
  display: inline-flex;
  position: relative;

  #google_translate_element {
    display: inline-block;
    width: auto;
  }
  span.language_dropdown_span {
    position: relative;
    width: 32px;
    height: 32px;
    display: inline-flex;
    z-index: 1;
    overflow: hidden;
    background: #f1f5fe;
    border-radius: 6px;
  }
  span.language_dropdown_span svg {
    position: absolute;
    top: auto;
    left: 7px;
    z-index: -1;
    margin-top: 7px;
  }
`;
