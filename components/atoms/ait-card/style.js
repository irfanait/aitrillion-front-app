import { Card } from 'antd';
import styled from 'styled-components';

export const AitCardWrapper = styled(Card)`
  ${({
    hascustomheader,
    custombodypadding,
    bodypadding,
    headerpadding,
    hastabs,
    screens,
  }) =>
    screens?.md
      ? `
          > .ant-card-head {
            padding: ${headerpadding?.md ? headerpadding?.md : '20px 24px 10px 24px'};
          }
          > .ant-card-body {
            padding: ${hascustomheader ? `0px 0px 0px 0px;` : bodypadding?.md ? bodypadding?.md : '20px 24px 24px 24px'};
          }
          .custom-card-header {
            padding: ${hascustomheader && headerpadding?.md ? headerpadding?.md : '10px 24px 10px 24px'};
            padding-bottom: ${hascustomheader && hastabs && '0px'};
            padding-top: ${hascustomheader && hastabs && '5px'};
          }
          .custom-card-body {
            padding: ${hascustomheader && custombodypadding?.md ? custombodypadding?.md : '24px 24px 24px 24px'};
          }    
  `
      : screens?.sm
        ? `
    .custom-card-header {
      padding: ${hascustomheader && headerpadding?.sm ? headerpadding?.sm : '10px 20px 10px 20px'};
      padding-bottom: ${hascustomheader && hastabs && '0px'};
      padding-top: ${hascustomheader && hastabs && '5px'};
    }
    .custom-card-body {
        padding: ${hascustomheader && custombodypadding?.sm ? custombodypadding?.sm : '20px 20px 20px 20px'};
    }
    > .ant-card-head {
      padding: ${headerpadding?.sm ? headerpadding?.sm : '20px 20px 10px 20px'};
    }
    > .ant-card-body {
       padding: ${hascustomheader ? `0px 0px 0px 0px;` : bodypadding?.sm ? bodypadding?.sm : '20px 20px 20px 20px'};
    }
  `
        : screens?.xs
          ? `
   .custom-card-header {
      padding: ${hascustomheader && headerpadding?.xs ? headerpadding?.xs : '10px 20px 10px 20px'};
      padding-bottom: ${hascustomheader && hastabs && '0px'};
      padding-top: ${hascustomheader && hastabs && '5px'};
    }
    .custom-card-body {
      padding: ${hascustomheader && custombodypadding?.xs ? custombodypadding?.xs : '20px 20px 20px 20px'};      
    }

      > .ant-card-head {
      padding: ${headerpadding?.xs ? headerpadding?.xs : '20px 20px 10px 20px'};
    }
    > .ant-card-body {
       padding: ${hascustomheader ? `0px 0px 0px 0px;` : bodypadding?.xs ? bodypadding?.xs : '20px 20px 20px 20px'};
    }
  `
          : `
    .custom-card-header {
      padding: 10px 24px 10px 24px;
      padding-bottom: ${hascustomheader && hastabs && '0px'};
      padding-top: ${hascustomheader && hastabs && '5px'};
    }
    .custom-card-body {
      padding: 24px 24px 24px 24px;
    }
      > .ant-card-head {
     // padding: 20px 20px 10px 20px;
    }

  `}

  ${({ margintop }) => margintop && `margin-top: ${margintop};`}
    /* ---- BORDER OVERRIDE ---- */
     &.ant-card-bordered {
    border: 1px solid ${({ bordercolor }) => bordercolor || '#EDEAEA'} !important;
    border-radius: ${({ borderradius }) => borderradius || '12px'} !important;
  }

  > .ant-card-head {
    ${({ borderless }) => borderless && `border-bottom: none;`}
    ${({ borderless }) => borderless && `border-bottom: none;`}
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
      headerborderradius ? headerborderradius : `8px 8px 0px 0px !important`};
  }
  .custom-card-header {
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
  }
  .custom-card-header-left {
    ${({ hastabs, hascustomheader }) =>
      hastabs && hascustomheader ? `align-self:end` : `align-self:center`}
  }
  .custom-card-header-right {
    //min-height: 62px;
  }
  .custom-card-header-right .ant-row {
    align-items: center;
    height: 100%;
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
      ${({ cardheadernowrap }) =>
        cardheadernowrap ? `flex-wrap: nowrap` : 'flex-wrap: wrap'};
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
  }
`;
