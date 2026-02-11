import { Collapse, Flex } from 'antd';
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
.ant-collapse-header.ant-collapse-collapsible-disabled{
    cursor: default;
}
.ant-collapse-header.ant-collapse-collapsible-disabled .ant-collapse-expand-icon{
    display:none!important
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
    .ant-collapse-borderless >.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box{
    padding:10px 0px 20px;
    }
}

`;

export const InnerCollapseWrapper = styled(Collapse)`
 max-height: ${({ screens }) => !screens?.xs ? 'auto': '450px'};
overflow:auto;
padding-right:${({ screens }) => !screens?.xs ? '0px': '10px'};
 background-color:transparent;
 .ant-collapse-item {
    border: 1px solid #E9E9ED;
    border-radius: 12px !important;    
    padding: 16px;
    box-shadow: 0px 5px 10px -7px #0026872A;
}
.ant-collapse-item:not(:last-of-type){
    margin-bottom: 12px;
}   
 .ant-collapse-expand-icon{
    width: 26px;
    height: 26px!important;
    border-radius: 50px;
    flex: 0 0 26px;
    padding:0px !important;
    justify-content:center;
    margin-right:10px;
 }
.ant-collapse-arrow{
display:none!important
}    
.ant-collapse-expand-icon:before {
    content: "";
    position: absolute;
    background: #fff;
    width: 16px;
    height: 16px;
    border: 5px solid #D2D3D9;
    display: inline-block;
    border-radius: 50px;
    outline: 5px solid #D2D3D93D;
    transition: all .2s ease-in-out;
}
.ant-collapse-item.ant-collapse-item-active .ant-collapse-expand-icon:before,
.ant-collapse-item:hover .ant-collapse-expand-icon:before{
    background: #fff;
    border-color: #1A73E8;
    outline: 5px solid #1A73E81A;
}
.ant-collapse-header{
padding:0px !important;
position:static;
}
.ant-collapse-content{
    padding-left:36px;
}
.ant-collapse-content-box{
    padding-left:0px !important;
    padding-bottom:0px !important;
}
.ant-collapse-item{
    border-bottom:none
}
.ant-collapse-header-text h5{
color:var(--ant-color-text-primary);
font-weight:500;
margin-top:0px
}    

.ant-collapse-item:last-of-type{
    margin-bottom:20px
}

@media (max-width:768px){
     .ant-collapse-expand-icon{
        width: 20px;
       height: 20px!important;
       flex: 0 0 20px;
     }
    .ant-collapse-content{
        padding-left:30px;
    }
}
`;

export const AdvanceSetupContainer = styled.div`
border: none;
border-radius: 6px;
padding: 16px;
margin-bottom: 12px;
cursor: pointer;
background:#fafafa;
`;

export const Flexwrap = styled(Flex)`

`;
