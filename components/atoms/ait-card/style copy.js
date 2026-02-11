import { Card } from 'antd';
import styled from 'styled-components';

export const AitCardWrapper = styled(Card)`
  ${({ margintop }) => margintop && `margin-top: ${margintop};`}
  > .ant-card-head {
    ${({ borderless }) => borderless && `border-bottom: none;`}
    ${({ borderless }) => borderless && `border-bottom: none;`} 
     ${({ headerpadding }) =>
      headerpadding?.md
        ? `padding: ${headerpadding.md};`
        : 'padding:10px 24px 10px 24px;'}
     min-height:auto;
  }
  > .ant-card-head .ant-card-head-title {
    ${({ titlefontsize }) =>
      (titlefontsize && `font-size:${titlefontsize};`) || `font-size:18px;`}
    font-weight:500;
    color: var(--ant-color-text-primary);
  }
  > .ant-card-head {
    ${({ hascustomheader }) => hascustomheader && `padding: 0px 0px 0px 0px;`}
    border-radius: ${({ headerborderradius }) =>
      headerborderradius ? headerborderradius : `8px !important`};
  }
  .custom-card-header {
    ${({ headerpadding, hastabs }) =>
      headerpadding?.md
        ? `padding: ${headerpadding.md};`
        : hastabs
          ? 'padding: 0px 24px 0px 24px;'
          : 'padding: 0px 24px 10px 24px;'}
    ${({ hascustomheader }) =>
      hascustomheader &&
      `            
      border-bottom:2px solid #f0f0f0;
      display:flex;
      justify-content:space-between;
      `}
  }
  .custom-card-header-left {
    ${({ hastabs, hascustomheader }) =>
      hastabs && hascustomheader ? `align-self:end` : `align-self:center`}
  }
  .custom-card-header-right {
    min-height: 62px;
  }
  .custom-card-header-right .ant-row {
    align-items: center;
    height: 100%;
  }

  > .ant-card-body {
    ${({ hascustomheader, bodypadding }) =>
      hascustomheader
        ? `padding: 0px 0px 0px 0px;`
        : bodypadding?.md
          ? `padding: ${bodypadding.md};`
          : 'padding:24px 24px 24px 24px;'}
  }
  .custom-card-body {
    ${({ custombodypadding }) =>
      custombodypadding?.md
        ? `padding:${custombodypadding?.md};`
        : custombodypadding?.xs
          ? `padding:${custombodypadding?.xs};`
          : `padding: 24px 24px 0px 24px;`}
  }
  .custom-card-header-left .ant-tabs-top > .ant-tabs-nav::before {
    display: none;
  }

  .ant-tabs-tab {
    font-size: 16px;
  }
  && .ant-tabs-tab-btn {
    font-weight: 500;
    color: var(--ant-color-text-primary);
  }

  @media (max-width: 768px) {
    .custom-card-header {
      flex-wrap: wrap;
      ${({ headercolreverse }) =>
        headercolreverse && `flex-direction:column-reverse;`}
    }
    .custom-card-header-left,
    .custom-card-header-right {
      width: 100%;
    }
    .custom-card-header-right {
      min-height: auto;
      ${({ headercolreverse }) =>
        headercolreverse && `padding: 15px 0px 0px 0px;`}
    }

    > .ant-card-head .ant-card-head-title {
      font-size: 16px;
      white-space: normal;
    }
    .custom-card-body {
      padding: 0px 20px 20px 20px;
    }

    .custom-card-header {
      ${({ hascustomheader, headerpadding }) =>
        hascustomheader && headerpadding?.sm
          ? `padding: ${headerpadding.sm};`
          : 'padding:20px 20px 10px 20px;'}
    }
    > .ant-card-head {
      ${({ headerpadding }) =>
        headerpadding?.sm
          ? `padding: ${headerpadding.sm};`
          : 'padding:20px 20px 10px 20px;'}
    }
    > .ant-card-body {
      ${({ hascustomheader, bodypadding }) =>
        hascustomheader
          ? `padding: 0px 0px 0px 0px;`
          : bodypadding?.sm
            ? `padding: ${bodypadding.sm};`
            : bodypadding?.xs
              ? `padding: ${bodypadding.xs};`
              : 'padding:1px 20px 10px 20px;'}
    }
    .custom-card-body {
      ${({ custombodypadding }) =>
        custombodypadding?.md
          ? `padding:${custombodypadding?.md};`
          : custombodypadding?.xs
            ? `padding:${custombodypadding?.xs};`
            : `padding: 20px 20px 20px 20px;`}
    }
  }

  @media (max-width: 576px) {
    .custom-card-header {
      ${({ hascustomheader, headerpadding }) =>
        hascustomheader && headerpadding?.xs
          ? `padding: ${headerpadding.xs};`
          : 'padding:20px 16px 10px 16px;'}
    }
    > .ant-card-head {
      ${({ headerpadding }) =>
        headerpadding?.xs
          ? `padding: ${headerpadding.xs};`
          : 'padding:20px 20px 10px 20px;'}
    }
    > .ant-card-body {
      ${({ hascustomheader, bodypadding }) =>
        hascustomheader
          ? `padding: 0px 0px 0px 0px;`
          : bodypadding?.xs
            ? `padding: ${bodypadding.xs};`
            : 'padding:20px 20px 20px 20px;'}
    }
  }
`;
