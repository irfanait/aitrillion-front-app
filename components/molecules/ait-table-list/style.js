import styled from 'styled-components';

export const TableWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 0px;
  ${({ marginleft }) => marginleft && `margin-left: ${marginleft};`}
  ${({ marginright }) => marginright && `margin-right: ${marginright};`}

  .ant-table-body{
    scrollbar-width: thin;
    scrollbar-color: #eaeaea transparent;
    //scrollbar-gutter: stable;
  }
  .ant-table-thead >tr>th:nth-of-type(1),.ant-table-tbody >tr>td:nth-of-type(1){
  padding-left:10px
  }
  .ant-table-thead >tr>th:nth-last-of-type(2),.ant-table-tbody >tr>td:nth-last-of-type(1){
  padding-right:10px
  }
  .ant-table-tbody >tr>td,.ant-table-tbody >tr>td > span.ant-typography{
      color:var(--ant-color-text-secondary);
      font-size:13px;
  }
  .ant-table-thead >tr>th{
      background-color: #ffffff !important;
      color:var(--ant-color-text-primary);
      font-weight:500;
      font-size:13px;
  }
  .ant-table-thead >tr>th span:not(.anticon){
   font-weight:500;
    font-size:13px;
  }
  .ant-table-thead >tr>th:before{
      background-color: #ffffff !important;
  }
  .ant-table-tbody > tr:last-child > td {
    border-bottom: none !important;
  }

`;
