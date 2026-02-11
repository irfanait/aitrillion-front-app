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
  .ant-table-thead > tr > th {
    background-color: #ffffff !important;
    padding: 10px 16px;
    line-height: normal;
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
    line-height: normal;
  }
  .ant-table-tbody > tr > td,
  .ant-table-tbody > tr > td span:not(.anticon):not(.ant-tag),
  .ant-table-tbody > tr > td div {
    font-size: 13px;
    color: var(--ant-color-text-secondary);
  }
  .ant-table-tbody > tr > td .ant-btn-color-primary span {
    color: var(--ant-color-primary) !important;
  }
  .ant-table-thead > tr > th:before {
    background-color: #ffffff !important;
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
`;

export const TableOnlyWrapper = styled.div`
  .ant-table {
    ${({ marginleft }) => marginleft && `margin-left: ${marginleft};`}
    ${({ marginright }) => marginright && `margin-right: ${marginright};`}
  }
  .ant-pagination {
    ${({ paginationbottomspace }) =>
      paginationbottomspace
        ? `margin-bottom: ${paginationbottomspace};`
        : 'margin-bottom: 16px;'}
  }
`;

export const Header = styled.div`
  ${({ filterheaderbottomspace }) =>
    filterheaderbottomspace
      ? `margin-bottom: ${filterheaderbottomspace};`
      : 'margin-bottom: 16px;'}

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
