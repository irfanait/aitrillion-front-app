import { Layout, Menu, Tag, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
const { Sider } = Layout;

export const StyledSider = styled(Sider)`
  background: #e6ecfd;
  overflow-y: auto;
  max-height: calc(100vh - 0px);

  a:link,
  a:hover,
  a:active,
  a:visited {
    text-decoration: none;
  }
  .ant-menu.ant-menu-root.ant-menu-inline .ant-menu.ant-menu-sub:before {
    content: '';
    width: 1px;
    display: inline-block;
    background: #dbe5ff;
    position: absolute;
    left: 18px;
    top: 8px;
    bottom: 22px;
  }

  // .ant-menu-title-content {
  //   color: #4a566b;
  //   font-weight: 400;
  // }

  .ant-layout-sider-children {
    max-height: ${({ collapsed }) =>
      collapsed ? '98vh !important' : 'calc(98vh - 57px) !important'};
    overflow: auto;
    padding-right: 0px !important;
    padding-bottom: 110px !important;
    scrollbar-width: ${({ collapsed }) => (collapsed ? 'none' : 'thin')};
    scrollbar-color: #94b1f0af #e6ecfd;
  }
  .ant-layout-sider-children::-webkit-scrollbar {
    width: 4px;
    border-radius: 12px;
  }
  .ant-layout-sider-children::-webkit-scrollbar-thumb {
    background-color: #94b1f0af;
    border-radius: 12px;
  }
  .ant-layout-sider-children::-webkit-scrollbar-thumb:hover {
    background-color: #94b1f0;
  }
  .ant-layout-sider-children::-webkit-scrollbar-track {
    background: #e6ecfd;
    border-radius: 12px;
  }
  .ant-menu-vertical .ant-menu-item-icon {
    position: relative;
    top: 2px;
  }
  .ant-menu-vertical .ant-menu-title-content {
    opacity: 1 !important;
  }
  .ant-menu-vertical .ant-menu-title-content span.menu-name {
    opacity: 0 !important;
  }
  .ant-menu-vertical .ant-menu-title-content .anticon.anticon-lock {
    position: absolute !important;
    left: 0;
    right: auto;
    line-height: normal;
    margin-left: 0px;
    top: 9px !important;
  }
  .ant-menu-vertical .ant-menu-title-content .anticon.anticon-lock svg {
    line-height: normal;
  }
  .ant-menu-submenu.ant-menu-submenu-popup {
    padding-top: 5px;
  }
  .ant-menu-submenu.new-feature-menu:not(.menu-locked) .new-menu-badge {
    margin-right: 15px;
  }

  .ant-menu-submenu.new-feature-menu.menu-locked .new-menu-badge {
    margin-right: 0px;
  }
  .ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #4a566b !important;
  }
  .ant-menu-light .ant-menu-submenu-title,
  .ant-menu-light .ant-menu-item {
    color: #4a566b !important;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu
    > .ant-menu-submenu-title {
    z-index: 1;
  }
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-item.menu-item-main:hover,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-item.ant-menu-item-active.menu-item-main,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-item.ant-menu-item-selected.menu-item-main,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-item.ant-menu-item-active.menu-item-main:hover,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-submenu.ant-menu-submenu-active
    > .ant-menu-submenu-title,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-submenu.ant-menu-submenu-selected
    > .ant-menu-submenu-title,
  .ant-menu.ant-menu-root.ant-menu-vertical
    > .ant-menu-submenu.ant-menu-submenu-open
    > .ant-menu-submenu-title,
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu.ant-menu-submenu-active
    > .ant-menu-submenu-title {
    background: #94b1f0 !important;
    color: #fff !important;
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
    > .ant-menu-submenu-title,
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu.ant-menu-submenu-active
    > .ant-menu-submenu-title {
    background: #94b1f0 !important;
    color: #fff !important;
    font-weight: 500;
  }
  .ant-menu.ant-menu-root.ant-menu-inline
    > .ant-menu-submenu.ant-menu-submenu-inline
    > ul.ant-menu.ant-menu-sub {
    background: #f0f5ff !important;
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
    background: #e4eeff !important;
    font-weight: 500 !important;
  }
  .ant-menu-inline:not(.ant-menu-sub)
    > .ant-menu-item
    > .ant-menu-title-content {
    line-height: 18px;
    height: auto;
    padding-top: 8px;
    padding-bottom: 8px;
    white-space: normal;
  }

  .ant-menu-inline:not(.ant-menu-sub)
    > .ant-menu-submenu
    > .ant-menu-submenu-title
    > .ant-menu-title-content {
    line-height: 18px;
    height: auto;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .ant-menu-inline .ant-menu-submenu.menu-item-main .ant-menu-submenu-title {
    height: auto;
    line-height: auto;
  }

  /* Note: Submenu active styling is now handled by existing CSS rules */
  /* The ant-menu-submenu-active class is programmatically added when sidebar is collapsed */
  .ant-menu-vertical > .ant-menu-item.menu-item-main {
    height: 40px !important;
  }
`;

export const StyledMenu = styled(Menu)`
  position: relative;
  padding: 0px 10px;
  border: none !important;

  .ant-menu-item-icon {
    // color: #4a566b;
    width: 29px;
    height: 24px;
    justify-content: center;
    text-align: center;
  }
  .ant-menu-item-icon {
    margin-right: 5px;
  }
  .ant-menu-item-icon svg {
    width: 18px;
    height: 18px;
  }
  .ant-menu-title-content {
    margin-inline-start: 0px !important;
  }

  .ant-menu-item.menu-item-main {
    padding: ${({ collapsed }) =>
      collapsed ? '0px 5px !important' : '0px 10px 0px 5px !important'};
    margin: 0;
    width: 100%;
    border-radius: 8px;
  }
  .menu-item-main.has-pin-icon {
    position: relative;
  }

  .menu-item-main.has-pin-icon .ant-menu-submenu-arrow {
    display: none !important;
  }
  .ant-menu-submenu.menu-item-main {
    padding: 0 0px !important;
    border-radius: 8px;
    margin-top: 3px;
    margin-bottom: 1px;
  }
  ul.ant-menu.ant-menu-sub.ant-menu-inline {
    padding: 15px 5px 5px 27px !important;
    position: relative;
    border-radius: 0px 0px 8px 8px;
    margin-top: -5px;
  }
  ul.ant-menu.ant-menu-sub.ant-menu-inline li {
    margin-bottom: 5px;
    min-height: 28px !important;
    line-height: 18px;
    height: auto;
  }
  ul.ant-menu.ant-menu-sub.ant-menu-inline
    ul.ant-menu.ant-menu-sub.ant-menu-inline {
    padding: 12px 5px 0px 17px !important;
    background: transparent;
    margin-top: -5px;
  }
  ul.ant-menu.ant-menu-sub.ant-menu-inline
    ul.ant-menu.ant-menu-sub.ant-menu-inline:before {
    left: 10px;
  }
  .ant-menu-item-active,
  .ant-menu-item.menu-item-main:hover,
  .ant-menu-submenu.menu-item-main .ant-menu-submenu-title:hover,
  .menu-item-main.ant-menu-submenu-open > .ant-menu-submenu-title {
    // background-color: #232e41 !important;
  }
  .ant-menu-submenu.menu-item-main > .ant-menu-submenu-title {
    padding: ${({ collapsed }) =>
      collapsed ? '0px 5px !important' : '0px 10px 0px 5px !important'};
    margin: 0;
    width: 100%;
    border-radius: 0;
  }
  .ant-menu-submenu.menu-item-main.menu-locked > .ant-menu-submenu-title {
    padding: ${({ collapsed }) =>
      collapsed ? '0px 5px !important' : '0px 5px 0px 5px !important'};
  }
  .ant-menu-sub .ant-menu-submenu.menu-item-main > .ant-menu-submenu-title {
    padding: 0px 10px 0px 10px !important;
  }
  // .ant-menu-title-content {
  //   color: #4a566b;
  font-size: 12px;
  font-weight: 400;
  // }
  .ant-menu-item.menu-item-main:hover > .ant-menu-title-content a span,
  > .ant-menu-submenu.menu-item-main:hover
    > .ant-menu-submenu-title
    > .ant-menu-title-content
    span {
    font-weight: 500 !important;
  }
  .ant-menu-submenu-active > .ant-menu-submenu-title > .ant-menu-title-content {
    font-weight: 500 !important;
  }
  .ant-menu-item-only-child.menu-item-main {
    border-radius: 8px !important;
    padding: 5px 10px !important;
  }
  .ant-menu-submenu.menu-item-main .ant-menu-submenu-title {
    border-radius: 8px !important;
  }
  .ant-menu-submenu.ant-menu-submenu-inline.menu-item-main
    .ant-menu-submenu.ant-menu-submenu-inline.menu-item-main
    > .ant-menu-submenu-title {
    min-height: 28px;
    line-height: 18px;
    height: auto;
  }
  > .ant-menu-submenu.ant-menu-submenu-inline ul {
    // margin-top: 10px;
    margin-bottom: 10px;
  }
  > .ant-menu-submenu.menu-item-main > .ant-menu-submenu-title {
    border-radius: 8px !important;
  }
  > .ant-menu-item.menu-item-main > .ant-menu-title-content,
  > .ant-menu-submenu.menu-item-main
    > .ant-menu-submenu-title
    > .ant-menu-title-content {
    font-size: 13px;
    font-weight: 400 !important;
  }
  .ant-menu-title-content > div > span {
    white-space: normal;
    line-height: 18px;
    // text-overflow: ellipsis;
    // overflow: hidden;
    // max-width:90%;
  }

  .ant-menu-item.ant-menu-item-only-child > .ant-menu-title-content {
    //  max-width: calc(100% - 5px);
  }
  .ant-menu-item.ant-menu-item-only-child
    > .ant-menu-title-content
    > div
    > a
    > span {
    white-space: normal;
    line-height: 15px;
    // text-overflow: ellipsis;
    // overflow: hidden;
    // max-width:calc(100% - 5px);
  }
  .ant-menu-submenu-arrow {
    inset-inline-end: 6px !important;
  }
  // .ant-menu-submenu-arrow {
  //   color: #808491 !important;
  // }

  // .ant-menu-submenu-open > .ant-menu-submenu-title > .ant-menu-submenu-arrow,
  // .ant-menu-submenu-active > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
  //   color: #fff !important;
  // }

  // .ant-checkbox-checked .ant-checkbox-inner, .ant-checkbox-inner{
  // display:none
  // }
  .ant-checkbox .ant-checkbox-inner {
    display: none;
  }
  .pin-unchecked svg path {
    fill: #ffffff;
  }
  .pin-checked svg path {
    fill: #fff200;
  }
  .ant-checkbox-wrapper-disabled {
    cursor: pointer;
  }
  .ant-checkbox-label {
    padding-right: 0px;
    position: relative;
    top: 2px;
    padding-left: 0px;
  }

  .create-button-link {
    transition: 0.2s linear all;
    position: relative;
    z-index: 0;
    margin-left: 10px;
    display: none;
  }
  .has-create-button:hover > .create-button-link {
    transition: 0.2s linear all;
    visibility: visible;
    display: inline-flex;
  }

  .ant-menu-submenu.menu-item-main#customers:hover .ant-menu-item-icon svg path,
  .ant-menu-submenu.menu-item-main#customers:hover
    .ant-menu-item-icon
    svg
    circle {
    stroke: #fff;
    fill: none !important;
  }
  .ant-menu-submenu-open#customers .ant-menu-item-icon svg path,
  .ant-menu-submenu-open#customers .ant-menu-item-icon svg circle,
  .ant-menu-submenu-selected#customers .ant-menu-item-icon svg path,
  .ant-menu-submenu-selected#customers .ant-menu-item-icon svg circle {
    fill: none !important;
    stroke: #fff;
  }
  .ant-menu-submenu-active .ant-menu-item-icon svg path,
  .ant-menu-submenu-selected .ant-menu-item-icon svg path,
  .ant-menu-submenu-open .ant-menu-item-icon svg path,
  .ant-menu-item.menu-item-main:hover .ant-menu-item-icon svg path,
  .ant-menu-item.menu-item-main.ant-menu-item-selected
    .ant-menu-item-icon
    svg
    path,
  .ant-menu-submenu.menu-item-main:hover .ant-menu-item-icon svg path {
    fill: #fff;
  }
`;
export const ToggleSidebarbtnStyle = styled(Button)`
  font-weight: 400;
  font-style: Italic;
  font-size: 13px;
  line-height: normal;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  padding-top: 12.6px;
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

export const SidebarLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  padding: 13.6px 12px;
  position: sticky;
  top: 0;
  z-index: 2;
  background: #e6ecfd;
`;

export const SelectedModuleWrappper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  white-space: nowrap;
  padding: 0px 0px 0px 5px;
  margin-top: 20px;
  margin-bottom: 15px;
  line-height: 15px;
  > div:not(.no-module-selected) {
    width: 100%;
    font-weight: 500;
    font-size: 11px;
    color: #808491 !important;
    letter-spacing: normal !important;
    background: none !important;
    box-shadow: none !important;
    transition: all 0.2s ease-in-out;
    text-transform: uppercase;
  }
`;

export const SelectedModuleLoad = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  white-space: nowrap;
  width: 100%;
  > div.no-module-selected {
    width: 100%;
    flex: 0 0 100%;
    color: #8b98a5;
    font-weight: 400;
    line-height: normal;
    margin-top: 10px;
    text-transform: none;
    padding: 10px 10px;
    border-radius: 6px;
    border: 1px dashed rgba(128, 132, 145, 0.5);
    font-size: 12px;
  }
  > div.module-loading {
    width: 100%;
    flex: 0 0 100%;
    color: #8b98a5;
    font-weight: 400;
    line-height: normal;
    margin-top: 10px;
    text-transform: none;
    padding: 10px 10px;
    border-radius: 6px;
    border: 1px dashed rgba(128, 132, 145, 0.5);
    font-size: 12px;
  }
`;

export const NavTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  padding: 0px 5px 0px 15px;
  margin-top: 5px;
  margin-bottom: 15px;
  > div {
    font-weight: 500;
    font-size: 11px;
    line-height: 15px;
    color: #808491 !important;
    letter-spacing: normal !important;
    background: none !important;
    box-shadow: none !important;
    transition: all 0.2s ease-in-out;
    text-transform: uppercase;
  }
`;

export const MoreModues = styled.div`
  display: flex;

  align-items: center;
  white-space: nowrap;
  padding: 0px 15px 0px 15px;
  ${({ collapsed }) => ({
    marginTop: collapsed ? '12px' : '20px',
    marginBottom: collapsed ? '12px' : '15px',
    justifyContent: collapsed ? 'center' : 'space-between',
  })}

  cursor:pointer;
  > div {
    font-weight: 500;
    font-size: 11px;
    color: #808491 !important;
    letter-spacing: normal !important;
    background: none !important;
    box-shadow: none !important;
    transition: all 0.2s ease-in-out;
    text-transform: uppercase;
  }
  .more-modues-arrow {
    color: #fff;
    position: relative;
    right: 10px;
  }
  .more-modues-arrow.more-modues-arrow-up {
  }

  .more-modues-arrow::after {
    content: '';
    position: absolute;
    width: 7px;
    height: 7px;
    box-sizing: border-box;
    border-top: 2px solid #808491;
    border-right: 2px solid #808491;
    transform-origin: center;
    transition: 0.2s all linear;
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
    margin-top: -4px;
  }

  .more-modues-arrow.more-modues-arrow-up::after {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    transition: 0.2s all linear;
    margin-top: -2px;
  }
  &:hover {
    svg rect {
      fill: #94b1f0;
    }
    svg path {
      fill: #fff;
    }
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
  width: 100%;
  margin-top: 10px;

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

export const StyleTag = styled(Tag)`
  margin-left: auto;
  margin-right: 0px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  text-align: left;
  padding: 3px 4px 2px 4px;
`;

export const StyleCreateLink = styled(Link)``;

export const StyleTagAihub = styled(Tag)`
  margin-left: auto;
  margin-right: 0px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  padding: 0px;
  border: none;
  background: transparent;
`;

export const CustomizeModulesButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  background: #e6ecfd;
  z-index: 10;
  max-width: ${({ screens }) => (!screens?.xl ? '280px' : '220px')};
`;

export const CustomizeModulesButton = styled(Button)`
  position: relative;
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  padding: 8px 16px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6ecfd !important;
  transition: all 0.2s ease;
`;
