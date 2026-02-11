import { Collapse } from 'antd';
import styled from 'styled-components';
export const StyledCollapse = styled(Collapse)`
  background: ${({ colorBgContainer }) => colorBgContainer || '#fff'};

  .ant-collapse-item {
    border-top: ${({ borderTop }) =>
      borderTop ? borderTop : '1px solid #F0F0F0'};
    ${({ itemborderedandround }) =>
      itemborderedandround ? 'border:1px solid #F0F0F0 !important;' : ''}
    // overflow: hidden;
    //  transition: all 0.5s ease;
      margin-bottom: -1px;
    // margin-top: 12px;
    //  border-radius: 8px;
    //  overflow: hidden;
    // transition: all 0.5s ease;
    border-radius: ${({ borderRadius }) =>
      borderRadius ? `${borderRadius}px !important` : '0px'};
    margin: ${({ itemSpacing }) => itemSpacing || '12px'};
    margin-bottom: -1px;
  }
  /* Add top border only for first panel */
  .ant-collapse-item:first-of-type {
    // border-radius: unset;
    ${({ firstItemTopspacing }) =>
      (firstItemTopspacing && `margin-top: ${firstItemTopspacing}`) || '20px'};
    border-top: ${({ firstitemtopborder }) =>
      firstitemtopborder || '1px solid #F0F0F0'};
  }
  /* Add bottom border for the last panel */
  .ant-collapse-item:last-of-type {
    border-bottom: ${({ borderBottom }) =>
      borderBottom || '1px solid #F0F0F0'}; /* Divider */
    margin-bottom: ${({ firstItemBottomspacing }) =>
      firstItemBottomspacing || '20px'};
  }
  > .ant-collapse-item > .ant-collapse-header {
    padding: ${({ itemHeaderPadding }) =>
      itemHeaderPadding
        ? `${itemHeaderPadding} !important`
        : '12px 16px !important'};
    display: flex !important;
    justify-content: space-between;
    align-items: ${({ headeralignvertival }) =>
      headeralignvertival || 'flex-start'};
    transition: background-color 0.3s ease;
    min-height: ${({ headerMinHeight }) => headerMinHeight || 'auto'};
  }
  .ant-collapse-expand-icon {
    color: var(--ant-color-text-primary);
    order: 2;
    margin-inline-end: 0 !important;
    margin-left: 8px;
    transition: transform 0.3s ease;
    margin-top: ${({ collapseIconTopSpacing }) =>
      collapseIconTopSpacing || '14px'};
    margin-bottom: ${({ collapseIconBotSpacing }) =>
      collapseIconBotSpacing || '14px'};
    padding-inline-end: 0px !important;
    position: relative;
    transform: rotate(90deg);
    width: 28px;
    height: 28px !important;
    border-radius: 50px;
    background: ${({ extraiconbg }) => extraiconbg};
    flex: 0 0 28px;
    justify-content: center;
  }
  .ant-collapse-content {
    // overflow: hidden;
    // transition:
    //    max-height 0.3s ease,
    //    opacity 0.3s ease;
    //  max-height: 0;
    //   opacity: 0;
    border-top: ${({ bodyBorderTop }) =>
      bodyBorderTop || '1px solid #f0f0f0 !important'};
  }

  .ant-collapse-item-active .ant-collapse-content {
    // max-height: ${({ maxHeight }) =>
      maxHeight ? `${maxHeight}` : '1000px'};
    // opacity: 1;
  }
  .ant-collapse-item-active > .ant-collapse-header .ant-collapse-expand-icon {
    transform: rotate(180deg);
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-5px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
  .custom-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 16px; /* Add spacing between title and right content */
  }
  .header-left {
    font-weight: 500;
    font-size: ${({ titlefontsize }) => titlefontsize || '16px'};
    line-height: 1.5;
    flex: 1;
    display: flex;
    align-items: center;
    color: var(--ant-color-text-primary);
    margin-top: ${({ headerLeftRightTopSpacing }) =>
      headerLeftRightTopSpacing || '14px'};
    gap: 8px;
  }
  .header-icon {
    display: flex;
    align-items: center;
    align-self: ${({ headericonalign }) => headericonalign};
    font-size: 16px; /* Adjust icon size if needed */
  }
  .header-right {
    color: ${({ minimumCustomerCount }) =>
      Number(minimumCustomerCount) > 0 ? 'red' : '#6D767E'};
    font-size: 13px;
    font-weight: 500;
    line-height: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    white-space: nowrap;
    margin-top: ${({ headerLeftRightTopSpacing }) =>
      headerLeftRightTopSpacing || '14px'};
  }
  ${({ screens, itemHeaderPadding, itemBodyPadding }) =>
    screens?.md
      ? `
   .ant-collapse-header {
      padding: ${itemHeaderPadding?.md}!important;
    }
   .ant-collapse-content > .ant-collapse-content-box {
      padding: ${itemBodyPadding?.md}!important;
    }   
  `
      : screens?.sm
        ? `
   .ant-collapse-header {
     padding: ${itemHeaderPadding?.sm}!important;
   }
    .ant-collapse-content > .ant-collapse-content-box {
      padding: ${itemBodyPadding?.sm}!important;
    }
  `
        : screens?.xs
          ? `
    .ant-collapse-header {
     padding: ${itemHeaderPadding?.xs}!important;
    }
    .ant-collapse-content > .ant-collapse-content-box {
      padding: ${itemBodyPadding?.xs}!important;
    }
  `
          : `
   .ant-collapse-header {
      padding: ${itemHeaderPadding?.md}!important;      
    }
    .ant-collapse-content > .ant-collapse-content-box {
      padding: ${itemBodyPadding?.md}!important;
    }
  `}
`;
