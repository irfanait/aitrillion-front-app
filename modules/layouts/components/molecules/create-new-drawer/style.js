import { Button, Col, Row, Typography, Collapse } from 'antd';
const { Panel } = Collapse;
import styled from 'styled-components';
const { Text } = Typography;
import { Tabs } from 'antd';

export const StyleWrapper = styled.div`


`;

export const StyleCollapseMenu = styled(Collapse)`
border:none !important;
margin-bottom:0px !important;
background: #fff !important;
`;

export const StyleCollapseMenuPanel = styled(Panel)`
    background:#fff;
    border-radius:8px !important;
    margin-bottom:10px;
    border:1px solid #EAEBED;
    border-bottom-color:#EAEBED !important;

    .ant-collapse-content{
    border-top:none;
    background:none;
    }
    .ant-collapse-content-box{
    padding:0px 12px 16px 12px!important;
    }

    .ant-collapse-header{
        background:#fff;
        border-radius:8px !important;
        padding:12px 12px 12px 12px!important;
        color:var( --ant-color-text-primary);
    }
    .ant-collapse-header-text,.horizontal-tab-text,.ant-collapse-expand-icon{
     color:var( --ant-color-text-primary);
    }
     .horizontal-tab-text{
     font-weight:500
     }
    .ant-collapse-expand-icon{
        padding-inline-end:0!important;
    } 
    .ant-collapse-arrow{
        transform: rotate(90deg);
    } 
    &.ant-collapse-item-active .ant-collapse-arrow{
      transform: rotate(180deg);
    }           
    &.ant-collapse-item-active,&.ant-collapse-item-active:last-of-type {
    border-color: var(--ant-color-primary);   
    border-bottom-color:var(--ant-color-primary) !important;   
    } 
    .ant-collapse-header{
        flex-direction:row-reverse;
    }
    span.horizontal-tab-head{
        display:flex;
    }
    span.horizontal-tab-head svg{
    margin-right:10px;
    }
    &:last-of-type{
      border-bottom:1px solid #EAEBED !important;
    }

`;

export const Tabheading = styled(Text)`
margin-bottom:8px;
font-weight:500;
display:${({isMobile})=> isMobile ? 'inline-block':'block'};
margin-top:${({isMobile})=> isMobile ? '10px':'0'};
width:100%;
`;

export const StyleVerticaltabTop = styled.div`
width:${({isMobile})=> isMobile ? '100%':'351px'};
max-width:100%;
transition: .2s all linear;
background:#fff;

&.tab-slide-left{
    transform: translateX(-366px);
    transition: .2s all linear;
}
`;

export const StyleHorizontaltabTop = styled.div`
padding-top:15px;
${({isMobile})=> isMobile && 'position: sticky;top: 0;left: 0;right: 0;z-index: 5;background: #fff;'}
`;

export const StyleVerticalTabs = styled(Tabs)`
transition: .2s all linear;

.ant-tabs-content-holder{
 display:${({isMobile})=> isMobile && 'none'}
}    
${({isMobile})=> isMobile && '.ant-tabs-ink-bar{display:none}'}
&.tab-slide-left .ant-tabs-content-holder{
    transform: translateX(0);
    transition: .2s all linear;
    left:0px;
    display:block;
    overflow-y:auto;
}

> .ant-tabs-nav{
width:${({isMobile})=> isMobile ? '100%':'351px'};
background:#fff;
max-width:100%;
position:relative;
z-index:2;
}

&.tab-slide-left .ant-tabs-nav{
    transform: translateX(-100%);
    transition: .2s all linear;
}
> .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list{
    padding:5px 15px 0px 0px;
}

> .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > .ant-tabs-tab {
    border: 1px solid #EAEBED;
    padding: 12px 12px;
    border-radius: 16px;
    text-decoration: none;
    cursor: pointer;
}
> .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > .ant-tabs-tab:hover,
> .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > .ant-tabs-tab.ant-tabs-tab-active{
   border-color: #1A73E8;
    box-shadow: 0px 8px 18px 0px #0033771A;
}  
> .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > .ant-tabs-tab:hover .vertical-tab-title{
   color:  var(--ant-color-primary);   
   }

> .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > .ant-tabs-tab > .ant-tabs-tab-btn{
   width:100%;
}
    .vertical-tab-icon {
        margin-right: 10px;
        flex:0 0 40px;
        width: 40px;
        height: 40px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #E6EDF6;
        background: #F6FAFF;
        border-radius: 9px;
    }
    .vertical-tab-head{
     display:flex;     
    }
    .vertical-tab-text{
     flex: 1 1 auto;
    }
    .vertical-tab-title{
    color :var( --ant-color-text-primary);
    font-size: 16px;
    font-weight: 500;
    line-height: 18.75px;
    text-align: left;
    }
    .vertical-tab-text{
    padding-right:10px;
    }
    
    .vertical-tab-description{
      color :var( --ant-color-text-secondary);
      font-size:13px;
      line-height:15.23px;
      white-space:normal;
      margin-bottom: 0px;
      margin-top: 4px;
      text-align:left;
    }
   .ant-tabs-tab.ant-tabs-tab-active .vertical-tab-title{
   color:  var(--ant-color-primary);
   }
   >.ant-tabs-content-holder >.ant-tabs-content>.ant-tabs-tabpane{
    padding-left:15px;padding-right:15px
  }
  > .ant-tabs-content-holder{
    position:absolute;
    top:0;
    right:0;
    left:367px;
    z-index:1;
    bottom:0;
  }
    

@media (max-width:992px){
    > .ant-tabs-content-holder{
        // display:none
    }
}
`;

