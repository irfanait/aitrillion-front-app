import styled from 'styled-components';

export const TableWrapper = styled.div`
  background: #fff;
  border-radius: 8px;

  .ant-table-thead > tr > th:nth-of-type(1),
  .ant-table-tbody > tr > td:nth-of-type(1) {
    padding-left: 10px;
  }
  .ant-table-thead > tr > th:nth-last-of-type(2),
  .ant-table-tbody > tr > td:nth-last-of-type(1) {
    padding-right: 10px;
  }
  .ant-table-thead > tr > th,
  .ant-table-thead > tr > th:before {
    ${({ headerbgcolor }) =>
      headerbgcolor
        ? `background-color: ${headerbgcolor}!important;`
        : ` background-color: #ffffff !important;`}
  }
  .ant-table-thead > tr > th,
  .ant-table-thead > tr > th span:not(.anticon) {
    font-weight: 500;
    font-size: 13px;
    color: var(--ant-color-text-primary);
  }
  .ant-table-tbody > tr > td {
    color: var(--ant-color-text-secondary);
    font-size: 13px;
    ${({ bodycellpadddingtopbottom }) =>
      bodycellpadddingtopbottom
        ? `padding-top: ${bodycellpadddingtopbottom};padding-bottom: ${bodycellpadddingtopbottom};`
        : ``}
  }
  .ant-table-tbody > tr > td,
  .ant-table-tbody > tr > td span:not(.anticon),
  .ant-table-tbody > tr > td div {
    font-size: 13px;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none !important;
  }
  div.ant-table-body {
    ${({ scrollwidth }) =>
      (scrollwidth && `scrollbar-width: ${scrollwidth} !important;`) ||
      `scrollbar-width: thin;`}
    scrollbar-color: #eaeaea transparent;
    // scrollbar-gutter: stable;
  }
  .ant-table-tbody > tr > td .ant-form-item {
    margin-top: auto;
    margin-bottom: auto;
  }
`;

export const TableOnlyWrapper = styled.div`
  .ant-table {
    ${({ marginleft }) =>
      marginleft ? `margin-left: ${marginleft};` : `margin-left:-10px;`}
    ${({ marginright }) =>
      marginright ? `margin-right: ${marginright};` : `margin-right:-10px;`}
  }
  .ant-table-body {
    ${({ verticalScrollminHeight }) =>
      verticalScrollminHeight
        ? `min-height: ${verticalScrollminHeight}px;`
        : `min-height:100px;`}
  }

  /* Custom Pagination Styling */
  .ant-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
  }

  .ant-pagination-options {
    order: -1;
    margin-left: 0;
    margin-right: auto;
  }

  .ant-pagination-options-size-changer {
    width: auto;
  }

  .ant-pagination-options-size-changer .ant-select-selector {
    padding: 4px 11px;
    border-radius: 6px;
  }

  .ant-pagination-total-text {
    display: none;
  }

  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 6px;
  }

  .ant-pagination-item-active {
    background-color: #e6f4ff;
    border-color: #1890ff;
  }

  .ant-pagination-item-active a {
    color: #1890ff;
  }

  @media (max-width: 768px) {
    .ant-pagination {
      justify-content: center;
    }

    .ant-pagination-options {
      order: -1;
      width: 100%;
      margin-bottom: 8px;
    }
  }
`;

export const Header = styled.div`
  margin-bottom: 16px;

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .filter-row {
    //  margin-top: 16px;
  }
`;
