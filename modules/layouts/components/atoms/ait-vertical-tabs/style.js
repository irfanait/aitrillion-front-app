import styled from 'styled-components';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

export const StyleverticalTabs = styled(Tabs)`
@keyframes slide-left {
    from {
        opacity: 0;
        display:none;
    }
    to {
        opacity: 1;
        display:block;
    }
}

${({ isMobile }) => isMobile && `
overflow:hidden;
.ant-tabs-content-holder{
    display:none;
}
.ant-tabs-nav{
        transform: translateX(0);
        opacity: 1;
        transition: 0.3s linear;
}

&.slide-workflow .ant-tabs-nav{
        transform: translateX(-100%);
        opacity: 0;
        transition: 0.3s linear;
}
&.slide-workflow .ant-tabs-content-holder{
        animation: slide-left 0.3s forwards;
        transform: translateX(-100%);
        width:100%;
        flex: 0 0 100%;
          display:block;
}
        `};

        
.ant-tabs-nav{
    width:   ${({ isMobile }) => isMobile ? '100%': '280px'};
    padding-left: 20px;
    padding-right:20px;
    margin-bottom:82px;
    background:#fff;
}
.ant-tabs-tab[data-node-key="keytop"], .ant-tabs-tab[data-node-key="keybottom"]{
pointer-events: none;
padding:0px !important;
}
.ant-tabs-tab[data-node-key="keytop"] .ant-tabs-tab-btn, .ant-tabs-tab[data-node-key="keybottom"] .ant-tabs-tab-btn{
width:100%
}
.ant-tabs-tab{
    font-size: 13px;
    line-height: 15px;
    text-align: left;
    padding:5px 10px !important;
    border-radius: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    min-height: 32.6px;
    margin: 0px 0px 5px 0px !important;
}
.ant-tabs-tab-btn{
    color:var(--ant-color-text-default);
}
.ant-tabs-tab.ant-tabs-tab-active{
    background: rgb(225, 235, 255);
}
.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
    color:var(--ant-color-text-default) !important;
}    
.ant-tabs-ink-bar{
display:none
}
.ant-tabs-tabpane{
padding:15px 20px 20px 20px;
}


`;

export const StyleVerticalTabPane  = styled(TabPane)`

`;

