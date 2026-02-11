import { Collapse } from 'antd';
import styled from 'styled-components';

export const InnerCollapseWrapper = styled(Collapse)`
  background-color: transparent;
  .ant-collapse-item {
    border: 1px solid #e9e9ed;
    border-radius: 12px !important;
    padding: 16px;
    box-shadow: 0px 5px 10px -7px #0026872a;
  }
  .ant-collapse-item:not(:last-of-type) {
    margin-bottom: 12px;
  }
  .ant-collapse-expand-icon {
    width: 26px;
    height: 26px !important;
    border-radius: 50px;
    flex: 0 0 26px;
    padding: 0px !important;
    justify-content: center;
    margin-right: 10px;
  }
  .ant-collapse-arrow {
    display: none !important;
  }
  .ant-collapse-expand-icon:before {
    content: '';
    position: absolute;
    background: #fff;
    width: 16px;
    height: 16px;
    border: 5px solid #d2d3d9;
    display: inline-block;
    border-radius: 50px;
    outline: 5px solid #d2d3d93d;
    transition: all 0.2s ease-in-out;
  }
  .ant-collapse-item.ant-collapse-item-active .ant-collapse-expand-icon:before,
  .ant-collapse-item:hover .ant-collapse-expand-icon:before {
    background: #fff;
    border-color: #1a73e8;
    outline: 5px solid #1a73e81a;
  }
  .ant-collapse-header {
    padding: 0px !important;
    position: static;
  }
  .ant-collapse-content {
    padding-left: 36px;
  }
  .ant-collapse-content-box {
    padding-left: 0px !important;
    padding-bottom: 0px !important;
  }
  .ant-collapse-item {
    border-bottom: none;
  }
  .ant-collapse-header-text h5 {
    color: var(--ant-color-text-primary);
    font-weight: 500;
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    .ant-collapse-expand-icon {
      width: 20px;
      height: 20px !important;
      flex: 0 0 20px;
    }
    .ant-collapse-content {
      padding-left: 30px;
    }
  }
`;