export const StyleHorizontalTabs = styled(Tabs)`
margin-bottom:20px !important;

.ant-tabs-nav-list{width:100%; gap:6px;}
.ant-tabs-nav-list .ant-tabs-tab:not(.ant-tabs-tab-active){
    border-radius: 8px !important;
}
.ant-tabs-nav-list .ant-tabs-tab {
    border: 1px solid #EAEBED;
    background: #FFFFFF!important;
    color: #232E41!important;
    font-size: 14px;
    font-weight: 500;
    line-height: 16.41px;
    text-align: left;
    padding: 10px 12px;
    flex: 0 0 calc(50% - 3px);
    width:calc(50% - 3px);
}
.ant-tabs-nav-list .ant-tabs-tab[data-node-key="v1-h1-1"],
.ant-tabs-nav-list .ant-tabs-tab[data-node-key="v1-h1-2"],
.ant-tabs-nav-list .ant-tabs-tab[data-node-key="v1-h1-3"]{
 flex: 0 0 calc(33.33% - 4.5px);
 width:calc(33.33% - 4.5px);
}

.ant-tabs-tab-btn{
 width:100%;
}
.horizontal-tab-head{
    display:flex;
    align-items:center;
    gap:6px;   
    color:var( --ant-color-text-primary);
}
.horizontal-tab-head .anticon anticon-down{
margin-left:auto;
margin-right:0px;
}
.horizontal-tab-text{
flex:1 1 auto;
white-space: nowrap;
text-overflow: ellipsis;
overflow: hidden;
max-width: 99%;
}
.ant-tabs-tab .anticon svg{
transition: transform .2s linear;
}
.ant-tabs-tab.ant-tabs-tab-active .anticon svg{
transform: rotate(180deg);
transition: transform .2s linear;
}
.ant-tabs-tabpane{
padding:10px
}
.ant-tabs-nav{
margin-bottom:0px;
}
.ant-tabs-content{
text-align:center;
}
.ant-tabs-tabpane.ant-tabs-tabpane-active {
    border: 1px solid var(--ant-color-primary);
    border-radius: 0px 0px 8px 8px;
    padding: 10px 12px;
    box-shadow:0px 6px 10px 0px #00225021;
}
> .ant-tabs-nav::before{
 border-color:transparent;
}
.ant-tabs-tab.ant-tabs-tab-active{
    border-color: var(--ant-color-primary);
}
> .ant-tabs-nav{
    position: relative;
    z-index: 2;
    top: 1px;
    width: calc(100% - 2px);
}
> .ant-tabs-content-holder{
    position: relative;
    z-index: 1;
}
.ant-tabs-tab:not(.ant-tabs-tab-active){
margin-bottom:5px
}
.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
margin-bottom:5px
}
.ant-tabs-nav-wrap {
  overflow: visible !important;
}

.ant-tabs-nav-list {
  transform: none !important;
}

.ant-tabs-nav-more {
  display: none !important;
}


@media (max-width:992px){
.ant-tabs-tab{width:100%}
}
`;

export const StyleButton = styled(Button)`
cursor:pointer
`;

export const StyleDrawerheading = styled(Row)`
margin-bottom:${({ spacingbottom }) => spacingbottom || '10px'};
h5{margin-bottom:0px}

`;

