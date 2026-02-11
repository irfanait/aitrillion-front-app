import { Layout, Menu, Button } from 'antd';
import styled from 'styled-components';
const { Sider } = Layout;

export const StyledSider = styled(Sider)`
  background: #000923;
  overflow-y: auto;
  max-height: calc(100vh - 20px);

  /* For Firefox */
  scrollbar-width: none;
  scrollbar-color: transparent transparent;

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #232E41;
  }
  .ant-btn.ant-btn-icon-only {
    min-width: 30px;
    height: 30px;
    width: 30px;
  }

  .ant-menu-inline.ant-menu-root
    .ant-menu-submenu-title
    > .ant-menu-title-content {
    white-space: normal !important;
    font-size: 13px !important;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    > li.ant-menu-item
    .ant-menu-title-content
    a {
    font-size: 13px !important;
    line-height: normal;
  }

  .ant-menu.ant-menu-root.ant-menu-inline .ant-menu-item {
    width: 100%;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-submenu
    > .ant-menu-submenu-title {
    width: 100%;
  }
  .ant-menu.ant-menu-root.ant-menu-inline > .ant-menu-item.menu-item-main,
  .ant-menu.ant-menu-root.ant-menu-inline .ant-menu-submenu-title {
    margin: 0px 0px;
    padding:8px 15px!important;
    border-radius:0px;
    height:auto;
    line-height: 18px;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu
    > .ant-menu-submenu-title {
    margin: 0px 0px;
    z-index: 1;
    padding-left: 15px !important;
    padding-right: 10px;
  }
  .ant-menu .ant-menu-submenu-arrow {
    inset-inline-end: 12px;
  }
    .menu-item-main{margin-top:5px;margin-bottom:5px;}
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-item.menu-item-main:hover,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-item.ant-menu-item-active.menu-item-main,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-item.ant-menu-item-active.menu-item-main:hover,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-submenu.ant-menu-submenu-active
    > .ant-menu-submenu-title,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-submenu.ant-menu-submenu-open
    > .ant-menu-submenu-title {
    background: #94b1f0 !important;
    color: #fff !important;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-item.ant-menu-item-only-child {
    margin: 0px 0px;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
  .ant-menu.ant-menu-root.ant-menu-inline > .ant-menu-item.menu-item-main:hover,
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-item.ant-menu-item-active.menu-item-main,
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-item.ant-menu-item-active.menu-item-main:hover,
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu.ant-menu-submenu-active
    > .ant-menu-submenu-title,
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu.ant-menu-submenu-open
    > .ant-menu-submenu-title {
    background: #232E41 !important;
    color: #fff !important;
    font-weight: 500;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu.ant-menu-submenu-inline
    > ul.ant-menu.ant-menu-sub {
    background: transparent !important;
    border-radius: 8px;
    position: relative;
    border-radius: 0px 0px 8px 8px !important;
    margin-top: -5px;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu.ant-menu-submenu-inline
    > ul.ant-menu.ant-menu-sub
    .ant-menu-title-content {
    white-space: normal !important;
    font-size: 12px !important;
    line-height: normal;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-submenu.ant-menu-submenu-inline
    > ul.ant-menu.ant-menu-sub {
    position: relative;
    padding: 12px 0px 5px 0px;
    background: transparent;
    padding-left: 30px;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    ul.ant-menu.ant-menu-sub
    ul.ant-menu.ant-menu-sub {
    padding-left: 15px;
  }
  .ant-menu.ant-menu-root.ant-menu-inline .ant-menu.ant-menu-sub:before {
    content: '';
    width: 1px;
    display: inline-block;
    background:rgba(255,255,255,.30);
    position: absolute;
    left: 30px;
    top: 14px;
    bottom: 15px;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    ul.ant-menu.ant-menu-sub
    ul.ant-menu.ant-menu-sub:before {
    left: 15px;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-submenu.ant-menu-submenu-inline
    > ul.ant-menu.ant-menu-sub
    li {
    margin-left: 15px;
    width: calc(100% - 20px);
    margin-bottom: 2px;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    ul.ant-menu.ant-menu-sub
    ul.ant-menu.ant-menu-sub
    li {
    width: calc(100% - 10px);
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-submenu-open
    > ul.ant-menu.ant-menu-sub
    li {
  }

  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-submenu.ant-menu-submenu-inline
    > ul.ant-menu.ant-menu-sub
    li
    > .ant-menu-submenu-title {
    padding-left: 8px !important;
    background: transparent;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-item.ant-menu-item-only-child:hover,
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-item.ant-menu-item-active.ant-menu-item-only-child,
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-item.ant-menu-item-active.ant-menu-item-only-child:hover,
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-submenu-open
    > ul.ant-menu.ant-menu-sub
    li
    .ant-menu-submenu-title:hover,
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-submenu-open
    > ul.ant-menu.ant-menu-sub
    li.ant-menu-submenu-open
    > .ant-menu-submenu-title,
  .ant-menu.ant-menu-root.ant-menu-inline
    .ant-menu-submenu-open
    > ul.ant-menu.ant-menu-sub
    li.ant-menu-submenu-open.ant-menu-submenu-active
    > .ant-menu-submenu-title {
    background: #232E41 !important;
    font-weight: 500 !important;
    color: #fff !important;
  }

  .ant-menu.ant-menu-sub.ant-menu-vertical
    .ant-menu-item.ant-menu-item-active.ant-menu-item-only-child.menu-item-main:hover {
    background: red !important;
  }
  .create-button-link {
    opacity: 0;
    visibility: hidden;
    transition: 0.2s linear all;
    position: relative;
    z-index: 0;
    margin-left: 10px;
  }
  .has-create-button:hover .create-button-link {
    transition: 0.2s linear all;
    opacity: 1;
    visibility: visible;
  }
  .ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #fff !important;
  }
  .ant-menu-light .ant-menu-submenu-title,
  .ant-menu-light .ant-menu-item {
    color: #fff;
  }
  .ant-menu-vertical .ant-menu-item{
      margin-inline: 0;
    margin-block: 0;
    width: 100%;
  }
   .ant-menu-vertical .ant-menu-item.menu-item-main{
    padding-inline:10px !important;
  }
  }
`;
export const ToggleSidebarbtnStyle = styled(Button)`
  font-weight: 400;
  font-style: Italic;
  font-size: 13px;
  line-height: normal;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  padding-left: ${({ collapsed }) => (collapsed ? '10px' : '15px')};
  padding-top: 15px;
  padding-bottom: 10px;
  height: auto;

  &:hover {
    color: rgba(255, 255, 255, 0.6) !important;
    background-color: transparent;
  }
  .ant-btn-icon {
    width: 29px;
    height: 24px;
    justify-content: center;
  }
`;
export const SelectedModuleWrappper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  h5 {
    white-space: nowrap;
  }
  a {
    color: #2abf84;
    text-decoration: none;
    font-size: 13px;
    white-space: nowrap;
    &:hover {
      color: #2abf84;
    }
  }
`;
export const StyledMenu = styled(Menu)`
  position: relative;
  padding: 0px 0px;
  border: none;

  .ant-menu.ant-menu-sub.ant-menu-vertical
    .ant-menu-item.ant-menu-item-active.ant-menu-item-only-child.menu-item-main:hover {
    background: red !important;
  }
  [data-menu-id*='checkoutX'] .ant-menu-item-icon svg {
    transform: scaleX(-1);
  }
  padding: ${({ collapsed }) => (collapsed ? '0px 0px' : '0px 0px')};
  .ant-menu-item-icon {
    width: 29px;
    height: 24px;
    justify-content: center;
  }
  > .ant-menu-submenu > .ant-menu-submenu-title {
    padding-inline: 7px !important;
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

export const CreateNewButtonStyle = styled(Button)`
  font-size: 13px;
  font-weight: 500;

  svg {
    vertical-align: middle !important;
  }
`;
