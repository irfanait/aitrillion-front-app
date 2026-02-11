import { Collapse } from 'antd';
import styled from 'styled-components';

export const CollapseWrapper = styled(Collapse)`
 background-color:#fff;
 border:1px solid #f0f0f0;
 > .ant-collapse-item > .ant-collapse-header{
    border: none;    
    padding:12px 24px 15px 24px;
 }
> .ant-collapse-item > .ant-collapse-header .ant-collapse-expand-icon > .anticon.anticon-right.ant-collapse-arrow{
    margin-top: 6px;
    }
> .ant-collapse-content{
    border:none;
    border-radius:0px;
}
> .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box{
    padding:10px 24px 24px;
}
    .close-panel-btn{
    width: 25px;
    height: 25px;
    text-align: right;
    font-size: 17px;
    padding-right: 2px;
    }
@media (max-width:768px){
    h4.outer-collapse-title{
    font-size:16px;
    white-space:normal
    }
    > .ant-collapse-item > .ant-collapse-header{
      padding:12px 20px 15px 20px;
    }
    > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box{
    padding:10px 20px 20px;
    }
}

`;

